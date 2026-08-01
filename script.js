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

    // En el primer toque/click/tecla en cualquier parte de la página,
    // arrancamos la reproducción real (requisito de autoplay en móviles:
    // debe ocurrir dentro del mismo gesto del usuario).
    const unlockEvents = ['touchstart', 'click', 'keydown'];
    const unlockHandler = () => this.playFromGesture();
    unlockEvents.forEach(evt => {
      document.addEventListener(evt, unlockHandler, { once: true });
    });

    this.soundBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // evita que este mismo click dispare el unlock genérico dos veces
      this.toggle();
    });
  },

  playFromGesture() {
    if (this.unlocked || !this.audio) return;
    this.audio.play()
      .then(() => {
        this.unlocked = true;
        this.soundBtn.textContent = '🔊 Love Me Again';
      })
      .catch(() => {
        // Si el navegador lo bloquea igual, queda disponible el botón manual.
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


/* ---------- 3. COUNTDOWN (Reencuentro) ----------
   Cuenta regresiva en días, horas y minutos hasta
   el 28 de septiembre de este año.
------------------------------------------------------- */

const CountdownManager = {
  targetDate: new Date('2026-09-28T00:00:00'),
  elDays: document.getElementById('cd-days'),
  elHours: document.getElementById('cd-hours'),
  elMinutes: document.getElementById('cd-minutes'),
  elSeconds: document.getElementById('cd-seconds'),

  start() {
    this.update();
    setInterval(() => this.update(), 1000); // se actualiza cada segundo
  },

  update() {
    const now = new Date();
    let diff = this.targetDate - now;

    if (diff <= 0) {
      this.elDays.textContent = '0';
      this.elHours.textContent = '0';
      this.elMinutes.textContent = '0';
      this.elSeconds.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    this.elDays.textContent = days;
    this.elHours.textContent = hours;
    this.elMinutes.textContent = minutes;
    this.elSeconds.textContent = seconds;
  }
};

CountdownManager.start();
