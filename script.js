// ─── Animação de fundo: Química + Programação ───────────────────────────────

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  const btn    = document.getElementById('anim-toggle');
  const icon   = btn.querySelector('i');

  // ── Estado ───────────────────────────────────────────────────
  let running = true;
  let rafId   = null;

  // ── Redimensionamento ────────────────────────────────────────
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Conjuntos de símbolos ────────────────────────────────────
  const CHEM_FORMULAS  = ['H₂O','CO₂','C₆H₆','CH₄','NaCl','H₂SO₄','O₂','N₂','NH₃','HCl','C₂H₅OH','H₂O₂','CaCO₃','NO₂','KMnO₄'];
  const ELEMENTS       = ['H','C','N','O','Na','Cl','Fe','Au','Ag','Cu','Mg','Ca','K','P','S','Si','He','Li','B','F','Zn','Br'];
  const CODE_SNIPPETS  = ['def','import','class','for()','while','print()','{}','[]','//','const','return','if','int','None','True','False','list()','range()','len()','map()','self','null','void','new','#!','()','</>','&&'];
  const MATH_SYMBOLS   = ['∑','Δ','∞','≡','∫','π','√','∂','≈','λ','μ','σ'];

  const COLOR_CHEM    = '#009aa6';
  const COLOR_ELEMENT = '#00c4d1';
  const COLOR_CODE    = '#7c3aed';
  const COLOR_SHAPE   = '#009aa6';

  const TOTAL = 65;

  // ── Utilitários ──────────────────────────────────────────────
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr)       { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── Cria uma partícula ───────────────────────────────────────
  function createParticle(scatter) {
    const roll = Math.random();
    let type, text, color;

    if (roll < 0.18) {
      type = 'formula';  text = pick(CHEM_FORMULAS); color = COLOR_CHEM;
    } else if (roll < 0.36) {
      type = 'element';  text = pick(ELEMENTS);       color = COLOR_ELEMENT;
    } else if (roll < 0.60) {
      type = 'code';     text = pick(CODE_SNIPPETS);  color = COLOR_CODE;
    } else if (roll < 0.70) {
      type = 'math';     text = pick(MATH_SYMBOLS);   color = COLOR_SHAPE;
    } else if (roll < 0.83) {
      type = 'benzene';  text = null;                 color = COLOR_SHAPE;
    } else {
      type = 'atom';     text = null;                 color = COLOR_SHAPE;
    }

    return {
      x:           rand(0, canvas.width),
      y:           scatter ? rand(-canvas.height, canvas.height) : canvas.height + rand(10, 60),
      vy:          -rand(0.18, 0.52),
      vx:          (Math.random() - 0.5) * 0.25,
      opacity:     rand(0.07, 0.20),
      fontSize:    type === 'element' ? rand(11, 22) : rand(11, 17),
      size:        rand(10, 20),
      type, text, color,
      wobble:      rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.008, 0.022),
      wobbleAmp:   rand(0.15, 0.70),
    };
  }

  const particles = Array.from({ length: TOTAL }, () => createParticle(true));

  // ── Desenho: anel de benzeno ─────────────────────────────────
  function drawBenzene(p) {
    const { x, y, size, opacity, color } = p;
    ctx.save();
    ctx.globalAlpha  = opacity;
    ctx.strokeStyle  = color;
    ctx.lineWidth    = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) - Math.PI / 6;
      const px = x + size * Math.cos(a);
      const py = y + size * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ── Desenho: átomo ───────────────────────────────────────────
  function drawAtom(p) {
    const { x, y, size, opacity, color } = p;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(i * (Math.PI / 3));
      ctx.scale(1, 0.38);
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // ── Desenho: texto ───────────────────────────────────────────
  function drawText(p) {
    const { x, y, opacity, color, text, fontSize, type } = p;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle   = color;
    ctx.font        = type === 'code'
      ? `${fontSize}px "Courier Prime", "Courier New", monospace`
      : `${fontSize}px Inter, sans-serif`;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // ── Loop principal ───────────────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.wobble += p.wobbleSpeed;
      p.x      += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
      p.y      += p.vy;

      if (p.y < -40)                  Object.assign(p, createParticle(false));
      if (p.x < -30)                  p.x = canvas.width  + 10;
      if (p.x > canvas.width  + 30)   p.x = -10;

      if      (p.type === 'benzene') drawBenzene(p);
      else if (p.type === 'atom')    drawAtom(p);
      else                           drawText(p);
    }

    rafId = requestAnimationFrame(animate);
  }

  // ── Toggle ───────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    running = !running;

    if (running) {
      // Retoma
      rafId = requestAnimationFrame(animate);
      icon.className = 'fa-solid fa-pause';
      btn.setAttribute('aria-label', 'Pausar animação de fundo');
      btn.setAttribute('title', 'Pausar animação');
    } else {
      // Pausa
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      icon.className = 'fa-solid fa-play';
      btn.setAttribute('aria-label', 'Retomar animação de fundo');
      btn.setAttribute('title', 'Retomar animação');
    }
  });

  // ── Inicia ───────────────────────────────────────────────────
  rafId = requestAnimationFrame(animate);
})();
