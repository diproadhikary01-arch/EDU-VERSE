"use strict";

(() => {
  const canvas = document.getElementById("networkBackground");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const colors = [
    "rgba(54, 201, 138,",
    "rgba(230, 189, 101,"
  ];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
      100,
      Math.max(35, Math.floor(width / 9))
    );

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.2 + 1,
      color: colors[Math.random() > 0.25 ? 0 : 1]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += reduceMotion ? 0 : p.vx;
      p.y += reduceMotion ? 0 : p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + "0.75)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color + "0.5)";
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 125) {
          const opacity = (1 - distance / 125) * 0.32;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle =
            `rgba(90, 205, 155, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  resizeCanvas();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    draw();
  });

})();
