export class Particles {
  private ctx: CanvasRenderingContext2D | null;
  private raf = 0;
  private width = 1;
  private height = 1;
  private last = 0;
  private frames = 0;
  private elapsed = 0;
  private paused = false;
  private pool = Array.from({ length: 150 }, () => ({
    life: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    size: 0,
    color: '#ffd55b',
    angle: 0,
    spin: 0,
    shape: 'line',
  }));
  constructor(
    private canvas: HTMLCanvasElement,
    private lite: () => boolean,
    private onSlow: () => void,
  ) {
    this.ctx = canvas.getContext('2d');
    this.resize();
    this.raf = requestAnimationFrame(this.tick);
  }
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    const dpr = Math.min(devicePixelRatio, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  burst(x: number, y: number, color: string, count = 18, shape: 'line' | 'seed' | 'star' = 'line') {
    let left = Math.min(count, this.lite() ? 12 : 60);
    for (const p of this.pool) {
      if (p.life <= 0 && left > 0) {
        const a = Math.random() * Math.PI * 2,
          s = 80 + Math.random() * 270;
        Object.assign(p, {
          life: 0.5 + Math.random() * 0.45,
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 90,
          size: 3 + Math.random() * 7,
          color,
          shape,
          angle: a,
          spin: (Math.random() - 0.5) * 12,
        });
        left--;
      }
    }
  }
  private tick = (now: number) => {
    const dt = Math.min((now - this.last) / 1000 || 0.016, 0.04);
    this.last = now;
    if (!this.paused) {
      const c = this.ctx;
      if (c) {
        c.clearRect(0, 0, this.width, this.height);
        for (const p of this.pool) {
          if (p.life <= 0) continue;
          p.life -= dt;
          p.vy += 550 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.angle += p.spin * dt;
          c.save();
          c.globalAlpha = Math.min(1, p.life * 3);
          c.fillStyle = p.color;
          c.translate(p.x, p.y);
          c.rotate(p.angle);
          if (p.shape === 'seed') {
            c.beginPath();
            c.ellipse(0, 0, p.size * 0.35, p.size * 0.7, 0, 0, Math.PI * 2);
            c.fill();
          } else if (p.shape === 'star') {
            c.beginPath();
            for (let i = 0; i < 8; i++) {
              const r = i % 2 ? p.size * 0.3 : p.size;
              const a = (i * Math.PI) / 4;
              c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            c.closePath();
            c.fill();
          } else c.fillRect(-p.size, -1, p.size * 2.5, 2);
          c.restore();
        }
      }
      this.frames++;
      this.elapsed += dt;
      if (this.elapsed >= 1.2) {
        if (this.frames / this.elapsed < 38) this.onSlow();
        this.frames = 0;
        this.elapsed = 0;
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };
  pause(v: boolean) {
    this.paused = v;
  }
  destroy() {
    cancelAnimationFrame(this.raf);
    this.pool.forEach((p) => (p.life = 0));
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }
}
