import { useEffect, useRef } from "react";

const WeatherEffects = ({ condition }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let particles = [];

    const createRainDrops = () => {
      particles = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 10,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    };

    const createSnowFlakes = () => {
      particles = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        drift: Math.random() * 1 - 0.5,
      }));
    };

    const createStars = () => {
      particles = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.8,
        radius: Math.random() * 1.8 + 0.3,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    const animateRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(174, 214, 241, 0.6)";
      ctx.lineWidth = 1;

      particles.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.globalAlpha = drop.opacity;
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= 1;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animateRain);
    };

    const animateSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animateSnow);
    };

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((star) => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1 || star.opacity <= 0) {
          star.twinkleDir *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.fill();
      });

      // Draw moon
      ctx.beginPath();
      ctx.arc(canvas.width - 120, 100, 45, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 248, 200, 0.92)";
      ctx.shadowBlur = 40;
      ctx.shadowColor = "rgba(255, 248, 150, 0.6)";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Moon crescent shadow
      ctx.beginPath();
      ctx.arc(canvas.width - 105, 92, 38, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30, 40, 80, 0.55)";
      ctx.fill();

      animationRef.current = requestAnimationFrame(animateStars);
    };

    const animateSunny = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 100;
      const cy = 100;
      const time = Date.now() * 0.001;

      // Sun glow
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      gradient.addColorStop(0, "rgba(255, 230, 100, 0.35)");
      gradient.addColorStop(1, "rgba(255, 200, 50, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Sun core
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 220, 80, 0.95)";
      ctx.fill();

      // Rays
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + time;
        const x1 = cx + Math.cos(angle) * 48;
        const y1 = cy + Math.sin(angle) * 48;
        const x2 = cx + Math.cos(angle) * 70;
        const y2 = cy + Math.sin(angle) * 70;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(255, 220, 80, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animateSunny);
    };

    // Start correct animation based on condition
    if (condition === "rain" || condition === "drizzle" || condition === "thunderstorm") {
      createRainDrops();
      animateRain();
    } else if (condition === "snow") {
      createSnowFlakes();
      animateSnow();
    } else if (condition === "clear-night") {
      createStars();
      animateStars();
    } else if (condition === "clear-day") {
      animateSunny();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="weather-canvas"
    />
  );
};

export default WeatherEffects;