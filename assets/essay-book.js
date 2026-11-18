(function(){var a=document.querySelector('.rvw-art');if(!a||a.parentNode.classList.contains('eb-wrap'))return;
var s=document.createElement('div');s.className='eb-stage';var w=document.createElement('div');w.className='eb-wrap';a.parentNode.insertBefore(s,a);s.appendChild(w);w.appendChild(a);
var f=document.createElement('span');f.className='eb-folio';f.textContent='\u2766  The Pritiraj Review  \u2766';a.appendChild(f);
var l=document.createElement('div');l.className='eb-leaf';l.setAttribute('aria-hidden','true');l.innerHTML='<i class="f"></i><i class="b"></i>';
l.style.setProperty('--eb-t',JSON.stringify('The Pritiraj Review'));w.appendChild(l);
l.addEventListener('animationend',function(e){if(e.animationName==='ebTurn')l.remove()})})();
