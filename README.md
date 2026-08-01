# Paohan

Página pixel-art con fondo animado, avatar interactivo y audio en loop.

## Estructura

```
paohan/
├── index.html
├── script.js
└── assets/
    ├── avatar.png
    ├── fondo_cielo_estrellado.gif
    ├── musica.mp3
    ├── button.png
    ├── font-m6x11plus.ttf
    ├── bubble-music.png
    ├── bubble-sleep.png
    └── bubble-heart.png
```

## Cómo correrlo localmente

No requiere build ni dependencias. Solo abre `index.html` en el navegador,
o levanta un servidor local simple:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Stack

- HTML / CSS puro (`image-rendering: pixelated` en todos los assets)
- JavaScript vanilla, sin librerías externas
- Gestión de audio compatible con las políticas de autoplay en móviles
