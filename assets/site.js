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
