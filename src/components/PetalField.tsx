import { useEffect, useRef } from 'react'
import './effects.css'

/**
 * Cánh hoa rơi + hạt sáng lấp lánh, vẽ bằng canvas.
 * Cánh hoa được vẽ sẵn thành sprite để mỗi khung hình chỉ cần drawImage.
 */

type Petal = {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  swayAmp: number
  swayFreq: number
  phase: number
  rot: number
  rotSpeed: number
  flip: number
  flipSpeed: number
  sprite: number
  alpha: number
}

type Spark = {
  x: number
  y: number
  r: number
  vy: number
  phase: number
  twinkle: number
}

const PETAL_COLORS: [string, string][] = [
  ['#ffe4ec', '#f3aec0'],
  ['#f9c6d3', '#e07c98'],
  ['#fff3ea', '#f6c9cf'],
  ['#e88aa3', '#a12d4f'],
  ['#fbd6dc', '#d9677f'],
]

const SPRITE = 64

function makePetalSprite([light, deep]: [string, string]) {
  const c = document.createElement('canvas')
  c.width = c.height = SPRITE
  const g = c.getContext('2d')!
  g.translate(SPRITE / 2, SPRITE / 2)
  const grad = g.createLinearGradient(0, -26, 0, 26)
  grad.addColorStop(0, light)
  grad.addColorStop(1, deep)
  g.fillStyle = grad
  g.beginPath()
  g.moveTo(0, 26)
  g.bezierCurveTo(-24, 10, -22, -18, -6, -26)
  g.quadraticCurveTo(0, -20, 6, -26)
  g.bezierCurveTo(22, -18, 24, 10, 0, 26)
  g.fill()
  // gân cánh mờ
  g.strokeStyle = 'rgba(255,255,255,0.35)'
  g.lineWidth = 1.2
  g.beginPath()
  g.moveTo(0, 22)
  g.quadraticCurveTo(-2, 0, 0, -18)
  g.stroke()
  return c
}

function makeSparkSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, 'rgba(255,250,235,1)')
  grad.addColorStop(0.25, 'rgba(246,224,180,0.75)')
  grad.addColorStop(1, 'rgba(236,213,162,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 32, 32)
  return c
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export default function PetalField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sprites = PETAL_COLORS.map(makePetalSprite)
    const spark = makeSparkSprite()

    let w = 0
    let h = 0
    let petals: Petal[] = []
    let sparks: Spark[] = []
    let raf = 0
    let last = 0
    let running = false

    const newPetal = (initial: boolean): Petal => {
      const size = rand(10, 22) * (w < 640 ? 0.85 : 1)
      return {
        x: rand(-40, w + 40),
        y: initial ? rand(-h, h) : rand(-120, -30),
        size,
        speed: rand(28, 62) * (size / 16),
        drift: rand(-18, 26),
        swayAmp: rand(14, 46),
        swayFreq: rand(0.4, 1.1),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-1.2, 1.2),
        flip: rand(0, Math.PI * 2),
        flipSpeed: rand(1, 2.6),
        sprite: Math.floor(Math.random() * sprites.length),
        alpha: rand(0.55, 0.95),
      }
    }

    const newSpark = (): Spark => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(3, 9),
      vy: rand(-10, -3),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.8, 2.2),
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const petalCount = Math.round(Math.min(34, Math.max(12, w / 42)))
      const sparkCount = Math.round(Math.min(36, Math.max(14, w / 45)))
      while (petals.length < petalCount) petals.push(newPetal(true))
      petals.length = petalCount
      while (sparks.length < sparkCount) sparks.push(newSpark())
      sparks.length = sparkCount
    }

    const draw = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0)
      last = t
      const time = t / 1000
      const dpr = canvas.width / w
      // làn gió nhẹ đổi chiều theo thời gian
      const gust = Math.sin(time * 0.15) * 22 + Math.sin(time * 0.37) * 8

      ctx.clearRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      for (const s of sparks) {
        s.y += s.vy * dt
        if (s.y < -10) {
          s.y = h + 10
          s.x = rand(0, w)
        }
        const a = 0.25 + 0.75 * Math.abs(Math.sin(time * s.twinkle + s.phase))
        ctx.globalAlpha = a * 0.8
        ctx.drawImage(spark, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2)
      }

      ctx.globalCompositeOperation = 'source-over'
      for (const p of petals) {
        p.y += p.speed * dt
        p.x += (p.drift + gust) * dt
        p.rot += p.rotSpeed * dt
        p.flip += p.flipSpeed * dt
        if (p.y > h + 40 || p.x < -80 || p.x > w + 80) Object.assign(p, newPetal(false))

        const x = p.x + Math.sin(time * p.swayFreq + p.phase) * p.swayAmp
        const scaleX = Math.cos(p.flip)
        ctx.globalAlpha = p.alpha
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.translate(x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(scaleX < 0 ? Math.min(scaleX, -0.15) : Math.max(scaleX, 0.15), 1)
        const s = p.size * 2
        ctx.drawImage(sprites[p.sprite], -s / 2, -s / 2, s, s)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduce.matches || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onVisibility = () => (document.hidden ? stop() : start())
    const onMotionPref = () => {
      if (reduce.matches) {
        stop()
        ctx.clearRect(0, 0, w, h)
      } else start()
    }

    resize()
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    reduce.addEventListener('change', onMotionPref)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      reduce.removeEventListener('change', onMotionPref)
    }
  }, [])

  return <canvas ref={ref} className="petal-field" aria-hidden="true" />
}
