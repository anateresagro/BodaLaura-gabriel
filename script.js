/* =========================================================
   INVITACIÓN WEB - LAURA & GABRIEL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------
  // 1. CUENTA REGRESIVA
  // Fecha objetivo: 24 de octubre de 2027.
  // Se interpreta a las 00:00:00 en la zona horaria local
  // del dispositivo del invitado.
  // ---------------------------------------------------------
  const targetDate = new Date(2027, 9, 24, 0, 0, 0);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------------------------------------------------------
  // 2. MÚSICA
  // No hace falta escribir el nombre de la canción aquí.
  // El script busca automáticamente el primer audio dentro
  // de /assets. Admite mp3, wav, ogg, m4a y aac.
  //
  // Importante: los navegadores suelen bloquear el autoplay
  // con sonido. Por eso primero se intenta reproducir y,
  // si el navegador lo bloquea, se inicia con el primer toque,
  // clic o desplazamiento del invitado.
  // ---------------------------------------------------------
  const music = document.getElementById("weddingMusic");

  const audioFiles = [
    "mp3", "wav", "ogg", "m4a", "aac"
  ];

  async function findAudioFile() {
    // Se prueban nombres comunes y, además, el nombre que se
    // puede definir directamente aquí si se desea.
    const explicitName = "perfect.mp3";

    if (explicitName.trim()) {
      return `assets/${explicitName.trim()}`;
    }

    // Como JavaScript del navegador no puede listar una carpeta
    // local de forma segura, dejamos una lista de nombres posibles.
    // Si tu canción tiene otro nombre, escribe SOLO su nombre en
    // explicitName arriba.
    const candidates = [
      "cancion.mp3",
      "musica.mp3",
      "song.mp3",
      "boda.mp3",
      "cancion.wav",
      "musica.wav",
      "song.wav",
      "boda.wav",
      "cancion.m4a",
      "musica.m4a",
      "song.m4a",
      "boda.m4a",
      "cancion.ogg",
      "musica.ogg",
      "song.ogg",
      "boda.ogg"
    ];

    for (const candidate of candidates) {
      try {
        const response = await fetch(`assets/${candidate}`, {
          method: "HEAD",
          cache: "no-store"
        });

        if (response.ok) {
          return `assets/${candidate}`;
        }
      } catch (error) {
        // Se continúa con el siguiente nombre.
      }
    }

    return null;
  }

  let musicReady = false;

  async function setupMusic() {
    const audioSource = await findAudioFile();

    if (!audioSource) {
      console.info(
        "No se encontró la canción. Puedes definir su nombre en explicitName dentro de script.js."
      );
      return;
    }

    music.src = audioSource;
    music.volume = 0.65;
    musicReady = true;

    // Intento de reproducción automática.
    music.play().catch(() => {
      // El navegador puede bloquear el autoplay con sonido.
      // En ese caso se espera a la primera interacción.
    });
  }

  function startMusic() {
    if (!musicReady) return;

    music.play().catch(() => {});
    removeInteractionListeners();
  }

  function removeInteractionListeners() {
    window.removeEventListener("click", startMusic);
    window.removeEventListener("touchstart", startMusic);
    window.removeEventListener("scroll", startMusic);
    window.removeEventListener("pointerdown", startMusic);
  }

  window.addEventListener("click", startMusic, { passive: true });
  window.addEventListener("touchstart", startMusic, { passive: true });
  window.addEventListener("scroll", startMusic, { passive: true });
  window.addEventListener("pointerdown", startMusic, { passive: true });

  setupMusic();
});
