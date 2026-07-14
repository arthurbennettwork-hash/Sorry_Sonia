/* =========================================================
   KITKAT APOLOGY SITE — SCRIPT.JS
   All interactivity: ambient effects, reveals, loading bar,
   confetti, typing animation, sounds, continue arrows.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. TINY SOUND EFFECTS (generated with Web Audio API so
        no external sound files are needed — works instantly).
        You can swap these out for real mp3 click sounds later.
     --------------------------------------------------------- */
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playPopSound() {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      /* Audio may be blocked until user interacts — that's fine */
    }
  }

  function playCelebrationChime() {
    try {
      const ctx = getAudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) { /* ignore */ }
  }

  /* Attach the pop sound to every button tap on the page */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', playPopSound);
  });

  /* ---------------------------------------------------------
     1. AMBIENT FLOATING HEARTS + FALLING PETALS
     --------------------------------------------------------- */
  const heartsLayer = document.getElementById('floating-hearts');
  const petalsLayer = document.getElementById('falling-petals');
  const heartEmojis = ['💖', '❤️', '💕', '💗', '🌸'];
  const petalEmojis = ['🌸', '🌷', '✨', '⭐'];

  function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const duration = 6 + Math.random() * 6;
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (16 + Math.random() * 14) + 'px';
    heartsLayer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }

  function spawnPetal() {
    const el = document.createElement('span');
    el.className = 'falling-petal';
    el.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const duration = 7 + Math.random() * 6;
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (14 + Math.random() * 10) + 'px';
    petalsLayer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }

  // Keep a gentle steady stream going the whole time she's on the page
  setInterval(spawnHeart, 900);
  setInterval(spawnPetal, 1300);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  /* ---------------------------------------------------------
     2. SPARKLES ON TAP (mobile-friendly — reacts to touch/click
        instead of mouse-hover, since this is built for phones)
     --------------------------------------------------------- */
  const sparkleLayer = document.getElementById('sparkle-layer');
  function spawnSparkleAt(x, y) {
    const el = document.createElement('span');
    el.className = 'tap-sparkle';
    el.textContent = ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    sparkleLayer.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) spawnSparkleAt(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('click', (e) => {
    spawnSparkleAt(e.clientX, e.clientY);
  });

  /* ---------------------------------------------------------
     3. HERO TYPING ANIMATION
     --------------------------------------------------------- */
  const heroSub = document.getElementById('hero-sub');
  const heroSubText = "I know you're a tiny little bit angry with me today...";
  let heroIndex = 0;

  function typeHeroSub() {
    if (heroIndex <= heroSubText.length) {
      heroSub.textContent = heroSubText.slice(0, heroIndex);
      heroIndex++;
      setTimeout(typeHeroSub, 45);
    }
  }
  typeHeroSub();

  /* ---------------------------------------------------------
     4. "OPEN MY LETTER" BUTTON — reveals the rest of the page
     --------------------------------------------------------- */
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');

  enterBtn.addEventListener('click', () => {
    mainContent.classList.remove('hidden-until-open');
    mainContent.style.display = 'block';
    setTimeout(() => {
      document.getElementById('section-1').scrollIntoView({ behavior: 'smooth' });
    }, 150);
  });

  /* ---------------------------------------------------------
     5. SCROLL REVEAL for cards (IntersectionObserver)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.25 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     6. REASONS LIST — built dynamically, revealed one by one
     --------------------------------------------------------- */
  const reasons = [
    "You're illegally cute. 🚨",
    "You have the best smile in the entire world. 😊",
    "You make bad days disappear. 🌈",
    "You're my favorite notification. 📱💗",
    "You're the cutest angry human ever. 😤🎀",
    "Even when you're mad, you're adorable. 🥺",
    "I really admire you a lot. 🫶",
    "You have the best laugh. 😂",
    "You have a very good voice. 🎶",
    "Your heart is really very pure. 💗",
    "Your soul is very beautiful. ✨",
    "Honestly, 12 reasons won't be enough to describe how awesome you are. ♾️"
  ];

  const reasonsList = document.getElementById('reasons-list');
  reasons.forEach(text => {
    const li = document.createElement('li');
    li.className = 'reason-item';
    li.textContent = text;
    reasonsList.appendChild(li);
  });

  const reasonObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const items = Array.from(reasonsList.children);
        const index = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('show'), index * 180);
        reasonObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.reason-item').forEach(el => reasonObserver.observe(el));

  /* ---------------------------------------------------------
     7. FAKE LOADING BAR (Section 4)
     --------------------------------------------------------- */
  const loadingCard = document.getElementById('loading-card');
  const loadingFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingResult = document.getElementById('loading-result');
  let loadingStarted = false;

  const loadingSteps = [10, 40, 75, 99, 100];

  function runLoadingSequence() {
    if (loadingStarted) return;
    loadingStarted = true;
    let i = 0;
    function nextStep() {
      if (i < loadingSteps.length) {
        const value = loadingSteps[i];
        loadingFill.style.width = value + '%';
        loadingPercent.textContent = value + '%';
        i++;
        setTimeout(nextStep, 700);
      } else {
        setTimeout(() => {
          loadingResult.classList.remove('hidden');
        }, 400);
      }
    }
    nextStep();
  }

  const loadingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runLoadingSequence();
        loadingObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  loadingObserver.observe(loadingCard);

  /* ---------------------------------------------------------
     8. FINAL SECTION — the "Yes" button, confetti + typing
     --------------------------------------------------------- */
  const forgiveBtn = document.getElementById('forgive-btn');
  const preForgive = document.getElementById('pre-forgive');
  const postForgive = document.getElementById('post-forgive');
  const celebrateTyped = document.getElementById('celebrate-typed');

  const celebrationText =
    "YAYYYYYY!! I knew my KitKat had the sweetest heart. Thank youuu ❤️\n\n" +
    "I promise I'll keep making you smile and always try to make you happy.\n\n" +
    "And maybe... I'll still tease you a little 😜\n" +
    "Ummm, not maybe — I for sure will tease you.";

  const rohitContinueBtn = document.getElementById('rohit-continue-btn');

  function typeCelebration() {
    let idx = 0;
    celebrateTyped.textContent = '';
    function step() {
      if (idx <= celebrationText.length) {
        celebrateTyped.textContent = celebrationText.slice(0, idx);
        idx++;
        setTimeout(step, 28);
      } else {
        /* Typing is done — reveal the arrow that takes her to the
           final little surprise message about Rohit. */
        rohitContinueBtn.classList.remove('hidden');
      }
    }
    step();
  }

  forgiveBtn.addEventListener('click', () => {
    playCelebrationChime();
    preForgive.classList.add('hidden');
    postForgive.classList.remove('hidden');
    typeCelebration();
    launchConfetti();
  });

  /* ---------------------------------------------------------
     9. CONFETTI EXPLOSION (canvas based, no external library)
     --------------------------------------------------------- */
  const canvas = document.getElementById('confetti-canvas');
  const ctx2d = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#ff6fa0', '#ffd6e8', '#c6a6ff', '#ffe3cf', '#ff9ec7', '#e3d1ff'];

  function launchConfetti() {
    const pieceCount = 140;
    confettiPieces = [];
    for (let i = 0; i < pieceCount; i++) {
      confettiPieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.3) * 14,
        size: 5 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.28 + Math.random() * 0.12,
        life: 0,
        maxLife: 140 + Math.random() * 60
      });
    }
    if (!confettiAnimId) animateConfetti();
  }

  function animateConfetti() {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    let stillAlive = false;

    confettiPieces.forEach(p => {
      p.life++;
      if (p.life > p.maxLife) return;
      stillAlive = true;
      p.vy += p.gravity * 0.05;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      ctx2d.save();
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate((p.rotation * Math.PI) / 180);
      ctx2d.fillStyle = p.color;
      ctx2d.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx2d.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.life <= p.maxLife);

    if (stillAlive) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* Small confetti welcome burst a moment after she opens the letter,
     just for extra delight — feel free to remove this. */
  enterBtn.addEventListener('click', () => {
    setTimeout(launchConfetti, 300);
  });

  /* ---------------------------------------------------------
     10. CONTINUE ARROW BUTTONS — every section (except the
         landing screen and the final "Yes" screen) gets a
         right-arrow button that smooth-scrolls to the next
         section, so she can tap her way through the whole story.
     --------------------------------------------------------- */
  document.querySelectorAll('.continue-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playPopSound();
      const nextId = btn.getAttribute('data-next');
      const nextSection = document.getElementById(nextId);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
