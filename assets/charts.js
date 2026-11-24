/* Draws the bars of each Review figure in as it scrolls into view. Without JS, or with reduced motion, bars show at once. */
(function(){
  var figs=document.querySelectorAll('.px-fig');
  if(!figs.length)return;
  if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
  document.documentElement.classList.add('px-js');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('px-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -12% 0px',threshold:.15});
  figs.forEach(function(f){var r=f.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){f.classList.add('px-in');}else{io.observe(f);}});
})();
