// ===== DEVICE DETECTION =====
const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : isMobile;
const particleCount = isLowEnd ? 30 : 70;

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('custom-cursor');
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let sparkleThrottle = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
  if (cursorGlow) { cursorGlow.style.left = mouseX + 'px'; cursorGlow.style.top = mouseY + 'px'; }
  sparkleThrottle++;
  if (sparkleThrottle % 4 === 0 && !isMobile) createSparkle(mouseX, mouseY);
});

function createSparkle(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
  s.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
  s.style.width = s.style.height = Math.random() * 4 + 2 + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.1;
    this.speedY = (Math.random() - 0.5) * 0.08;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.008;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    const a = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(194,101,122,${a})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== LAYER MANAGEMENT =====
function showLayer(id) {
  document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ===== TERMINAL TYPING =====
function typeTerminal(lines, container, callback) {
  let lineIdx = 0;
  function nextLine() {
    if (lineIdx >= lines.length) { if (callback) callback(); return; }
    const { text, delay, typeSpeed } = lines[lineIdx];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor-blink';
    container.appendChild(lineEl);
    gsap.to(lineEl, { opacity: 1, duration: 0.3 });
    let charIdx = 0;
    const speed = typeSpeed || 40;
    lineEl.appendChild(cursorSpan);
    function typeChar() {
      if (charIdx < text.length) {
        lineEl.insertBefore(document.createTextNode(text[charIdx]), cursorSpan);
        charIdx++;
        setTimeout(typeChar, speed);
      } else {
        setTimeout(() => {
          cursorSpan.remove();
          lineIdx++;
          setTimeout(nextLine, delay || 600);
        }, 300);
      }
    }
    typeChar();
  }
  nextLine();
}

// ===== POETIC SEQUENCE =====
function showPoeticSequence(lines, container, callback) {
  let idx = 0;
  function nextPoem() {
    if (idx >= lines.length) { if (callback) callback(); return; }
    const el = document.createElement('div');
    el.className = 'poetic-line';
    el.textContent = lines[idx].text;
    container.innerHTML = '';
    container.appendChild(el);
    gsap.fromTo(el, { opacity: 0, y: 30, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            gsap.to(el, {
              opacity: 0, y: -20, duration: 1, ease: 'power2.in',
              onComplete: () => { idx++; setTimeout(nextPoem, 400); }
            });
          }, lines[idx].hold || 2000);
        }
      });
  }
  nextPoem();
}

// ===== FLOATING HEARTS =====
function spawnHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = ['❤️', '💕', '💗', '✨', '💖'][Math.floor(Math.random() * 5)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.bottom = '0';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4500);
    }, i * 200);
  }
}

// ===== PETALS =====
function startPetals() {
  for (let i = 0; i < (isMobile ? 5 : 10); i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.animationDelay = Math.random() * 4 + 's';
      document.body.appendChild(p);
    }, i * 800);
  }
}

// ===== SCREEN PULSE =====
function screenPulse() {
  const p = document.getElementById('screen-pulse');
  gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: 3, ease: 'power2.inOut' });
}

// ===== ROMANTIC PIANO MELODY (Web Audio API) =====
let audioCtx, musicPlaying = false, melodyTimer = null, masterGain = null;
const musicBtn = document.getElementById('music-toggle');

function createRomanticMelody() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Master volume
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2);
  masterGain.connect(audioCtx.destination);

  // Convolver reverb (synthetic impulse)
  const convolver = audioCtx.createConvolver();
  const reverbLen = audioCtx.sampleRate * 2.5;
  const impulse = audioCtx.createBuffer(2, reverbLen, audioCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.2);
    }
  }
  convolver.buffer = impulse;
  const reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.3;
  convolver.connect(reverbGain);
  reverbGain.connect(masterGain);

  // Dry bus
  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 0.7;
  dryGain.connect(masterGain);

  // Helper: play a soft piano-like note
  function playNote(freq, startTime, duration, volume = 0.04) {
    // Two detuned oscillators for warmth
    ['sine', 'triangle'].forEach((type, idx) => {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq * (1 + (idx * 0.002));
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(volume * (idx === 0 ? 1 : 0.3), startTime + 0.05);
      env.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + duration * 0.3);
      env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(env);
      env.connect(dryGain);
      env.connect(convolver);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  // Helper: play a warm pad chord
  function playPad(freqs, startTime, duration, vol = 0.012) {
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(vol, startTime + duration * 0.3);
      env.gain.linearRampToValueAtTime(vol * 0.8, startTime + duration * 0.7);
      env.gain.linearRampToValueAtTime(0, startTime + duration);
      osc.connect(env);
      env.connect(dryGain);
      env.connect(convolver);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.2);
    });
  }

  // Note frequencies
  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  function scheduleLoop() {
    const t = audioCtx.currentTime + 0.1;
    const beat = 0.55; // seconds per beat — slow romantic tempo (~109 BPM feel but arpeggiated slowly)

    // Chord progression: Am - F - C - G - Dm - Am - F - G
    const chords = [
      { arp: [N.A3, N.C4, N.E4, N.A4, N.C5], pad: [N.A3, N.C4, N.E4], bass: N.A3 },
      { arp: [N.F3, N.A3, N.C4, N.F4, N.A4], pad: [N.F3, N.A3, N.C4], bass: N.F3 },
      { arp: [N.C4, N.E4, N.G4, N.C5, N.E5], pad: [N.C4, N.E4, N.G4], bass: N.C3 },
      { arp: [N.G3, N.B3, N.D4, N.G4, N.B4], pad: [N.G3, N.B3, N.D4], bass: N.G3 },
      { arp: [N.D4, N.F4, N.A4, N.D5, N.F5], pad: [N.D4, N.F4, N.A4], bass: N.D3 },
      { arp: [N.A3, N.C4, N.E4, N.A4, N.C5], pad: [N.A3, N.C4, N.E4], bass: N.A3 },
      { arp: [N.F3, N.A3, N.C4, N.F4, N.A4], pad: [N.F3, N.A3, N.C4], bass: N.F3 },
      { arp: [N.G3, N.B3, N.D4, N.G4, N.B4], pad: [N.G3, N.B3, N.D4], bass: N.G3 },
    ];

    chords.forEach((chord, ci) => {
      const chordStart = t + ci * beat * 5;

      // Arpeggiated melody — each note of the chord played sequentially
      chord.arp.forEach((note, ni) => {
        playNote(note, chordStart + ni * beat, beat * 3.5, 0.035);
      });

      // Add a higher melodic grace note
      playNote(chord.arp[chord.arp.length - 1] * 1.5, chordStart + beat * 3, beat * 2, 0.015);

      // Warm pad underneath
      playPad(chord.pad, chordStart, beat * 5, 0.01);

      // Soft bass
      playNote(chord.bass * 0.5, chordStart, beat * 5, 0.025);
    });

    // Total loop duration
    const loopDuration = chords.length * beat * 5 * 1000;
    melodyTimer = setTimeout(scheduleLoop, loopDuration - 500); // slight overlap for seamless loop
  }

  scheduleLoop();
}

musicBtn.addEventListener('click', () => {
  if (!musicPlaying) {
    createRomanticMelody();
    musicPlaying = true;
    musicBtn.textContent = '🔊';
  } else {
    clearTimeout(melodyTimer);
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
      setTimeout(() => { if (audioCtx) audioCtx.close(); }, 1200);
    }
    musicPlaying = false;
    musicBtn.textContent = '🔇';
  }
});

// ===== MAIN EXPERIENCE FLOW =====
window.addEventListener('load', () => {
  // Show music toggle
  setTimeout(() => musicBtn.classList.add('visible'), 1500);

  // Phase 1: Terminal
  showLayer('layer-terminal');
  const termContainer = document.getElementById('terminal-output');

  typeTerminal([
    { text: '> Initializing emotional archive...', delay: 1000, typeSpeed: 35 },
    { text: '> Decrypting hidden memories...', delay: 1200, typeSpeed: 35 },
    { text: '> 1 soul detected.', delay: 1000, typeSpeed: 45 },
    { text: '> Access level: infinite love ❤️', delay: 1500, typeSpeed: 30 },
  ], termContainer, () => {
    // Phase 2: Mysterious text
    setTimeout(() => showLayer('layer-mystery'), 800);
    const mysteryText = document.getElementById('mystery-text');

    showPoeticSequence([
      { text: 'Some stories are too special to stay hidden.', hold: 2500 },
      { text: 'This is ours.', hold: 2000 },
    ], mysteryText, () => {
      // Show enter button
      const enterBtn = document.getElementById('enter-btn');
      gsap.fromTo(enterBtn, { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' });
      enterBtn.style.pointerEvents = 'auto';
    });
  });
});

// ===== ENTER HEART BUTTON =====
document.getElementById('enter-btn').addEventListener('click', () => {
  const btn = document.getElementById('enter-btn');
  gsap.to(btn, { opacity: 0, scale: 0.8, duration: 0.5 });

  // Cinematic transition
  gsap.to('.ambient-bg', {
    background: 'radial-gradient(ellipse at 50% 50%, rgba(253,221,230,0.5) 0%, rgba(200,181,216,0.2) 40%, #FFF8F5 100%)',
    duration: 2
  });

  startPetals();

  setTimeout(() => {
    // Phase 3: Poetry
    showLayer('layer-poetry');
    const poetryContainer = document.getElementById('poetry-text');

    showPoeticSequence([
      { text: 'Out of billions of people...', hold: 2500 },
      { text: 'My heart somehow found you.', hold: 2500 },
      { text: 'And since then...', hold: 2000 },
      { text: 'Every ordinary moment became magical.', hold: 3000 },
    ], poetryContainer, () => {
      // Phase 4: Image reveal
      setTimeout(() => {
        showLayer('layer-image');
        const frame = document.getElementById('couple-frame');
        const caption = document.getElementById('image-caption');
        const loveBtn = document.getElementById('love-btn');

        gsap.fromTo(frame,
          { opacity: 0, scale: 0.85, filter: 'blur(20px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power3.out' }
        );
        gsap.fromTo(caption, { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.5, delay: 2, ease: 'power2.out' });
        gsap.fromTo(loveBtn, { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 1, delay: 3, ease: 'power2.out',
            onComplete: () => { loveBtn.style.pointerEvents = 'auto'; }
          });
      }, 800);
    });
  }, 1500);
});

// ===== LOVE BUTTON =====
document.getElementById('love-btn').addEventListener('click', function () {
  this.style.pointerEvents = 'none';
  screenPulse();
  spawnHearts(isMobile ? 10 : 20);

  const glowEl = document.getElementById('heartbeat-glow');
  glowEl.style.display = 'block';
  gsap.fromTo(glowEl, { opacity: 0 }, { opacity: 1, duration: 0.5 });

  setTimeout(() => {
    showLayer('layer-love-answer');
    const loveText = document.getElementById('love-answer-text');

    showPoeticSequence([
      { text: 'Love you more than words can explain.', hold: 2500 },
      { text: 'Love you more than everything..', hold: 2500 },
      { text: 'Loveee youuuuu sooo muchhhhhh😘😘❤️', hold: 3000 },
    ], loveText, () => {
      gsap.to(glowEl, { opacity: 0, duration: 1 });
      // Phase 5: Envelope
      setTimeout(() => {
        showLayer('layer-envelope');
        const envWrapper = document.getElementById('envelope-wrapper');
        gsap.fromTo(envWrapper, { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' });
      }, 1000);
    });
  }, 1500);
});

// ===== ENVELOPE =====
document.getElementById('envelope').addEventListener('click', function () {
  const envelope = this;
  const letterPaper = document.getElementById('letter-paper');

  gsap.to(envelope, {
    scale: 0.9, opacity: 0, rotateX: -30, duration: 0.8, ease: 'power2.in',
    onComplete: () => {
      envelope.style.display = 'none';
      letterPaper.style.display = 'block';
      gsap.fromTo(letterPaper,
        { opacity: 0, scale: 0.9, rotateX: 10 },
        { opacity: 1, scale: 1, rotateX: 0, duration: 1.2, ease: 'power3.out' }
      );

      // Animate the letter title
      const title = letterPaper.querySelector('.letter-title');
      gsap.fromTo(title, { opacity: 0, y: 10, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, delay: 0.6 });

      // Animate letter paragraphs as real-time handwriting
      const paras = letterPaper.querySelectorAll('p');
      const originalTexts = Array.from(paras).map(p => p.innerHTML.trim());

      // Clear contents and prepare for typing
      paras.forEach(p => {
        p.innerHTML = '';
        p.style.opacity = 1;
      });

      let pIdx = 0;
      function typeParagraph() {
        if (pIdx >= paras.length) {
          // Show continue button after typing is complete
          const contBtn = document.getElementById('continue-btn');
          gsap.fromTo(contBtn, { opacity: 0, y: 10 }, {
            opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
            onComplete: () => { contBtn.style.pointerEvents = 'auto'; }
          });
          return;
        }

        const p = paras[pIdx];
        const chars = Array.from(originalTexts[pIdx]);
        let cIdx = 0;

        function typeChar() {
          if (cIdx < chars.length) {
            // Handle basic HTML entity like &nbsp; or standard char safely
            if (chars[cIdx] === '&' && chars.slice(cIdx, cIdx + 6).join('') === '&nbsp;') {
              p.innerHTML += '&nbsp;';
              cIdx += 6;
            } else {
              p.innerHTML += chars[cIdx];
              cIdx++;
            }

            // Auto scroll to bottom of the letter container so typing is always visible
            const letterContent = document.getElementById('letter-content');
            if (letterContent) {
              letterContent.scrollTop = letterContent.scrollHeight;
            } else {
              letterPaper.scrollTop = letterPaper.scrollHeight;
            }

            // Introduce realistic dynamic delays (comma/period pause)
            let delay = 15 + Math.random() * 20;
            const lastChar = chars[cIdx - 1];
            if (['.', '!', '?', '🌝', '💎', '🥹', '🫂', '😘', '💕', '❤️'].includes(lastChar)) {
              delay = 450; // Pause at end of sentence/emojis
            } else if ([',', '—', '-'].includes(lastChar)) {
              delay = 200; // Pause at clauses
            }
            setTimeout(typeChar, delay);
          } else {
            pIdx++;
            setTimeout(typeParagraph, 600); // Pause before starting next paragraph
          }
        }
        typeChar();
      }

      // Start typing after the title reveals
      setTimeout(typeParagraph, 1800);
    }
  });
});

// ===== FINAL SCENE =====
document.getElementById('continue-btn').addEventListener('click', () => {
  showLayer('layer-final');
  startPetals();
  spawnHearts(isMobile ? 8 : 15);

  const finalText = document.getElementById('final-text');

  showPoeticSequence([
    { text: 'In every lifetime...', hold: 2800 },
    { text: 'In every universe...', hold: 2800 },
    { text: 'It would still be you.', hold: 3500 },
  ], finalText, () => {
    // Final anniversary message
    const finalMsg = document.getElementById('final-message');
    gsap.fromTo(finalMsg,
      { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' }
    );

    // Continuous hearts
    setInterval(() => spawnHearts(3), 3000);

    // Final glow
    const glowEl = document.getElementById('heartbeat-glow');
    glowEl.style.display = 'block';
    gsap.to(glowEl, { opacity: 0.6, duration: 2 });
  });
});

// ===== EASTER EGG (triple tap / triple click) =====
let tapCount = 0, tapTimer;
document.addEventListener('click', () => {
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount = 0; }, 600);
  if (tapCount >= 3) {
    tapCount = 0;
    const egg = document.createElement('div');
    egg.className = 'poetic-line';
    egg.textContent = '✨ You are the reason I believe in magic ✨';
    egg.style.position = 'fixed';
    egg.style.bottom = '10%';
    egg.style.left = '50%';
    egg.style.transform = 'translateX(-50%)';
    egg.style.zIndex = '99999';
    egg.style.fontSize = 'clamp(0.8rem, 3vw, 1.2rem)';
    egg.style.color = '#C2657A';
    document.body.appendChild(egg);
    gsap.fromTo(egg, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
    setTimeout(() => { gsap.to(egg, { opacity: 0, duration: 1, onComplete: () => egg.remove() }); }, 3000);
  }
});
