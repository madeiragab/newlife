# Compila NewLife.apk sem Gradle: aapt2 (recursos) -> javac -> d8 (dex) -> zipalign -> apksigner.
# Precisa do Android SDK em %LOCALAPPDATA%\Android\Sdk (platforms;android-34 e build-tools;34.0.0) e de um JDK 17.
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
$sdk = "$env:LOCALAPPDATA\Android\Sdk"; $bt = "$sdk\build-tools\34.0.0"; $jar = "$sdk\platforms\android-34\android.jar"
if (-not $env:JAVA_HOME) { $env:JAVA_HOME = (Get-ChildItem "$env:ProgramFiles\Eclipse Adoptium" -Directory | Select-Object -First 1).FullName }
$jbin = "$env:JAVA_HOME\bin"
$A = Join-Path $root 'android'; $O = Join-Path $env:LOCALAPPDATA 'Temp\outravida-build\apk'
if (Test-Path $O) { Remove-Item $O -Recurse -Force }
New-Item -ItemType Directory -Force "$O\gen","$O\classes","$O\dex","$O\assets" | Out-Null

# 1) página do jogo (fontes embutidas, sem o modo desktop)
& (Join-Path $root 'build.ps1') | Out-Null
$html = [IO.File]::ReadAllText((Join-Path $root 'desktop\outra-vida.html'), [Text.Encoding]::UTF8).Replace('<script>window.DESKTOP=1</script>', '')
[IO.File]::WriteAllText("$O\assets\index.html", $html, (New-Object Text.UTF8Encoding $false))

# 2) ícones (mesmo desenho do .exe)
$py = "$env:LOCALAPPDATA\Temp\outravida-build\env\Scripts\python.exe"
$ico = "$env:LOCALAPPDATA\Temp\outravida-build\icon-src.png"
if (-not (Test-Path $ico)) { throw 'Rode make-exe.ps1 antes (ele gera icon-src.png).' }
Copy-Item "$A\res" "$O\res" -Recurse -Force
& $py (Join-Path $A 'make_icons.py') $ico "$O\res" | Out-Null

# 3) recursos e manifesto (a versão sobe sozinha a cada compilação, para instalar por cima)
$vc = [int][math]::Floor(((Get-Date) - [datetime]'2026-01-01').TotalMinutes); $vn = '1.' + (Get-Date -Format 'yyMMdd.HHmm')
& "$bt\aapt2.exe" compile --dir "$O\res" -o "$O\res.zip"
& "$bt\aapt2.exe" link -o "$O\base.apk" -I $jar --manifest "$A\AndroidManifest.xml" -A "$O\assets" "$O\res.zip" --java "$O\gen" --min-sdk-version 21 --target-sdk-version 34 --version-code $vc --version-name $vn --auto-add-overlay
if ($LASTEXITCODE) { throw 'aapt2 link falhou' }

# 4) Java -> classes -> dex
$srcs = @(Get-ChildItem "$A\src","$O\gen" -Recurse -Filter *.java | ForEach-Object FullName)
& "$jbin\javac.exe" -nowarn -source 8 -target 8 -bootclasspath $jar -d "$O\classes" @srcs 2>&1 | Where-Object { $_ -notmatch 'warning|^Note|1 warning|2 warnings' }
if ($LASTEXITCODE) { throw 'javac falhou' }
$cls = @(Get-ChildItem "$O\classes" -Recurse -Filter *.class | ForEach-Object FullName)
& "$bt\d8.bat" --lib $jar --min-api 21 --release --output "$O\dex" @cls
if ($LASTEXITCODE) { throw 'd8 falhou' }

# 5) junta o dex no apk, alinha e assina
& $py -c "import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'a'); z.write(sys.argv[2],'classes.dex'); z.close()" "$O\base.apk" "$O\dex\classes.dex"
& "$bt\zipalign.exe" -p -f 4 "$O\base.apk" "$O\aligned.apk"
$ks = Join-Path $A 'newlife.keystore'; $kp = Join-Path $A 'keystore-senha.txt'
if (-not (Test-Path $ks)) {
  $pass = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
  [IO.File]::WriteAllText($kp, $pass)
  & "$jbin\keytool.exe" -genkeypair -keystore $ks -storepass $pass -keypass $pass -alias newlife -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=NewLife, O=NewLife, C=BR' 2>&1 | Out-Null
}
$pass = [IO.File]::ReadAllText($kp).Trim()
& "$bt\apksigner.bat" sign --ks $ks --ks-pass "pass:$pass" --ks-key-alias newlife --out (Join-Path $root 'NewLife.apk') "$O\aligned.apk"
if ($LASTEXITCODE) { throw 'assinatura falhou' }
& "$bt\apksigner.bat" verify (Join-Path $root 'NewLife.apk')
"apk: " + [math]::Round((Get-Item (Join-Path $root 'NewLife.apk')).Length/1MB,2) + " MB"

