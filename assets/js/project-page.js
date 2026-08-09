// ─── Páginas individuais de projetos ────────────────────────────────────────
(function () {
  'use strict';

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  const canvas = document.getElementById('bg-canvas');
  const animButton = document.getElementById('anim-toggle');

  if (!canvas) {
    if (animButton) animButton.hidden = true;
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    if (animButton) animButton.hidden = true;
    return;
  }

  const animIcon = animButton ? animButton.querySelector('i') : null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formulas = ['H₂O', 'CO₂', 'C₆H₆', 'CH₄', 'NaCl', 'H₂SO₄', 'O₂', 'NH₃', 'C₂H₅OH'];
  const elements = ['H', 'C', 'N', 'O', 'Na', 'Cl', 'Fe', 'Au', 'Cu', 'Mg', 'Ca', 'K', 'P', 'S'];
  const code = ['const', 'class', 'return', 'if', 'for()', '{}', '[]', '</>', '&&', 'import', 'null'];
  const math = ['∑', 'Δ', '∞', '∫', 'π', '√', 'λ', 'σ'];

  let viewportWidth = 0;
  let viewportHeight = 0;
  let particles = [];
  let animationFrame = null;
  let running = !reducedMotion.matches;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function createParticle(scatter) {
    const roll = Math.random();
    let type;
    let text = null;
    let color = '#009aa6';

    if (roll < 0.22) {
      type = 'formula';
      text = pick(formulas);
    } else if (roll < 0.42) {
      type = 'element';
      text = pick(elements);
      color = '#00c4d1';
    } else if (roll < 0.65) {
      type = 'code';
      text = pick(code);
      color = '#7c3aed';
    } else if (roll < 0.76) {
      type = 'math';
      text = pick(math);
    } else if (roll < 0.88) {
      type = 'benzene';
    } else {
      type = 'atom';
    }

    return {
      type,
      text,
      color,
      x: randomBetween(0, viewportWidth),
      y: scatter ? randomBetween(-viewportHeight, viewportHeight) : viewportHeight + randomBetween(10, 60),
      vx: randomBetween(-0.12, 0.12),
      vy: -randomBetween(0.12, 0.34),
      opacity: randomBetween(0.055, 0.16),
      fontSize: type === 'element' ? randomBetween(11, 20) : randomBetween(10, 15),
      size: randomBetween(9, 17),
      wobble: randomBetween(0, Math.PI * 2),
      wobbleSpeed: randomBetween(0.006, 0.016),
      wobbleAmount: randomBetween(0.08, 0.38)
    };
  }

  function resizeCanvas() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(viewportWidth * pixelRatio);
    canvas.height = Math.round(viewportHeight * pixelRatio);
    canvas.style.width = viewportWidth + 'px';
    canvas.style.height = viewportHeight + 'px';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (!running && particles.length) drawFrame(false);
  }

  function drawBenzene(particle) {
    context.save();
    context.globalAlpha = particle.opacity;
    context.strokeStyle = particle.color;
    context.lineWidth = 1;
    context.beginPath();

    for (let index = 0; index < 6; index += 1) {
      const angle = index * Math.PI / 3 - Math.PI / 6;
      const x = particle.x + particle.size * Math.cos(angle);
      const y = particle.y + particle.size * Math.sin(angle);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size * 0.48, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawAtom(particle) {
    context.save();
    context.globalAlpha = particle.opacity;
    context.strokeStyle = particle.color;
    context.fillStyle = particle.color;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size * 0.12, 0, Math.PI * 2);
    context.fill();

    for (let index = 0; index < 3; index += 1) {
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(index * Math.PI / 3);
      context.scale(1, 0.38);
      context.beginPath();
      context.arc(0, 0, particle.size, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    context.restore();
  }

  function drawText(particle) {
    context.save();
    context.globalAlpha = particle.opacity;
    context.fillStyle = particle.color;
    context.font = particle.type === 'code'
      ? `${particle.fontSize}px "Courier Prime", monospace`
      : `${particle.fontSize}px Inter, sans-serif`;
    context.fillText(particle.text, particle.x, particle.y);
    context.restore();
  }

  function drawFrame(advance) {
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    particles.forEach(particle => {
      if (advance) {
        particle.wobble += particle.wobbleSpeed;
        particle.x += particle.vx + Math.sin(particle.wobble) * particle.wobbleAmount;
        particle.y += particle.vy;

        if (particle.y < -40) Object.assign(particle, createParticle(false));
        if (particle.x < -30) particle.x = viewportWidth + 10;
        if (particle.x > viewportWidth + 30) particle.x = -10;
      }

      if (particle.type === 'benzene') drawBenzene(particle);
      else if (particle.type === 'atom') drawAtom(particle);
      else drawText(particle);
    });
  }

  function animate() {
    if (!running) return;
    drawFrame(true);
    animationFrame = window.requestAnimationFrame(animate);
  }

  function updateButton() {
    if (!animButton) return;
    const label = running ? 'Pausar animação de fundo' : 'Retomar animação de fundo';
    const title = running ? 'Pausar animação' : 'Retomar animação';
    animButton.setAttribute('aria-label', label);
    animButton.setAttribute('title', title);
    if (animIcon) animIcon.className = running ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  }

  function setRunning(nextState) {
    running = nextState;
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    updateButton();
    if (running) animationFrame = window.requestAnimationFrame(animate);
    else drawFrame(false);
  }

  resizeCanvas();
  particles = Array.from({ length: viewportWidth < 600 ? 30 : 52 }, () => createParticle(true));
  setRunning(running);

  window.addEventListener('resize', resizeCanvas);

  if (animButton) {
    animButton.addEventListener('click', () => setRunning(!running));
  }

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', event => {
      if (event.matches) setRunning(false);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    } else if (!document.hidden && running && animationFrame === null) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  });
})();
