/* ============================================================================
   thought-streams.js - parallel transport of thought chains.
   A full-bleed canvas of parallel reasoning lanes: chains of nodes linked by
   faint edges, all drifting the same direction (parallel transport). It sits
   behind the page so the liquid-glass panels refract it through their
   backdrop-filter. Zero dependencies. Reads the gold/teal palette. Respects
   reduced-motion (renders one still frame, no loop).
   ========================================================================== */
(() => {
  if (document.getElementById('thought-streams')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cv = document.createElement('canvas');
  cv.id = 'thought-streams';
  Object.assign(cv.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    zIndex: '-3', pointerEvents: 'none', display: 'block',
  });
  document.body.prepend(cv);
  const ctx = cv.getContext('2d', { alpha: true });

  const GOLD = [210, 173, 98];
  const TEAL = [63, 208, 208];
  const COOL = [120, 150, 200];
  let W, H, DPR, lanes = [], t = 0;

  function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

  function makeChain(laneW) {
    const nodes = [];
    let x = -Math.random() * laneW;
    const count = 5 + (Math.random() * 5 | 0);
    for (let k = 0; k < count; k++) {
      x += 70 + Math.random() * 150;
      nodes.push({ dx: x, j: (Math.random() - 0.5) * 26, r: 1.1 + Math.random() * 1.9 });
    }
    return { nodes, span: x + 200 };
  }

  function build() {
    lanes = [];
    const N = Math.max(6, Math.round(window.innerHeight / 96));
    for (let i = 0; i < N; i++) {
      const palette = i % 4 === 0 ? TEAL : (i % 4 === 2 ? COOL : GOLD);
      lanes.push({
        y: (i + 0.5) / N,
        speed: (0.14 + Math.random() * 0.22),
        color: palette,
        chains: [makeChain(W / DPR), makeChain(W / DPR)],
        offset: Math.random() * (W / DPR),
        glow: i % 4 === 0 ? 0.85 : 0.55,
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = Math.floor(window.innerWidth * DPR);
    H = cv.height = Math.floor(window.innerHeight * DPR);
    cv.style.width = window.innerWidth + 'px';
    cv.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
    if (reduce) frame(0);
  }

  function frame(now) {
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (const lane of lanes) {
      const baseY = lane.y * h;
      lane.offset += lane.speed * (reduce ? 0 : 1);
      const span = lane.chains[0].span;
      const total = span + Math.max(420, w * 0.5);

      for (let c = 0; c < lane.chains.length; c++) {
        const chain = lane.chains[c];
        const shift = (lane.offset + c * total * 0.5) % total;
        const baseX = -span + shift;
        const ns = chain.nodes;

        // edges (the "chain" linking thoughts)
        ctx.lineWidth = 1;
        for (let k = 0; k < ns.length - 1; k++) {
          const x1 = baseX + ns[k].dx, y1 = baseY + ns[k].j;
          const x2 = baseX + ns[k + 1].dx, y2 = baseY + ns[k + 1].j;
          if (x2 < -40 || x1 > w + 40) continue;
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, rgba(lane.color, 0.02));
          grad.addColorStop(0.5, rgba(lane.color, 0.16 * lane.glow));
          grad.addColorStop(1, rgba(lane.color, 0.02));
          ctx.strokeStyle = grad;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
        // nodes (the thoughts)
        for (const n of ns) {
          const x = baseX + n.dx, y = baseY + n.j;
          if (x < -40 || x > w + 40) continue;
          const pulse = 0.6 + 0.4 * Math.sin((t * 0.04) + n.dx * 0.05);
          const g = ctx.createRadialGradient(x, y, 0, x, y, n.r * 6);
          g.addColorStop(0, rgba(lane.color, 0.5 * lane.glow * pulse));
          g.addColorStop(0.4, rgba(lane.color, 0.14 * lane.glow));
          g.addColorStop(1, rgba(lane.color, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, n.r * 6, 0, 6.2832); ctx.fill();
          ctx.fillStyle = rgba(lane.color, 0.7 * lane.glow);
          ctx.beginPath(); ctx.arc(x, y, n.r, 0, 6.2832); ctx.fill();
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    t += 1;
    if (!reduce) requestAnimationFrame(frame);
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
  resize();
  if (!reduce) requestAnimationFrame(frame);
})();
