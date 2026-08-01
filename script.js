/* ============================================
   PAOHAN - script.js
   Vanilla JS puro, sin librerías externas
   ============================================ */

/* ---------- 1. AUDIO MANAGER (autoplay-safe) ----------
   Los navegadores móviles (iOS Safari, Chrome Android)
   bloquean el autoplay de audio hasta que exista una
   interacción explícita del usuario (tap/click).
   Estrategia: crear el elemento <audio> en pausa,
   y desbloquearlo en el primer gesto del usuario.
------------------------------------------------------- */

const AudioManager = {
  audio: null,
  unlocked: false,
  soundBtn: document.getElementById('sound-btn'),

  init(src) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.5;
    this.audio.preload = 'auto';

    // Intenta desbloquear en el primer toque/click en cualquier
    // parte de la página (requisito de políticas de autoplay).
    const unlockEvents = ['touchstart', 'click', 'keydown'];
    const unlockHandler = () => this.unlock();
    unlockEvents.forEach(evt => {
      document.addEventListener(evt, unlockHandler, { once: true });
    });

    this.soundBtn.addEventListener('click', () => this.toggle());
  },

  unlock() {
    if (this.unlocked || !this.audio) return;
    // Reproduce y pausa inmediatamente: truco estándar para
    // "desbloquear" el audio en móviles sin sonido audible.
    this.audio.play()
      .then(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.unlocked = true;
      })
      .catch(() => {
        // Si falla, el usuario deberá activar el sonido manualmente
        // con el botón — no rompe la experiencia.
      });
  },

  toggle() {
    if (!this.audio) return;

    if (this.audio.paused) {
      this.audio.play()
        .then(() => {
          this.unlocked = true;
          this.soundBtn.textContent = '🔊 Love Me Again';
        })
        .catch(() => {
          this.soundBtn.textContent = '⚠ Toca de nuevo';
        });
    } else {
      this.audio.pause();
      this.soundBtn.textContent = '🔇 Love Me Again';
    }
  }
};

AudioManager.init('assets/musica.mp3');


/* ---------- 2. BUBBLE MANAGER (burbujas de estado) ----------
   Cada cierto tiempo aleatorio aparece una burbuja PNG
   (música, sueño o corazón) al lado del avatar, se muestra
   unos segundos y desaparece con transición suave.
------------------------------------------------------- */

const BubbleManager = {
  el: document.getElementById('bubble'),
  images: [
    'assets/bubble-music.png',
    'assets/bubble-sleep.png',
    'assets/bubble-heart.png'
  ],

  start() {
    this.scheduleNext();
  },

  scheduleNext() {
    const delay = 4000 + Math.random() * 5000; // entre 4s y 9s
    setTimeout(() => this.showRandom(), delay);
  },

  showRandom() {
    const src = this.images[Math.floor(Math.random() * this.images.length)];
    this.el.src = src;
    this.el.classList.add('show');

    const visibleTime = 1800 + Math.random() * 800;
    setTimeout(() => {
      this.el.classList.remove('show');
      this.scheduleNext();
    }, visibleTime);
  }
};

BubbleManager.start();
