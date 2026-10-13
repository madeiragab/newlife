param([string]$Exe, [string]$Arg = '', [string]$Out, [int]$Wait = 6)
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W { [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr dc, uint f);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware(); }
"@
[W]::SetProcessDPIAware() | Out-Null
Get-Process | Where-Object { $_.MainWindowTitle -eq 'NewLife' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Process $Exe -ArgumentList (@('--perfil-teste') + ($Arg -split ' ' | Where-Object { $_ }))
$deadline = (Get-Date).AddSeconds(30)
do { Start-Sleep -Milliseconds 400; $w = Get-Process | Where-Object { $_.MainWindowTitle -eq 'NewLife' } | Select-Object -First 1 } until ($w -or (Get-Date) -gt $deadline)
if (-not $w) { 'janela não apareceu'; exit 1 }
Start-Sleep -Seconds $Wait
$h = $w.MainWindowHandle; $r = New-Object W+RECT; [W]::GetWindowRect($h, [ref]$r) | Out-Null
$bmp = New-Object System.Drawing.Bitmap ($r.R - $r.L), ($r.B - $r.T)
$g = [System.Drawing.Graphics]::FromImage($bmp); $dc = $g.GetHdc(); [W]::PrintWindow($h, $dc, 2) | Out-Null; $g.ReleaseHdc($dc); $g.Dispose()
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
"ok $($r.R - $r.L)x$($r.B - $r.T)"
