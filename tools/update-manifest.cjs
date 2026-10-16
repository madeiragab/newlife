// Hash the staged Git blob: these are the exact bytes served by Pages.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto');
const data=cp.execFileSync('git',['show',':app.html'],{maxBuffer:20*1024*1024});
const v=data.toString('utf8').match(/NL_VER='(\d+)'/)[1];
fs.writeFileSync('version.json',JSON.stringify({v,size:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')}));
