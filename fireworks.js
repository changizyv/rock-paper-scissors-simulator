function showFireworks() {
    const canvas = document.createElement("canvas");
    canvas.id = "fireworks";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
    const fireworks = [];
  
    for (let i = 0; i < 30; i++) {
      fireworks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2,
        r: Math.random() * 4 + 2,
        alpha: 1,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }
  
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fireworks.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.globalAlpha = f.alpha;
        ctx.fill();
        f.alpha -= 0.02;
        f.r += 0.5;
      });
      if (fireworks[0].alpha > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
  
    animate();
  }
  