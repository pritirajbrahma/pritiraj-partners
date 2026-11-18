(function(){
 /* reveal on scroll */
 var els=[].slice.call(document.querySelectorAll('.rv'));function all(){els.forEach(function(e){e.classList.add('on')})}
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){all()}else{
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}})},{rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e)});setTimeout(all,4000)}
 /* enquiry forms */
 var A=atob('cHJpdGlyYWpiMThAZ21haWwuY29t');
 var TT={investor:'Request the investor deck',mandate:'Begin a mandate',other:'Write to Pritiraj Brahma'};
 function setP(f,p){f.querySelectorAll('[data-g]').forEach(function(g){var on=g.getAttribute('data-g')===p;g.hidden=!on;g.querySelectorAll('input,select').forEach(function(i){i.disabled=!on})});
  var r=f.querySelector('input[name=purpose][value='+p+']');if(r)r.checked=true;var t=f.querySelector('[data-ttl]');if(t)t.textContent=TT[p];var d=f.querySelector('.done');if(d)d.hidden=true}
 function v(f,n){var el=[].slice.call(f.elements).filter(function(e){return e.name===n&&!e.disabled})[0];return el?el.value.trim():''}
 document.querySelectorAll('[data-form]').forEach(function(f){
  setP(f,'investor');
  f.querySelectorAll('input[name=purpose]').forEach(function(r){r.addEventListener('change',function(){setP(f,r.value)})});
  f.addEventListener('submit',function(ev){ev.preventDefault();
   var bad=[].slice.call(f.querySelectorAll('[required]')).filter(function(i){return !i.disabled&&!i.checkValidity()});
   f.querySelectorAll('.bad').forEach(function(i){i.classList.remove('bad')});bad.forEach(function(i){i.classList.add('bad')});
   if(bad.length){bad[0].focus();return}
   var p=f.querySelector('input[name=purpose]:checked').value,L=[],s;
   function add(k,n){var x=v(f,n);if(x)L.push(k+': '+x)}
   add('Name','name');add('Organisation','org');add('Reply to','email');
   if(p==='investor'){add('Role','role');add('Cheque size','cheque');add('Fund size','fund');add('Level of interest','interest');add('Timeline','when');
    s='East & Ember Seed | Investor deck request | '+v(f,'org')+' | '+v(f,'cheque')}
   else if(p==='mandate'){add('Represents','client');add('Scale','scale');add('Timeline','when');
    s='Pritiraj & Partners | Mandate enquiry | '+v(f,'org')+' | '+v(f,'scale')}
   else{add('Topic','topic');s='Enquiry | '+v(f,'topic')+' | '+v(f,'org')}
   var note=v(f,'note');if(note)L.push('','Note: '+note);
   location.href='mailto:'+A+'?subject='+encodeURIComponent(s)+'&body='+encodeURIComponent(L.join('\n')+'\n');
   var d=f.querySelector('.done');if(d)d.hidden=false});
 });
 var dlg=document.getElementById('enquire');
 document.querySelectorAll('[data-enquire]').forEach(function(a){a.addEventListener('click',function(ev){
  if(!dlg||!dlg.showModal)return;ev.preventDefault();setP(dlg.querySelector('form'),a.getAttribute('data-enquire'));dlg.showModal();
  var first=dlg.querySelector('input[name=name]');if(first)first.focus()})});
 if(dlg){dlg.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){dlg.close()})});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()})}
 var cf=document.querySelector('.cform [data-form]');if(cf){var h=location.hash.slice(1);if(TT[h])setP(cf,h)}
 /* writing filter */
 var rows=[].slice.call(document.querySelectorAll('.wr'));if(rows.length){
  var cat='',q='',cnt=document.querySelector('.wc'),inp=document.querySelector('.wq');
  function upd(){var n=0;rows.forEach(function(r){var ok=(!cat||r.getAttribute('data-cat')===cat)&&(!q||r.getAttribute('data-hay').indexOf(q)>-1);r.hidden=!ok;if(ok)n++});
   if(cnt)cnt.textContent=n+(n===1?' essay':' essays')+(cat?' in '+cat:'')}
  document.querySelectorAll('.chp').forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-cat');
   document.querySelectorAll('.chp').forEach(function(x){x.setAttribute('aria-pressed',x===b)});upd()})});
  if(inp)inp.addEventListener('input',function(){q=inp.value.trim().toLowerCase();upd()});upd()}
})();
(function(){
 var tls=[].slice.call(document.querySelectorAll('[data-tl]'));if(!tls.length)return;
 function upd(){var vh=innerHeight*.62;tls.forEach(function(t){var r=t.getBoundingClientRect();var p=Math.max(0,Math.min(1,(vh-r.top)/r.height));t.style.setProperty('--p',p.toFixed(3));
  t.querySelectorAll('li').forEach(function(li){var b=li.getBoundingClientRect();li.classList.toggle('past',b.top+30<vh)})})}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){tls.forEach(function(t){t.style.setProperty('--p',1);t.querySelectorAll('li').forEach(function(li){li.classList.add('past')})});return}
 addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();

(function(){
 var d=document.querySelector('.bkd');if(!d)return;var rows=[].slice.call(document.querySelectorAll('.wr'));
 function openBook(b){var cat=b.getAttribute('data-cat');var t=b.querySelector('.bk-t').textContent,v=b.querySelector('.bk-v').textContent,n=b.querySelector('.bk-n').textContent;
  d.querySelector('.bv').textContent=v;d.querySelector('.bt').textContent=t;d.querySelector('.bn').textContent=n;
  d.querySelector('.cover .bk-v').textContent=v;d.querySelector('.cover .bk-t').textContent=t;
  var ol=d.querySelector('.toc');ol.innerHTML='';
  rows.filter(function(r){return !cat||r.getAttribute('data-cat')===cat}).forEach(function(r){var li=document.createElement('li'),a=document.createElement('a');a.href=r.getAttribute('href');
   var bb=document.createElement('b');bb.textContent=r.querySelector('b').textContent;var sm=document.createElement('small');sm.textContent=r.querySelector('.wk').textContent;
   var w=document.createElement('span');w.appendChild(bb);w.appendChild(sm);a.appendChild(w);li.appendChild(a);ol.appendChild(li)});
  d.classList.remove('open','turn');if(d.showModal)d.showModal();else d.setAttribute('open','');
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('open')})});d.querySelector('.bp.r').scrollTop=0}
 document.querySelectorAll('.bk').forEach(function(b){b.addEventListener('click',function(){openBook(b)})});
 function close(){d.classList.remove('open','turn');d.close()}
 d.querySelector('.toc').addEventListener('click',function(e){var a=e.target.closest('a');if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();if(d.classList.contains('turn'))return;d.classList.add('turn');var h=a.href;setTimeout(function(){location.href=h},matchMedia('(prefers-reduced-motion: reduce)').matches?0:880)});
 addEventListener('pageshow',function(){d.classList.remove('turn')});
 d.querySelectorAll('[data-bclose]').forEach(function(x){x.addEventListener('click',close)});d.addEventListener('click',function(e){if(e.target===d)close()});
})();
(function(){var hd=document.querySelector('.hdr,.uni-top');if(!hd)return;var h=document.documentElement;
function mk(c){var d=document.createElement('div');d.className='proll '+c;d.setAttribute('aria-hidden','true');document.body.appendChild(d);return d}
var T=mk('t'),B=mk('b'),t=0,cv={},STEP=5;
function solid(c){return c&&c!=='transparent'&&!/rgba\([^)]*,\s*0\)$/.test(c)}
function imgPx(e,x,y){try{var k=e.currentSrc||e.src,o=cv[k];if(!o){if(!e.complete||!e.naturalWidth)return null;var C=document.createElement('canvas');C.width=e.naturalWidth;C.height=e.naturalHeight;var g=C.getContext('2d');g.drawImage(e,0,0);o=cv[k]={g:g,w:C.width,h:C.height}}
var r=e.getBoundingClientRect(),s=Math.max(r.width/o.w,r.height/o.h),dx=(r.width-o.w*s)/2,dy=(r.height-o.h*s)/2,px=Math.floor((x-r.left-dx)/s),py=Math.floor((y-r.top-dy)/s);
if(px<0||py<0||px>=o.w||py>=o.h)return null;var d=o.g.getImageData(px,py,1,1).data;return 'rgb('+d[0]+','+d[1]+','+d[2]+')'}catch(err){return null}}
function colAt(x,y){var e=document.elementFromPoint(x,y);while(e&&e!==h){if(e.tagName==='IMG'){var p=imgPx(e,x,y);if(p)return p}var cs=getComputedStyle(e);if(solid(cs.backgroundColor))return cs.backgroundColor;e=e.parentElement}return getComputedStyle(document.body).backgroundColor}
function strip(el,y){var r=el.getBoundingClientRect(),L=r.left,W=r.width,stops=[],prev=null,start=0;
for(var x=0;x<=W;x+=STEP){var c=colAt(Math.min(L+x,innerWidth-1),y);if(c!==prev){if(prev!==null)stops.push(prev+' '+start+'px '+x+'px');prev=c;start=x}}
stops.push(prev+' '+start+'px '+W+'px');
var lines=[];document.querySelectorAll('main *,body>div:not(.proll) *').forEach(function(e){var cs=getComputedStyle(e);var bl=parseFloat(cs.borderLeftWidth),br=parseFloat(cs.borderRightWidth);if(!bl&&!br)return;var q=e.getBoundingClientRect();if(q.top>y||q.bottom<y||q.width<2)return;
if(bl&&cs.borderLeftStyle!=='none')lines.push('linear-gradient(90deg,transparent '+(q.left-L)+'px,'+cs.borderLeftColor+' '+(q.left-L)+'px '+(q.left-L+Math.max(bl,1))+'px,transparent '+(q.left-L+Math.max(bl,1))+'px)');
if(br&&cs.borderRightStyle!=='none')lines.push('linear-gradient(90deg,transparent '+(q.right-L-br)+'px,'+cs.borderRightColor+' '+(q.right-L-br)+'px '+(q.right-L)+'px,transparent '+(q.right-L)+'px)')});
lines=lines.slice(0,24);return (lines.length?lines.join(',')+',':'')+'linear-gradient(90deg,'+stops.join(',')+')'}
function u(){t=0;var r=hd.getBoundingClientRect();T.style.top=r.bottom+'px';
T.style.setProperty('--strip',strip(T,r.bottom+T.offsetHeight+3));var bb=B.getBoundingClientRect().top;B.style.setProperty('--strip',strip(B,bb-3));
h.style.setProperty('--roll',(scrollY*.5%9).toFixed(2)+'px')}
function q(){if(!t)t=requestAnimationFrame(u)}addEventListener('scroll',q,{passive:true});addEventListener('resize',q);addEventListener('load',q);u()})();
