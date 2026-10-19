// Runner sem dependências: Node 22+ conversa com o Edge pelo protocolo DevTools.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 const [edge,page,report]=process.argv.slice(2);
 if(!edge||!page||!report)throw Error('Uso: node test-browser.cjs EDGE PAGINA RELATORIO');
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'newlife-test-'));
 const err=fs.openSync(report+'.edge.log','w');
 const proc=spawn(edge,['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:['ignore','ignore',err]});
 let ws,timer,closeBrowser,last='Inicialização',finished=false;
 const inicio=Date.now();
 try{
  const active=path.join(profile,'DevToolsActivePort');
  let port,target;
  while(Date.now()-inicio<20000){
   try{const value=fs.readFileSync(active,'utf8').split('\n')[0].trim();if(/^\d+$/.test(value)){port=value;break;}}
   catch(e){if(!['ENOENT','EBUSY','EACCES','EPERM'].includes(e.code))throw e;}
   await sleep(100);
  }
  if(!port)throw Error('Edge não liberou DevToolsActivePort em 20 segundos');
  while(Date.now()-inicio<25000){
   try{const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();target=targets.find(t=>t.type==='page');if(target)break;}catch(e){}
   await sleep(100);
  }
  if(!target)throw Error('Edge sem página de teste');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  let seq=0;const pending=new Map();
  let resolveDone,rejectDone;
  const done=new Promise((a,b)=>{resolveDone=a;rejectDone=b;});
  ws.onmessage=e=>{
   const m=JSON.parse(e.data);
   if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}return;}
   if(m.method==='Runtime.bindingCalled'&&m.params.name==='nlTestNotify'){
    const result=JSON.parse(m.params.payload);
    if(result.done){finished=true;resolveDone(result);}
    else {last=result.teste+' · '+result.acoes+' ações';console.log('Progresso: '+last);}
   }
   if(m.method==='Runtime.exceptionThrown')rejectDone(Error(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text));
  };
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  closeBrowser=()=>send('Browser.close');
  await send('Runtime.enable');await send('Page.enable');
  await send('Runtime.addBinding',{name:'nlTestNotify'});
  const continuidade=['1.59','1.60'].map(versao=>({versao,save:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/save-'+versao+'.json'),'utf8'))}));
  const fixture=fs.readFileSync(path.join(__dirname,'fixtures/save-1.46.json'),'utf8');
  const migracao=fs.readdirSync(path.join(__dirname,'fixtures')).map(n=>n.match(/^save-([\d.]+)\.json$/)).filter(Boolean).map(x=>({versao:x[1],save:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',x[0]),'utf8'))})).sort((a,b)=>parseFloat(a.versao)-parseFloat(b.versao));
  await send('Page.addScriptToEvaluateOnNewDocument',{source:'window.NL_SAVE_FIXTURE='+fixture+';window.NL_CONT_FIXTURES='+JSON.stringify(continuidade)+';window.NL_MIG_FIXTURES='+JSON.stringify(migracao)+';'});
  timer=setTimeout(()=>rejectDone(Error('Limite de 12 minutos; último progresso: '+last)),720000);
  send('Page.navigate',{url:pathToFileURL(page).href+'#teste'}).catch(rejectDone);
  const result=await done;
  fs.writeFileSync(report,result.text,'utf8');
  if(result.economia)fs.writeFileSync(report+'.economia.json',JSON.stringify(result.economia,null,2));
  if(result.continuidade)fs.writeFileSync(report+'.continuidade.json',JSON.stringify(result.continuidade,null,2));
  if(result.playtests)fs.writeFileSync(report+'.trajetorias.json',JSON.stringify(result.playtests,null,2));
  console.log('Duração: '+((Date.now()-inicio)/1000).toFixed(1)+' s');
  const limit=Number(process.env.NL_REPORT_LIMIT)||3000;
  console.log(result.text.slice(0,limit));
  if(result.errors!==0)throw Error(result.errors+' erro(s) na simulação');
  console.log('PASSOU: 0 erros');
 }finally{
  clearTimeout(timer);if(closeBrowser)await Promise.race([closeBrowser().catch(()=>{}),sleep(2000)]);if(ws)ws.close();
  // /T inclui os renderizadores criados pelo processo que este runner iniciou.
  if(process.platform==='win32')await new Promise(resolve=>{const kill=spawn('taskkill',['/PID',String(proc.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});kill.on('exit',resolve);kill.on('error',resolve);});
  else proc.kill('SIGKILL');
  fs.closeSync(err);
  if(!finished)fs.writeFileSync(report,'INCOMPLETO: '+last+'\n','utf8');
  // Só remove o diretório temporário exclusivo criado acima.
  if(path.dirname(profile)===os.tmpdir()&&path.basename(profile).startsWith('newlife-test-')){try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:200});}catch(e){console.warn('Perfil temporário preservado por bloqueio do Windows: '+profile);}}
 }
}
run().catch(e=>{console.error('FALHOU: '+e.stack);process.exitCode=1;});
