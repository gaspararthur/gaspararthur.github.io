// ─── Arthur Gaspar — site script ────────────────────────────────────────────

// ════════════════════════════════════════════════════════════
// CONFIG —
// ════════════════════════════════════════════════════════════

// Spotify via Last.fm
// 1. Crie conta em https://www.last.fm e conecte ao Spotify (Settings → Applications)
// 2. Gere uma API key em https://www.last.fm/api/account/create (gratuito)
// 3. Preencha abaixo:
const LASTFM_USER    = 'gaspararthur';  // ex: 'ogaspar__'
const LASTFM_API_KEY = 'ac6ed5a2cfc0765493542185bbe495d5';  // ex: 'a1b2c3d4e5f6...'

// Contador de visitantes — namespace único do site
const COUNTER_NAMESPACE = 'gaspararthur-github-io';
const COUNTER_KEY       = 'visitas';

// ════════════════════════════════════════════════════════════

(function () {

  // ════════════════════════════════════════════════════════════
  // 1. TROCA DE TELAS (bio / projetos / habilidades / histórico)
  // ════════════════════════════════════════════════════════════
  const screenBio      = document.getElementById('screen-bio');
  const screenProjects = document.getElementById('screen-projects');
  const screenSkills   = document.getElementById('screen-skills');
  const screenLinks    = document.getElementById('screen-links');
  const btnSwitch      = document.getElementById('btn-switch');
  const btnLabel       = document.getElementById('btn-switch-label');
  const btnIcon        = document.getElementById('btn-switch-icon');
  const btnSkills      = document.getElementById('btn-skills');
  const btnSkillsLabel = document.getElementById('btn-skills-label');
  const btnProjects    = document.getElementById('btn-projects');
  const btnProjectsLabel = document.getElementById('btn-projects-label');

  let currentScreen = 'bio';

  const screens = { bio: screenBio, projects: screenProjects, skills: screenSkills, links: screenLinks };

  function goTo(target) {
    const from = screens[currentScreen];
    from.classList.remove('active');
    setTimeout(() => {
      const to = screens[target];
      to.scrollTop = 0;
      to.classList.add('active');
      currentScreen = target;
      syncNav();
      if (target === 'projects') animateProjCounters();
      if (target === 'skills')   animateSkillBars();
    }, 200);
  }

  function syncNav() {
    btnSkillsLabel.textContent = 'Habilidades';
    btnSkills.setAttribute('aria-label', 'Ver habilidades');
    btnSkills.classList.remove('active');
    btnProjectsLabel.textContent = 'Projetos';
    btnProjects.setAttribute('aria-label', 'Ver projetos');
    btnProjects.classList.remove('active');
    btnSwitch.style.flexDirection = '';

    if (currentScreen === 'bio') {
      btnLabel.textContent = 'Histórico';
      btnIcon.className    = 'fa-solid fa-arrow-right';
      btnSwitch.setAttribute('aria-label', 'Ver histórico');
    } else if (currentScreen === 'projects') {
      btnProjectsLabel.textContent = 'Voltar';
      btnProjects.setAttribute('aria-label', 'Voltar ao perfil');
      btnProjects.classList.add('active');
      btnLabel.textContent = 'Histórico';
      btnIcon.className    = 'fa-solid fa-arrow-right';
      btnSwitch.setAttribute('aria-label', 'Ver histórico');
    } else if (currentScreen === 'skills') {
      btnSkillsLabel.textContent = 'Voltar';
      btnSkills.setAttribute('aria-label', 'Voltar ao perfil');
      btnSkills.classList.add('active');
      btnLabel.textContent = 'Histórico';
      btnIcon.className    = 'fa-solid fa-arrow-right';
      btnSwitch.setAttribute('aria-label', 'Ver histórico');
    } else if (currentScreen === 'links') {
      btnLabel.textContent = 'Voltar';
      btnIcon.className    = 'fa-solid fa-arrow-left';
      btnSwitch.style.flexDirection = 'row-reverse';
      btnSwitch.setAttribute('aria-label', 'Voltar ao perfil');
    }
  }

  btnSwitch.addEventListener('click', () => {
    if (currentScreen === 'links') goTo('bio');
    else goTo('links');
  });

  btnSkills.addEventListener('click', () => {
    if (currentScreen === 'skills') goTo('bio');
    else goTo('skills');
  });

  btnProjects.addEventListener('click', () => {
    if (currentScreen === 'projects') goTo('bio');
    else goTo('projects');
  });

  // ════════════════════════════════════════════════════════════
  // 2. PARTICIPAÇÕES — COLAPSÁVEL
  // ════════════════════════════════════════════════════════════
  const partToggle = document.getElementById('part-toggle');
  const partList   = document.getElementById('part-list');

  if (partToggle && partList) {
    const chevron = partToggle.querySelector('.chevron');
    partToggle.addEventListener('click', () => {
      const isOpen = partList.classList.toggle('open');
      if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
      partToggle.setAttribute('aria-expanded', String(isOpen));
      partList.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  // ════════════════════════════════════════════════════════════
  // 3. MODAIS DOS CARDS
  // ════════════════════════════════════════════════════════════
  const modalOverlay  = document.getElementById('modal-overlay');
  const modalBackdrop = modalOverlay.querySelector('.modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal(id) {
    document.querySelectorAll('.modal-content').forEach(c => { c.hidden = true; });
    document.getElementById('modal-' + id).hidden = false;
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
    if (id === 'stats') triggerCountUp();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  document.querySelectorAll('.card-clickable').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.modal);
      }
    });
  });

  // ════════════════════════════════════════════════════════════
  // 4. ANIMAÇÃO DE FUNDO — QUÍMICA + PROGRAMAÇÃO
  // ════════════════════════════════════════════════════════════
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  const animBtn  = document.getElementById('anim-toggle');
  const animIcon = animBtn.querySelector('i');

  let running = true;
  let rafId   = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CHEM_FORMULAS = ['H₂O','CO₂','C₆H₆','CH₄','NaCl','H₂SO₄','O₂','N₂','NH₃','HCl','C₂H₅OH','H₂O₂','CaCO₃','NO₂','KMnO₄'];
  const ELEMENTS      = ['H','C','N','O','Na','Cl','Fe','Au','Ag','Cu','Mg','Ca','K','P','S','Si','He','Li','B','F','Zn','Br'];
  const CODE_SNIPPETS = ['def','import','class','for()','while','print()','{}','[]','//','const','return','if','int','None','True','False','list()','range()','len()','map()','self','null','void','new','#!','()','</>','&&'];
  const MATH_SYMBOLS  = ['∑','Δ','∞','≡','∫','π','√','∂','≈','λ','μ','σ'];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr)  { return arr[Math.floor(Math.random() * arr.length)]; }

  function createParticle(scatter) {
    const roll = Math.random();
    let type, text, color;

    if      (roll < 0.18) { type = 'formula'; text = pick(CHEM_FORMULAS); color = '#009aa6'; }
    else if (roll < 0.36) { type = 'element'; text = pick(ELEMENTS);      color = '#00c4d1'; }
    else if (roll < 0.60) { type = 'code';    text = pick(CODE_SNIPPETS); color = '#7c3aed'; }
    else if (roll < 0.70) { type = 'math';    text = pick(MATH_SYMBOLS);  color = '#009aa6'; }
    else if (roll < 0.83) { type = 'benzene'; text = null;                color = '#009aa6'; }
    else                  { type = 'atom';    text = null;                color = '#009aa6'; }

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

  const particles = Array.from({ length: 65 }, () => createParticle(true));

  function drawBenzene(p) {
    const { x, y, size, opacity, color } = p;
    ctx.save();
    ctx.globalAlpha = opacity; ctx.strokeStyle = color; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) - Math.PI / 6;
      i === 0 ? ctx.moveTo(x + size * Math.cos(a), y + size * Math.sin(a))
              : ctx.lineTo(x + size * Math.cos(a), y + size * Math.sin(a));
    }
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, size * 0.5, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawAtom(p) {
    const { x, y, size, opacity, color } = p;
    ctx.save();
    ctx.globalAlpha = opacity; ctx.strokeStyle = color; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, size * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(i * Math.PI / 3);
      ctx.scale(1, 0.38); ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }

  function drawText(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
    ctx.font = p.type === 'code'
      ? `${p.fontSize}px "Courier Prime","Courier New",monospace`
      : `${p.fontSize}px Inter,sans-serif`;
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
      p.y += p.vy;
      if (p.y < -40)               Object.assign(p, createParticle(false));
      if (p.x < -30)               p.x = canvas.width + 10;
      if (p.x > canvas.width + 30) p.x = -10;
      if      (p.type === 'benzene') drawBenzene(p);
      else if (p.type === 'atom')    drawAtom(p);
      else                           drawText(p);
    }
    rafId = requestAnimationFrame(animate);
  }

  animBtn.addEventListener('click', () => {
    running = !running;
    if (running) {
      rafId = requestAnimationFrame(animate);
      animIcon.className = 'fa-solid fa-pause';
      animBtn.setAttribute('aria-label', 'Pausar animação de fundo');
      animBtn.setAttribute('title', 'Pausar animação');
    } else {
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animIcon.className = 'fa-solid fa-play';
      animBtn.setAttribute('aria-label', 'Retomar animação de fundo');
      animBtn.setAttribute('title', 'Retomar animação');
    }
  });

  rafId = requestAnimationFrame(animate);

  // ════════════════════════════════════════════════════════════
  // 5. CONTADOR DE VISITANTES
  // ════════════════════════════════════════════════════════════
  const visitorEl = document.getElementById('visitor-count');

  async function fetchVisits() {
    try {
      const res  = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/hit`);
      const data = await res.json();
      if (data && typeof data.count === 'number') {
        visitorEl.textContent = data.count.toLocaleString('pt-BR');
      }
    } catch (_) {
      visitorEl.textContent = '—';
    }
  }
  fetchVisits();

  // ════════════════════════════════════════════════════════════
  // 6. ESTATÍSTICAS — ANIMAÇÃO DE CONTAGEM (ativada ao abrir modal)
  // ════════════════════════════════════════════════════════════
  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target) { el.textContent = '0'; return; }
    const duration = 1400;
    const start    = performance.now();
    el.textContent = '0';
    function tick(now) {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * ease);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  let statsAnimated = false;
  function triggerCountUp() {
    if (statsAnimated) return;
    document.querySelectorAll('#modal-stats .stat-number').forEach(countUp);
    statsAnimated = true;
  }

  // Avatar → easter egg de estatísticas
  const avatar = document.getElementById('avatar');
  avatar.addEventListener('click', () => openModal('stats'));
  avatar.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal('stats'); }
  });

  // ════════════════════════════════════════════════════════════
  // 7. SPOTIFY / LAST.FM — NOW PLAYING
  // ════════════════════════════════════════════════════════════
  const spotifyWidget = document.getElementById('spotify-widget');
  const spotifyArt    = document.getElementById('spotify-art');
  const spotifyBars   = document.getElementById('spotify-bars');
  const spotifyStatus = document.getElementById('spotify-status');
  const spotifyTrack  = document.getElementById('spotify-track');
  const spotifyArtist = document.getElementById('spotify-artist');

  async function fetchNowPlaying() {
    if (!LASTFM_USER || !LASTFM_API_KEY) return;
    try {
      const url  = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
      const res  = await fetch(url);
      const data = await res.json();
      const track = data?.recenttracks?.track?.[0];
      if (!track) return;

      const isPlaying = track['@attr']?.nowplaying === 'true';
      const name      = track.name || '—';
      const artist    = track.artist?.['#text'] || '—';
      const art       = track.image?.find(i => i.size === 'medium')?.['#text'] || '';

      spotifyTrack.textContent  = name;
      spotifyArtist.textContent = artist;

      if (art) {
        spotifyArt.src = art;
        spotifyArt.hidden = false;
      } else {
        spotifyArt.hidden = true;
      }

      if (isPlaying) {
        spotifyStatus.textContent = 'Gaspar está ouvindo agora';
        spotifyStatus.classList.remove('last-played');
        spotifyBars.classList.add('playing');
      } else {
        spotifyStatus.textContent = 'Gaspar ouviu por último';
        spotifyStatus.classList.add('last-played');
        spotifyBars.classList.remove('playing');
      }

      spotifyWidget.hidden = false;
    } catch (_) {
      spotifyWidget.hidden = true;
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 30_000);

  // ════════════════════════════════════════════════════════════
  // 8. LOADING SCREEN
  // ════════════════════════════════════════════════════════════
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 460);
    }, 700);
  }

  // ════════════════════════════════════════════════════════════
  // 9. CONTADORES ANIMADOS (tela projetos)
  // ════════════════════════════════════════════════════════════
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    const duration = 1000;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * ease);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  function animateProjCounters() {
    document.querySelectorAll('#screen-projects .proj-stat-num').forEach(countUp);
  }

  // ════════════════════════════════════════════════════════════
  // 10. BARRAS DE PROFICIÊNCIA (tela habilidades)
  // ════════════════════════════════════════════════════════════
  function animateSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(el => el.classList.add('animated'));
  }

  // ════════════════════════════════════════════════════════════
  // 11. TERMINAL INTERATIVO
  // ════════════════════════════════════════════════════════════
  const terminalBtn    = document.getElementById('terminal-btn');
  const terminalModal  = document.getElementById('terminal-modal');
  const terminalClose  = document.getElementById('terminal-close');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput  = document.getElementById('terminal-input');

  const T_CMDS = {
    help: () => [
      '<span class="t-cyan">Comandos disponíveis:</span>',
      '  <span class="t-yellow">about</span>      → Sobre mim',
      '  <span class="t-yellow">projects</span>   → Projetos de pesquisa',
      '  <span class="t-yellow">skills</span>     → Habilidades',
      '  <span class="t-yellow">contact</span>    → Contato e redes sociais',
      '  <span class="t-yellow">github</span>     → Abrir GitHub',
      '  <span class="t-yellow">lattes</span>     → Abrir Currículo Lattes',
      '  <span class="t-yellow">clear</span>      → Limpar terminal',
      '  <span class="t-yellow">exit</span>       → Fechar terminal',
    ],
    about: () => [
      '<span class="t-green">Arthur Santana Gaspar Lima</span>',
      'Técnico em Química · IFMA — Campus Imperatriz',
      'Secretário-Geral do Grêmio Paulo Freire · Pesquisador PIBIC/CNPq',
      'Interesses: Fitoquímica · Botânica · Programação · Geopolítica',
    ],
    whoami: () => T_CMDS.about(),
    projects: () => [
      '<span class="t-cyan">Projetos de Pesquisa:</span>',
      '  <span class="t-white">[1]</span> Levantamento Botânico de Plantas Tóxicas · 2024–2025  <span class="t-yellow">✓ 1º Lugar SEMIC</span>',
      '  <span class="t-white">[2]</span> Atividade Antimicrobiana de Óleos Essenciais · 2026–   <span class="t-green">● Em andamento</span>',
    ],
    skills: () => [
      '<span class="t-cyan">Habilidades:</span>',
      '  Escrita científica  <span class="t-green">██████████</span> 90%',
      '  Liderança           <span class="t-green">█████████░</span> 88%',
      '  Pesquisa            <span class="t-green">████████░░</span> 84%',
      '  Geopolítica         <span class="t-green">████████░░</span> 80%',
      '  Python/JS           <span class="t-yellow">██████░░░░</span> 65%',
    ],
    contact: () => [
      '<span class="t-cyan">Contato:</span>',
      '  GitHub    → github.com/gaspararthur',
      '  LinkedIn  → linkedin.com/in/arthur-santana-gaspar-lima-293b7a251',
      '  Instagram → @gaspar.arthur_',
      '  X         → @ogaspar__',
      '  E-mail    → gaspar.arthur@acad.ifma.edu.br',
    ],
    github:  () => { window.open('https://github.com/gaspararthur','_blank'); return ['<span class="t-green">Abrindo GitHub...</span>']; },
    lattes:  () => { window.open('http://lattes.cnpq.br/1517261797918288','_blank'); return ['<span class="t-green">Abrindo Currículo Lattes...</span>']; },
    clear:   () => { terminalOutput.innerHTML = ''; return null; },
    exit:    () => { closeTerminal(); return null; },
    // Easter eggs
    'c6h6':           () => ['<span class="t-cyan">C₆H₆ — Benzeno</span>','    \\   /','  — C = C —',' /         \\','C           C',' \\         /','  — C = C —','    /   \\','<span class="t-dim">Estrutura aromática · Kekulé (1865)</span>'],
    'h2o':            () => ['  H   H','   \\ /','    O','<span class="t-cyan">H₂O — A molécula da vida.</span>'],
    'sudo':           () => ['<span class="t-red">Este sistema não requer superpoderes.</span>'],
    'import gaspar':  () => ['<span class="t-green">Importando gaspar...</span>','<span class="t-cyan">Loaded:</span> curiosidade, persistência, café ☕'],
    'print("hello")': () => ['<span class="t-green">Hello, World! 🌎</span>'],
    'npm start':      () => ['<span class="t-red">npm: não encontrado.</span> Tente Python.'],
  };

  function tPrint(lines) {
    if (!lines) return;
    lines.forEach(html => {
      const p = document.createElement('p');
      p.className = 't-line t-white';
      p.innerHTML = html;
      terminalOutput.appendChild(p);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function tCmd(raw) {
    const p = document.createElement('p');
    p.className = 't-line';
    p.innerHTML = `<span class="t-cyan">arthur@gaspar:~$</span> <span class="t-cmd">${raw}</span>`;
    terminalOutput.appendChild(p);
  }

  function processCmd(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    tCmd(raw.trim());
    const fn = T_CMDS[cmd];
    if (fn) {
      tPrint(fn());
    } else {
      tPrint([`<span class="t-red">Comando não encontrado: ${cmd}</span>  Digite <span class="t-cyan">help</span>.`]);
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function openTerminal() {
    terminalModal.classList.add('open');
    terminalModal.setAttribute('aria-hidden','false');
    if (!terminalOutput.children.length) {
      tPrint([
        '<span class="t-green">Arthur Gaspar — Terminal v1.0</span>',
        '<span class="t-dim">Digite <span class="t-cyan">help</span> para ver os comandos.</span>',
        '<span class="t-dim">──────────────────────────────</span>',
      ]);
    }
    setTimeout(() => terminalInput.focus(), 80);
  }

  function closeTerminal() {
    terminalModal.classList.remove('open');
    terminalModal.setAttribute('aria-hidden','true');
  }

  terminalBtn.addEventListener('click', () => terminalModal.classList.contains('open') ? closeTerminal() : openTerminal());
  terminalClose.addEventListener('click', closeTerminal);
  terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = terminalInput.value; terminalInput.value = ''; processCmd(v); }
  });

  // ════════════════════════════════════════════════════════════
  // 13. SIDEBAR NAV — rolagem suave + destaque ativo por seção
  // ════════════════════════════════════════════════════════════
  const bioContent  = document.querySelector('.bio-content');

  // Voltar ao topo
  const backToTopBtn = document.getElementById('back-to-top');
  if (bioContent && backToTopBtn) {
    bioContent.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', bioContent.scrollTop > 120);
    });
    backToTopBtn.addEventListener('click', () => {
      bioContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const sideLinks   = Array.from(document.querySelectorAll('.sidebar-link'));

  // Clique → rola o painel direito até a seção
  sideLinks.forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target || !bioContent) return;
      e.preventDefault();
      const scrollTop = target.getBoundingClientRect().top - bioContent.getBoundingClientRect().top + bioContent.scrollTop - 32;
      bioContent.scrollTo({ top: scrollTop, behavior: 'smooth' });
    });
  });

  // IntersectionObserver → marca o link da seção visível como ativo
  const sections = Array.from(document.querySelectorAll('.bio-content .section-block'));

  if (sections.length && bioContent) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = sideLinks.find(l => l.getAttribute('href') === '#' + entry.target.id);
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, { root: bioContent, threshold: 0.25 });

    sections.forEach(s => obs.observe(s));
  }

})();
