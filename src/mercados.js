// Mercados nacionais em moeda comum: cotação local / câmbio simulado.
function mercadoIndice(pais,tipo){const w=mundo(pais);return w.indices[tipo]/w.cambio;}
function mercadoCusto(){return .45*mercadoIndice(S.me.country,'alimentos')+.55*mercadoIndice(S.me.country,'servicos');}
// Migração sem reprecificar bens nem substituir juros de contratos antigos.
function mercadosMigrar(s){
 if(!s?.me)return s;
 for(const a of s.me.assets||[])if(['casa','carro'].includes(a.k)&&!a.country)a.country=s.me.country;
 if(s.me.biz&&!s.me.biz.country)s.me.biz.country=s.me.country;
 return s;
}
fixSave=(o=>function(s){return mercadosMigrar(o(s));})(fixSave);
emigrate=(o=>function(){mercadosMigrar(S);return o.apply(this,arguments);})(emigrate);
houseListings=(o=>function(){const m=S.me;if(m.yr.casasPais!==m.country||m.yr.casasAno!==S.year||!Array.isArray(m.yr.houses)){const idx=mercadoIndice(m.country,'imoveis');m.yr.houses=o.apply(this,arguments).map(l=>({...l,v:Math.max(1000,Math.round(l.v*idx/100)*100),country:m.country,mercadoAno:S.year,mercadoIndice:idx}));m.yr.casasPais=m.country;m.yr.casasAno=S.year;}return m.yr.houses;})(houseListings);
carListings=(o=>function(){const m=S.me;if(m.yr.carrosPais!==m.country||m.yr.carrosAno!==S.year||!Array.isArray(m.yr.cars)){m.yr.cars=null;const idx=mercadoIndice(m.country,'veiculos');m.yr.cars=o.apply(this,arguments).map(l=>({...l,v:Math.max(100,Math.round(l.v*idx/100)*100),country:m.country,mercadoAno:S.year,mercadoIndice:idx}));m.yr.carrosPais=m.country;m.yr.carrosAno=S.year;}return m.yr.cars;})(carListings);
function mercadoValor(a){if(!['casa','carro'].includes(a.k))return 1;const pais=a.country||(a.country=S.me.country),idx=mercadoIndice(pais,a.k==='casa'?'imoveis':'veiculos');if(!a.mercadoIndice){a.mercadoIndice=idx;a.mercadoAno=S.year;return 1;}if(a.mercadoAno===S.year)return 1;const f=idx/a.mercadoIndice;a.mercadoIndice=idx;a.mercadoAno=S.year;return macroLim(f,.5,1.5);}
buy=(o=>function(kind,l,fin){if(l.country&&(l.country!==S.me.country||l.mercadoAno!==S.year))return 'Essa oferta pertence a outro país ou ano. Consulte o mercado atual.';const n=S.me.assets.length,r=o.apply(this,arguments);for(const a of S.me.assets.slice(n)){if(!['casa','carro'].includes(kind))continue;a.country=l.country||S.me.country;a.mercadoIndice=mercadoIndice(a.country,kind==='casa'?'imoveis':'veiculos');a.mercadoAno=S.year;if(a.loan){a.loanRate=mundo(a.country).juros;const j=a.loanRate;a.pay=Math.round(a.loan*j/(1-Math.pow(1+j,-25)));}}return r;})(buy);
yearAssets=(o=>function(){for(const a of S.me.assets){if(a.loan&&a.loanRate)a.loan=Math.round(a.loan*(1+a.loanRate));if(a.k==='carro')a.value=Math.max(1,Math.round(a.value*mercadoValor(a)));}return o.apply(this,arguments);})(yearAssets);
V.asset=(o=>function(a){const r=o(a);if(r&&a.country)r.items.unshift({html:'<div class="card">'+kv('Mercado de origem',countryOf(a.country).n)+(a.loanRate?kv('Juros anuais do contrato',(a.loanRate*100).toFixed(1)+'%'):'')+'<p>O valor acompanha o mercado deste país, mesmo depois de emigrar.</p></div>'});return r;})(V.asset);
