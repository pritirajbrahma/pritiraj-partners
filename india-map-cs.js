(function () {
  if (customElements.get('india-map-cs')) return;
  class IndiaMap extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      this.style.display = 'block';
      this.innerHTML = '<div style="min-height:420px"></div>';
      this._boot();
    }
    async _boot() {
      for (let i = 0; i < 200 && !(window.d3 && window.topojson); i++) await new Promise(r => setTimeout(r, 50));
      if (!(window.d3 && window.topojson)) return;
      try {
        const topo = await (await fetch(new URL('assets/india-states.json', document.baseURI))).json();
        const st = topo.objects.states;
        const india = { type: 'Feature', geometry: topojson.merge(topo, st.geometries) };
        const inner = topojson.mesh(topo, st, (a, b) => a !== b);
        this._render(india, inner, topojson.feature(topo, st).features);
      } catch (e) { console.warn('india-map', e); }
    }
    _render(india, inner, states) {
      const W = 640, H = 690, d3 = window.d3;
      const proj = d3.geoMercator().fitExtent([[26, 30], [W - 26, H - 44]], india);
      const path = d3.geoPath(proj);
      const cities = [
        { n: 'NEW DELHI', s: 'Government of India', c: [77.21, 28.61], t: 'ref', dx: 10, dy: -6 },
        { n: 'JAIPUR', s: 'Rajasthan', c: [75.79, 26.91], t: 'eng', dx: -10, dy: 18, anchor: 'end' },
        { n: 'ITANAGAR', s: 'Arunachal Pradesh', c: [93.61, 27.10], t: 'eng', dx: -8, dy: -20, anchor: 'end' },
        { n: 'GUWAHATI', s: 'Assam', c: [91.74, 26.14], t: 'eng', dx: -12, dy: -6, anchor: 'end' },
        { n: 'SHILLONG', s: 'Meghalaya', c: [91.88, 25.57], t: 'eng', dx: -10, dy: 24, anchor: 'end' },
        { n: 'KOLKATA', s: 'West Bengal', c: [88.36, 22.57], t: 'eng', dx: 8, dy: 22 },
        { n: 'BENGALURU', s: 'Firm headquarters', c: [77.59, 12.97], t: 'hq', dx: 13, dy: 4 }
      ];
      const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.innerHTML = '';
      const svg = d3.select(this).append('svg').attr('viewBox', '0 0 ' + W + ' ' + H)
        .style('width', '100%').style('display', 'block');
      const defs = svg.append('defs');
      defs.append('clipPath').attr('id', 'im-clip').append('path').attr('d', path(india));
      const glow = defs.append('filter').attr('id', 'im-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      glow.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'b');
      const fm = glow.append('feMerge'); fm.append('feMergeNode').attr('in', 'b'); fm.append('feMergeNode').attr('in', 'SourceGraphic');
      const halo = defs.append('radialGradient').attr('id', 'im-halo');
      halo.append('stop').attr('offset', 0).attr('stop-color', '#F4720C').attr('stop-opacity', .45);
      halo.append('stop').attr('offset', 1).attr('stop-color', '#F4720C').attr('stop-opacity', 0);

      svg.append('path').attr('d', path(d3.geoGraticule().step([4, 4])()))
        .attr('clip-path', 'url(#im-clip)').attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,.12)').attr('stroke-width', .5);
      svg.append('path').attr('d', path(india)).attr('fill', 'rgba(255,255,255,.045)');
      svg.append('path').attr('d', path(inner)).attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,.3)').attr('stroke-width', .55).attr('stroke-linejoin', 'round');
      const outline = svg.append('path').attr('d', path(india)).attr('fill', 'none')
        .attr('stroke', '#DC3A22').attr('stroke-width', 1.1).node();
      const len = outline.getTotalLength();
      outline.style.strokeDasharray = len; outline.style.strokeDashoffset = len;
      outline.style.transition = 'stroke-dashoffset 3s ease';

      // survey track: a closed ground track that dwells over the regions under constant study
      const SURVEY = [
        { n: 'J&K', c: [74.9, 33.9], st: ['Jammu and Kashmir'] },
        { n: 'NCR', c: [77.2, 28.6], st: ['Delhi', 'Haryana'] },
        { n: 'RAJASTHAN', c: [73.8, 26.6], st: ['Rajasthan'] }
      ];
      const zoneG = svg.append('g');
      SURVEY.forEach(z => {
        z.p = proj(z.c);
        z.fill = zoneG.selectAll(null).data(states.filter(f => z.st.includes(f.properties.st_nm))).enter()
          .append('path').attr('d', path).attr('fill', '#F4720C').attr('stroke', '#F4720C').attr('stroke-width', .6).style('opacity', 0);
      });
      const way = [[74.9, 34.6], [77.6, 30.2], [77.2, 28.6], [84, 26.2], [92.6, 26.4], [88.4, 22.4], [79.5, 16.5], [77.6, 12.4], [74.6, 18.5], [71.5, 24.5], [73.8, 26.6], [72.6, 31.2]].map(proj);
      const track = svg.append('path').attr('d', d3.line().curve(d3.curveCatmullRomClosed.alpha(.5))(way))
        .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,.14)').attr('stroke-width', .6).attr('stroke-dasharray', '2 5').node();
      const TL = track.getTotalLength();
      const foot = svg.append('circle').attr('r', 26).attr('fill', 'url(#im-halo)').style('opacity', .35);
      const hq = cities.find(c => c.t === 'hq'), hp = proj(hq.c);
      const netG = svg.append('g').attr('filter', 'url(#im-glow)');
      const linkG = svg.append('g');
      const links = cities.filter(c => c !== hq).map(ct => {
        const p = proj(ct.c);
        const dx = p[0] - hp[0], dy = p[1] - hp[1], dist = Math.hypot(dx, dy) || 1;
        const cx = (hp[0] + p[0]) / 2 + (dy / dist) * dist * 0.18;
        const cy = (hp[1] + p[1]) / 2 - (dx / dist) * dist * 0.18;
        const d = 'M' + hp[0] + ',' + hp[1] + ' Q' + cx + ',' + cy + ' ' + p[0] + ',' + p[1];
        const col = ct.t === 'ref' ? 'rgba(255,255,255,.7)' : '#F4720C';
        const base = linkG.append('path').attr('d', d).attr('fill', 'none')
          .attr('stroke', ct.t === 'ref' ? 'rgba(255,255,255,.18)' : 'rgba(244,114,12,.28)').attr('stroke-width', .8).node();
        const L = base.getTotalLength();
        base.style.strokeDasharray = L; base.style.strokeDashoffset = L;
        const out = netG.append('path').attr('d', d).attr('fill', 'none').attr('stroke', col)
          .attr('stroke-width', 1.4).attr('stroke-linecap', 'round').style('opacity', 0).node();
        const back = netG.append('path').attr('d', d).attr('fill', 'none').attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1).attr('stroke-linecap', 'round').style('opacity', 0).node();
        const beam = netG.append('line').attr('x2', p[0]).attr('y2', p[1]).attr('stroke', 'rgba(255,255,255,.55)')
          .attr('stroke-width', .6).attr('stroke-dasharray', '1 3').style('opacity', 0);
        return { ct, p, base, out, back, beam, L };
      });

      const g = svg.append('g').style('opacity', 0).style('transition', 'opacity .9s ease 1.2s');
      const halos = [];
      cities.forEach(ct => {
        const [x, y] = proj(ct.c);
        const isRef = ct.t === 'ref', col = isRef ? 'rgba(255,255,255,.75)' : '#F4720C';
        if (!isRef) halos.push(g.append('circle').attr('cx', x).attr('cy', y).attr('r', ct.t === 'hq' ? 18 : 12).attr('fill', 'url(#im-halo)'));
        if (ct.t === 'hq') g.append('circle').attr('cx', x).attr('cy', y).attr('r', 8).attr('fill', 'none').attr('stroke', '#F4720C').attr('stroke-width', .7).style('opacity', .7);
        g.append('circle').attr('cx', x).attr('cy', y).attr('r', ct.t === 'hq' ? 3.6 : 2.6).attr('fill', col)
          .attr('stroke', '#16171A').attr('stroke-width', 1);
        const a = ct.anchor || 'start', tx = x + ct.dx, ty = y + ct.dy;
        g.append('text').attr('x', tx).attr('y', ty).attr('text-anchor', a).attr('fill', '#FFFFFF')
          .style('font', "700 10.5px 'Libre Franklin',sans-serif").style('letter-spacing', '.14em').text(ct.n);
        g.append('text').attr('x', tx).attr('y', ty + 13).attr('text-anchor', a).attr('fill', 'rgba(255,255,255,.55)')
          .style('font', "500 9.5px 'Libre Franklin',sans-serif").style('letter-spacing', '.04em').text(ct.s);
      });

      const sat = svg.append('g').attr('filter', 'url(#im-glow)');
      sat.append('rect').attr('x', -9).attr('y', -1.6).attr('width', 5.5).attr('height', 3.2).attr('fill', 'rgba(255,255,255,.55)');
      sat.append('rect').attr('x', 3.5).attr('y', -1.6).attr('width', 5.5).attr('height', 3.2).attr('fill', 'rgba(255,255,255,.55)');
      sat.append('rect').attr('x', -2.4).attr('y', -2.4).attr('width', 4.8).attr('height', 4.8).attr('fill', '#FFFFFF');

      svg.append('text').attr('x', 26).attr('y', H - 12).attr('fill', 'rgba(255,255,255,.38)')
        .style('font', "600 9px 'Libre Franklin',sans-serif").style('letter-spacing', '.2em')
        .text('STATE BOUNDARIES · MERCATOR PROJECTION');

      requestAnimationFrame(() => requestAnimationFrame(() => {
        outline.style.strokeDashoffset = 0; g.style('opacity', 1);
        links.forEach(l => { l.base.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.6,0,.2,1) 1.4s'; l.base.style.strokeDashoffset = 0; });
      }));

      if (reduce) { const q = track.getPointAtLength(0); sat.attr('transform', 'translate(' + q.x + ',' + q.y + ')'); SURVEY.forEach(z => z.fill.style('opacity', .12)); return; }
      let pos = 0, last = performance.now();
      const t0 = performance.now(), SEG = 26, PERIOD = 3.4;
      const tick = now => {
        if (!this.isConnected) return;
        const T = (now - t0) / 1000;
        const live = Math.max(0, Math.min(1, (T - 3.2) / .6));
        const u = ((T - 3.2) % PERIOD + PERIOD) % PERIOD / PERIOD;
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        const q0 = track.getPointAtLength(pos);
        let near = 0;
        SURVEY.forEach(z => {
          const w = Math.max(0, 1 - Math.hypot(q0.x - z.p[0], q0.y - z.p[1]) / 70);
          z.w = (z.w || 0) + (w - (z.w || 0)) * Math.min(1, dt * 3);
          z.fill.style('opacity', .06 + z.w * .22);
          near = Math.max(near, w);
        });
        pos = (pos + dt * (95 - near * 72)) % TL;
        const q = track.getPointAtLength(pos), qa = track.getPointAtLength((pos + 2) % TL);
        const sx = q.x, sy = q.y, ang = Math.atan2(qa.y - q.y, qa.x - q.x) * 180 / Math.PI;
        sat.attr('transform', 'translate(' + sx + ',' + sy + ') rotate(' + (ang + 90) + ')');
        foot.attr('cx', sx).attr('cy', sy).attr('r', 22 + near * 14).style('opacity', .25 + near * .45);
        links.forEach(l => {
          const k = u * (l.L + SEG);
          l.out.style.strokeDasharray = SEG + ' ' + (l.L + SEG);
          l.out.style.strokeDashoffset = SEG - k;
          l.out.style.opacity = live * .95;
          const k2 = ((u + .5) % 1) * (l.L + SEG);
          l.back.style.strokeDasharray = (SEG * .6) + ' ' + (l.L + SEG);
          l.back.style.strokeDashoffset = -(l.L - k2);
          l.back.style.opacity = live * .6;
          const dd = Math.hypot(sx - l.p[0], sy - l.p[1]);
          l.beam.attr('x1', sx).attr('y1', sy).style('opacity', Math.max(0, 1 - dd / 150) * .9);
        });
        const br = .75 + .25 * Math.sin(T * 1.6);
        halos.forEach(h => h.style('opacity', br));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }
  customElements.define('india-map-cs', IndiaMap);
})();
