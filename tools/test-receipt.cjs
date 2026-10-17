const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
function files(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);}
const inputs=[...files('src'),...files('tools'),...files('.github/workflows'),'build.ps1','test.ps1','publish-web.ps1'].sort();
const receipt={inputs:hash(inputs.map(f=>f+'\0'+hash(fs.readFileSync(path.join(root,f)))).join('\n')),artifacts:Object.fromEntries(['outra-vida.html','desktop/outra-vida.html'].map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]))};
const target=path.join(root,'test-results/aprovado.json');
const candidate=path.join(root,'test-results/em-teste.json');
if(process.argv[2]==='prepare'){
 if(fs.existsSync(target))fs.unlinkSync(target);
 fs.writeFileSync(candidate,JSON.stringify(receipt));
}else if(process.argv[2]==='write'){
 if(!fs.existsSync(candidate)||JSON.stringify(JSON.parse(fs.readFileSync(candidate,'utf8')))!==JSON.stringify(receipt))throw Error('Arquivos modificados durante a execução dos testes');
 const report=fs.readFileSync(path.join(root,'test-results/relatorio.txt'),'utf8');
 if(!/^ERROS: 0$/m.test(report))throw Error('Relatório não aprovou a simulação');
 fs.writeFileSync(target,JSON.stringify(receipt,null,2));
}else if(process.argv[2]==='verify'){
 if(!fs.existsSync(target)||JSON.stringify(JSON.parse(fs.readFileSync(target,'utf8')))!==JSON.stringify(receipt))throw Error('Execute test.ps1: aprovação ausente ou arquivos modificados');
 console.log('Fontes e HTML conferem com a execução aprovada.');
}else throw Error('Use write ou verify');
