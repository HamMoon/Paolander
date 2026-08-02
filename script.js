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
        this.soundBtn.textContent = '🔊 City of Stars';
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
          this.soundBtn.textContent = '🔊 City of Stars';
        })
        .catch(() => {
          this.soundBtn.textContent = '⚠ Toca de nuevo';
        });
    } else {
      this.audio.pause();
      this.soundBtn.textContent = '🔇 City of Stars';
    }
  },

  // Pausa silenciosa (usada al entrar a la sección Música,
  // para que no se pise con el reproductor de canciones).
  pauseForScreen() {
    if (!this.audio || this.audio.paused) return;
    this.audio.pause();
    this.soundBtn.textContent = '🔇 City of Stars';
  },

  // Reanuda automáticamente al salir de la sección Música.
  resumeForScreen() {
    if (!this.audio || !this.unlocked) return; // solo si ya se había desbloqueado antes
    this.audio.play()
      .then(() => {
        this.soundBtn.textContent = '🔊 City of Stars';
      })
      .catch(() => {});
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


/* ---------- 4. SCREEN MANAGER (navegación entre pantallas) ----------
   Controla 3 pantallas: menú (selección), inicio, música.
   Al entrar a "música" pausa la música de fondo (City of Stars);
   al salir, la reanuda automáticamente.
------------------------------------------------------- */

const ScreenManager = {
  current: 'menu',
  screens: {
    menu: document.getElementById('screen-menu'),
    inicio: document.getElementById('screen-inicio'),
    musica: document.getElementById('screen-musica')
  },
  backBtn: document.getElementById('back-btn'),

  init() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.goTo(btn.dataset.target));
    });

    this.backBtn.addEventListener('click', () => this.goTo('menu'));
  },

  goTo(screenName) {
    if (!this.screens[screenName]) return;

    // Salir de la pantalla actual
    if (this.current === 'musica' && screenName !== 'musica') {
      AudioManager.resumeForScreen();
    }

    // Entrar a la nueva pantalla
    if (screenName === 'musica') {
      AudioManager.pauseForScreen();
    }

    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[screenName].classList.add('active');

    this.backBtn.classList.toggle('show', screenName !== 'menu');

    this.current = screenName;
  }
};

ScreenManager.init();


/* ---------- 5. MUSIC PLAYER (placeholder visual) ----------
   Por ahora solo alterna el ícono play/pausa del reproductor
   de la sección Música. La lógica real de reproducción se
   conecta cuando se agreguen las canciones (Cloudflare R2).
------------------------------------------------------- */

const MusicPlayerUI = {
  playing: false,
  icon: document.getElementById('play-pause-icon'),
  btn: document.getElementById('btn-play-pause'),

  init() {
    this.btn.addEventListener('click', () => this.toggle());
  },

  toggle() {
    this.playing = !this.playing;
    this.icon.src = this.playing
      ? 'assets/player/btn-pause.png'
      : 'assets/player/btn-play.png';
  }
};

MusicPlayerUI.init();
