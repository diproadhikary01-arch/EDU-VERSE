
"use strict";

/* =========================================
   EDU VERSE — ULTRA NETWORK ENGINE
   Emerald • Gold • Dynamic Glow
   Interactive Particles • Smooth Motion
========================================= */

(() => {

  const canvas = document.getElementById("networkBackground");

  if (!canvas || canvas.dataset.initialized === "true") return;

  const ctx = canvas.getContext("2d", {
    alpha: true
  });

  if (!ctx) return;

  canvas.dataset.initialized = "true";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) return;

  /* =====================================
     CONFIGURATION
  ===================================== */

  const settings = {
    desktopParticles: 90,
    mobileParticles: 38,

    connectionDistance: 155,
    mouseDistance: 190,

    speed: 0.42,
    mouseForce: 0.012,

    minRadius: 1.1,
    maxRadius: 2.5,

    lineOpacity: 0.27,
    glowStrength: 12,

    desktopFPS: 50,
    mobileFPS: 30
  };

  let width = 0;
  let height = 0;
  let dpr = 1;

  let particles = [];
  let animationId = null;
  let lastFrame = 0;
  let resizeTimer = null;

  let isLightMode = document.body.classList.contains("light-mode");

  const pointer = {
    x: null,
    y: null,
    active: false
  };

  const colors = {
    dark: [
      [22, 230, 154],
      [54, 201, 138],
      [232, 185, 79],
      [105, 230, 177],
      [180, 245, 210]
    ],

    light: [
      [35, 160, 105],
      [70, 180, 125],
      [210, 160, 65]
    ]
  };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getColors() {
    return isLightMode ? colors.light : colors.dark;
  }

  function getFPS() {
    return width <= 600
      ? settings.mobileFPS
      : settings.desktopFPS;
  }

  /* =====================================
     CANVAS RESIZE
  ===================================== */

  function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(
      window.devicePixelRatio || 1,
      width <= 600 ? 1.5 : 1.8
    );

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
  }

  /* =====================================
     CREATE PARTICLES
  ===================================== */

  function createParticles() {

    const baseCount = width <= 600
      ? settings.mobileParticles
      : settings.desktopParticles;

    const count = Math.min(
      baseCount,
      Math.max(
        25,
        Math.floor(
          (width * height) / (width <= 600 ? 12500 : 9000)
        )
      )
    );

    particles = [];

    const palette = getColors();

    for (let i = 0; i < count; i++) {

      const color = palette[
        Math.floor(Math.random() * palette.length)
      ];

      particles.push({

        x: random(0, width),
        y: random(0, height),

        vx: random(-settings.speed, settings.speed),
        vy: random(-settings.speed, settings.speed),

        radius: random(
          settings.minRadius,
          settings.maxRadius
        ),

        alpha: random(0.4, 0.9),

        color,

        phase: random(0, Math.PI * 2),

        pulseSpeed: random(0.008, 0.025)

      });

    }
  }

  /* =====================================
     UPDATE PARTICLES
  ===================================== */

  function updateParticles() {

    for (const p of particles) {

      p.x += p.vx;
      p.y += p.vy;

      p.phase += p.pulseSpeed;

      /* Boundary */

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      /* Mouse / Touch Interaction */

      if (pointer.active && pointer.x !== null) {

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < settings.mouseDistance &&
          distance > 0
        ) {

          const force =
            (1 - distance / settings.mouseDistance) *
            settings.mouseForce;

          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;

        }
      }

      /* Speed Limiter */

      const maxSpeed = 0.85;

      p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
      p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));

    }
  }

  /* =====================================
     DRAW NETWORK CONNECTIONS
  ===================================== */

  function drawConnections() {

    const maxDistance = settings.connectionDistance;

    for (let i = 0; i < particles.length; i++) {

      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {

        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {

          const opacity =
            (1 - distance / maxDistance) *
            settings.lineOpacity;

          const mix = (i + j) % 4;

          const palette = getColors();
          const color = palette[mix % palette.length];

          ctx.beginPath();

          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle =
            `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;

          ctx.lineWidth = 0.85;

          ctx.stroke();

        }
      }
    }
  }

  /* =====================================
     MOUSE CONNECTION GLOW
  ===================================== */

  function drawPointerConnections() {

    if (!pointer.active || pointer.x === null) return;

    for (const p of particles) {

      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < settings.mouseDistance) {

        const opacity =
          (1 - distance / settings.mouseDistance) * 0.38;

        ctx.beginPath();

        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(p.x, p.y);

        ctx.strokeStyle = isLightMode
          ? `rgba(35, 160, 105, ${opacity})`
          : `rgba(54, 230, 160, ${opacity})`;

        ctx.lineWidth = 1;

        ctx.stroke();

      }
    }
  }

  /* =====================================
     DRAW GLOW PARTICLES
  ===================================== */

  function drawParticles() {

    for (const p of particles) {

      const pulse =
        0.75 + Math.sin(p.phase) * 0.25;

      const radius = p.radius * pulse;

      const [r, g, b] = p.color;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(${r}, ${g}, ${b}, ${p.alpha})`;

      ctx.shadowBlur = isLightMode
        ? 6
        : settings.glowStrength;

      ctx.shadowColor =
        `rgba(${r}, ${g}, ${b}, ${isLightMode ? 0.25 : 0.75})`;

      ctx.fill();

    }

    ctx.shadowBlur = 0;
  }

  /* =====================================
     POINTER EVENTS
  ===================================== */

  function updatePointer(event) {

    const point = event.touches
      ? event.touches[0]
      : event;

    pointer.x = point.clientX;
    pointer.y = point.clientY;
    pointer.active = true;

  }

  function clearPointer() {

    pointer.x = null;
    pointer.y = null;
    pointer.active = false;

  }

  window.addEventListener(
    "mousemove",
    updatePointer,
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    updatePointer,
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    updatePointer,
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    clearPointer,
    { passive: true }
  );

  window.addEventListener(
    "mouseleave",
    clearPointer
  );

  /* =====================================
     THEME DETECTION
  ===================================== */

  const themeObserver = new MutationObserver(() => {

    const nextMode =
      document.body.classList.contains("light-mode");

    if (nextMode !== isLightMode) {

      isLightMode = nextMode;

      const palette = getColors();

      for (const p of particles) {

        p.color = palette[
          Math.floor(Math.random() * palette.length)
        ];

      }
    }

  });

  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  /* =====================================
     ANIMATION ENGINE
  ===================================== */

  function animate(timestamp) {

    animationId = null;

    if (document.hidden) return;

    const interval = 1000 / getFPS();

    if (timestamp - lastFrame < interval) {

      animationId = requestAnimationFrame(animate);
      return;

    }

    lastFrame = timestamp;

    ctx.clearRect(0, 0, width, height);

    updateParticles();

    drawConnections();

    drawPointerConnections();

    drawParticles();

    animationId = requestAnimationFrame(animate);

  }

  /* =====================================
     START / STOP
  ===================================== */

  function startAnimation() {

    if (!animationId && !document.hidden) {

      lastFrame = 0;

      animationId = requestAnimationFrame(animate);

    }
  }

  function stopAnimation() {

    if (animationId !== null) {

      cancelAnimationFrame(animationId);

      animationId = null;

    }
  }

  /* =====================================
     VISIBILITY HANDLING
  ===================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopAnimation();

      } else {

        startAnimation();

      }

    }
  );

  /* =====================================
     RESIZE HANDLING
  ===================================== */

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      resizeCanvas();

    }, 150);

  }, { passive: true });

  /* =====================================
     INITIALIZE
  ===================================== */

  resizeCanvas();

  startAnimation();

})();
