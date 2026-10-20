import { useEffect, useRef } from 'react'
import './effects.css'

const BURST_EVENT = 'hearts:burst'
const MAX_HEARTS = 70
const COLORS = ['#e05a7d', '#f3aec0', '#c23c63', '#ecd5a2', '#ff8fab']

const HEART_SVG =
  '<svg viewBox="0 0 100 90" aria-hidden="true"><path fill="currentColor" d="M50 86C22 66 4 50 4 28 4 14 15 4 28 4c10 0 18 5 22 13 4-8 12-13 22-13 13 0 24 10 24 24 0 22-18 38-46 58z"/></svg>'

/** Bắn một chùm trái tim tại toạ độ màn hình (dùng cho nút bấm). */
export function burstHearts(x: number, y: number, count = 12) {
  window.dispatchEvent(new CustomEvent(BURST_EVENT, { detail: { x, y, count } }))
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Trái tim nhỏ bay lên mỗi khi người dùng chạm / nhấn vào màn hình. */
export default function TapHearts() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const spawn = (x: number, y: number, count: number, spread: number) => {
      for (let i = 0; i < count; i++) {
        if (layer.childElementCount >= MAX_HEARTS) layer.firstElementChild?.remove()
        const el = document.createElement('span')
        el.className = 'tap-heart'
        el.innerHTML = HEART_SVG
        const size = i === 0 && count < 6 ? rand(20, 26) : rand(9, 18)
        const duration = rand(1.3, 2.2)
        el.style.left = `${x + rand(-spread, spread) * 0.3}px`
        el.style.top = `${y + rand(-spread, spread) * 0.2}px`
        el.style.setProperty('--s', `${size}px`)
        el.style.setProperty('--dx', `${rand(-spread, spread)}px`)
        el.style.setProperty('--rise', `${rand(90, 170) + spread * 0.6}px`)
        el.style.setProperty('--r', `${rand(-35, 35)}deg`)
        el.style.setProperty('--d', `${duration}s`)
        el.style.animationDelay = `${i * 0.03}s`
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        layer.appendChild(el)
        window.setTimeout(() => el.remove(), (duration + i * 0.03) * 1000 + 100)
      }
    }

    const onPointer = (e: PointerEvent) => {
      if (e.button !== 0) return
      spawn(e.clientX, e.clientY, 4, 30)
    }
    const onBurst = (e: Event) => {
      const { x, y, count } = (e as CustomEvent<{ x: number; y: number; count: number }>).detail
      spawn(x, y, count, 90)
    }

    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener(BURST_EVENT, onBurst)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener(BURST_EVENT, onBurst)
    }
  }, [])

  return <div ref={layerRef} className="tap-hearts" aria-hidden="true" />
}
