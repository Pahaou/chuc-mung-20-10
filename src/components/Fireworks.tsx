import { useEffect, useRef } from 'react'

/**
 * Pháo sáng nhẹ nhàng — chỉ chạy khi khu vực đang hiển thị trên màn hình.
 * Cứ vài loạt sẽ có một loạt nổ hình trái tim.
 */

type Shell = { x: number; y: number; tx: number; ty: number; t: number; dur: number; color: string; heart: boolean }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }

const COLORS = ['#f6e8c8', '#ecd5a2', '#ffc2d1', '#f3aec0', '#ffffff', '#ff9fb6']
const rand = (a: number, b: number) => a + Math.random() * (b - a)

export default function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let w = 0
    let h = 0
    let dpr = 1
    let shells: Shell[] = []
    let particles: Particle[] = []
    let visible = false
    let inView = false
    let raf = 0
    let last = 0
    let nextLaunch = 0
    let launched = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    const launch = () => {
      const tx = rand(w * 0.15, w * 0.85)
      shells.push({
        x: tx + rand(-40, 40),
        y: h + 10,
        tx,
        ty: rand(h * 0.12, h * 0.45),
        t: 0,
        dur: rand(0.9, 1.3),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        heart: launched % 3 === 2,
      })
      launched++
    }

    const explode = (s: Shell) => {
      const scale = Math.min(w, 900) / 900
      if (s.heart) {
        const n = 54
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2
          const hx = 16 * Math.sin(a) ** 3
          const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))
          const k = rand(6.2, 6.8) * (0.6 + scale * 0.6)
          particles.push({ x: s.tx, y: s.ty, vx: hx * k, vy: hy * k, life: 0, max: rand(1.8, 2.3), color: i % 4 ? '#ffb3c6' : '#f6e8c8', size: rand(1.4, 2.2) })
        }
      } else {
        const n = Math.round(rand(40, 56))
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05)
          const sp = rand(60, 150) * (0.6 + scale * 0.6)
          particles.push({ x: s.tx, y: s.ty, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(1.4, 2.2), color: Math.random() < 0.7 ? s.color : '#ffffff', size: rand(1.2, 2.2) })
        }
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (visible && now >= nextLaunch) {
        launch()
        nextLaunch = now + (launched < 3 ? rand(350, 600) : rand(1400, 2300))
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // làm mờ dần khung trước để tạo vệt sáng
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      shells = shells.filter((s) => {
        s.t += dt
        const p = Math.min(1, s.t / s.dur)
        const e = 1 - (1 - p) ** 3
        const x = s.x + (s.tx - s.x) * e
        const y = s.y + (s.ty - s.y) * e
        ctx.globalAlpha = 0.9
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        if (p >= 1) {
          explode(s)
          return false
        }
        return true
      })

      particles = particles.filter((p) => {
        p.life += dt
        if (p.life >= p.max) return false
        const drag = 0.985 ** (dt * 60)
        p.vx *= drag
        p.vy = p.vy * drag + 36 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        const fade = 1 - p.life / p.max
        ctx.globalAlpha = fade * (0.7 + 0.3 * Math.sin(p.life * 30))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.6 + fade * 0.6), 0, Math.PI * 2)
        ctx.fill()
        return true
      })
      ctx.globalAlpha = 1

      if (visible || shells.length || particles.length) {
        raf = requestAnimationFrame(frame)
      } else {
        raf = 0
        ctx.clearRect(0, 0, w, h)
      }
    }

    const sync = () => {
      visible = inView && !document.hidden
      if (visible && !raf) {
        last = performance.now()
        nextLaunch = last + 400
        raf = requestAnimationFrame(frame)
      }
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { threshold: 0.35 },
    )
    const ro = new ResizeObserver(resize)

    resize()
    io.observe(canvas)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <canvas ref={ref} className="fireworks" aria-hidden="true" />
}
