
"use strict";

/* =========================================
   EDU VERSE — NETWORK ANIMATION ENGINE
   Floating Particles + Connecting Lines
========================================= */

(() => {
  const canvas = document.getElementById("networkBackground");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;
  let lastFrame = 0;

  const settings = {
    particleSize: 2,
    connectionDistance: 125,
    speed: 0.32,
    density: 8500,
    maxParticles: 100
  };

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
  }

  function createParticles() {
    const count = Math.min(
      settings.maxParticles,
      Math.max(35, Math.floor((width * height) / settings.density))
    );

    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed,
        radius: Math.random() * 1.7 + 1,
        alpha: Math.random() * 0.45 + 0.25
      });
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(105, 230, 177, ${p.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < settings.connectionDistance) {
          const opacity =
            (1 - distance / settings.connectionDistance) * 0.23;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle = `rgba(75, 205, 151, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10 || p.x > width + 10) {
        p.vx *= -1;
      }

      if (p.y < -10 || p.y > height + 10) {
        p.vy *= -1;
      }
    }
  }

  function animate(timestamp) {
    animationId = null;

    if (document.hidden) return;

    if (timestamp - lastFrame < 32) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    lastFrame = timestamp;

    ctx.clearRect(0, 0, width, height);

    updateParticles();
    drawConnections();
    drawParticles();

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationId && !document.hidden) {
      animationId = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  startAnimation();

})();
