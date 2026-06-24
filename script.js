// ─── Canvas Background: Química + Programação ───────────────────────────────
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles, molecules, codeParticles;

  const codeSymbols = ['01','10','{ }','</>','=>','[ ]','def','for','if','λ','#','//'];
  const chemSymbols = ['H₂O','CO₂','CH₄','NH₃','O₂','NaCl','C₆H₁₂O₆','HCl'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ── Partícula de ponto ──
  function makeParticle() {
    var p = {};
    function reset() {
      p.x  = Math.random() * W;
      p.y  = Math.random() * H;
      p.r  = Math.random() * 2 + 0.5;
      p.vx = (Math.random() - 0.5) * 0.35;
      p.vy = (Math.random() - 0.5) * 0.35;
      p.a  = Math.random() * 0.35 + 0.08;
      p.teal = Math.random() > 0.45;
    }
    reset();
    p.update = function() {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) reset();
    };
    p.draw = function() {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.teal
        ? 'rgba(0,154,166,' + p.a + ')'
        : 'rgba(200,220,230,' + p.a + ')';
      ctx.fill();
    };
    return p;
  }

  // ── Molécula ──
  function makeMolecule() {
    var m = {};
    function reset() {
      m.x       = Math.random() * W;
      m.y       = Math.random() * H;
      m.ne      = Math.floor(Math.random() * 3) + 2;
      m.orb     = Math.random() * 22 + 16;
      m.angles  = [];
      for (var i = 0; i < m.ne; i++) m.angles.push((i / m.ne) * Math.PI * 2);
      m.speed   = (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1);
      m.a       = Math.random() * 0.20 + 0.06;
      m.vx      = (Math.random() - 0.5) * 0.15;
      m.vy      = (Math.random() - 0.5) * 0.15;
      m.sym     = chemSymbols[Math.floor(Math.random() * chemSymbols.length)];
    }
    reset();
    m.update = function() {
      for (var i = 0; i < m.angles.length; i++) m.angles[i] += m.speed;
      m.x += m.vx; m.y += m.vy;
      if (m.x < -80 || m.x > W + 80 || m.y < -80 || m.y > H + 80) reset();
    };
    m.draw = function() {
      var a = m.a;
      // núcleo
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,154,166,' + (a * 1.4) + ')';
      ctx.fill();
      // órbita elíptica
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.orb, m.orb * 0.42, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,154,166,' + (a * 0.55) + ')';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      // elétrons
      for (var i = 0; i < m.angles.length; i++) {
        var ex = m.x + Math.cos(m.angles[i]) * m.orb;
        var ey = m.y + Math.sin(m.angles[i]) * m.orb * 0.42;
        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,240,255,' + (a * 1.2) + ')';
        ctx.fill();
      }
      // fórmula química
      var fs = Math.max(7, Math.round(m.orb * 0.38));
      ctx.font = 'bold ' + fs + 'px sans-serif';
      ctx.fillStyle = 'rgba(0,210,230,' + (a * 1.1) + ')';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.sym, m.x, m.y + m.orb * 1.6);
    };
    return m;
  }

  // ── Símbolo de código flutuante ──
  function makeCode() {
    var c = {};
    function reset() {
      c.x    = Math.random() * W;
      c.y    = Math.random() * H;
      c.vy   = -(Math.random() * 0.3 + 0.1);
      c.vx   = (Math.random() - 0.5) * 0.1;
      c.a    = Math.random() * 0.20 + 0.06;
      var pool = Math.random() > 0.45 ? codeSymbols : chemSymbols;
      c.text = pool[Math.floor(Math.random() * pool.length)];
      c.size = Math.random() * 5 + 8;
      c.life = 1;
    }
    reset();
    c.update = function() {
      c.x += c.vx; c.y += c.vy;
      c.life -= 0.0012;
      if (c.life <= 0 || c.y < -20) reset();
    };
    c.draw = function() {
      ctx.font = c.size + 'px monospace';
      ctx.fillStyle = 'rgba(0,180,190,' + (c.a * c.life) + ')';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(c.text, c.x, c.y);
    };
    return c;
  }

  function drawConnections() {
    var maxD = 90;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0,154,166,' + ((1 - d / maxD) * 0.12) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    var density = Math.min(Math.floor(W * H / 14000), 70);
    particles    = [];
    molecules    = [];
    codeParticles = [];
    for (var i = 0; i < density; i++)              particles.push(makeParticle());
    for (var i = 0; i < Math.round(density*0.3); i++) molecules.push(makeMolecule());
    for (var i = 0; i < Math.round(density*0.55); i++) codeParticles.push(makeCode());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length;     i++) { particles[i].update();     particles[i].draw(); }
    drawConnections();
    for (var i = 0; i < molecules.length;     i++) { molecules[i].update();     molecules[i].draw(); }
    for (var i = 0; i < codeParticles.length; i++) { codeParticles[i].update(); codeParticles[i].draw(); }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', function() { init(); });

  init();
  loop();
})();
