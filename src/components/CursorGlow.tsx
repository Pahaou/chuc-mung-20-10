import { useEffect, useRef } from 'react'
import './effects.css'

/** Quầng sáng mềm đi theo con trỏ — chỉ bật trên thiết bị có chuột. */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const glow = glowRef.current
    const dot = dotRef.current
    if (!glow || !dot || !fine.matches || reduce.matches) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let gx = tx
    let gy = ty
    let raf = 0

    const tick = () => {
      gx += (tx - gx) * 0.12
      gy += (ty - gy) * 0.12
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`
      raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.3 ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      glow.classList.add('is-visible')
      dot.classList.add('is-visible')
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      glow.classList.remove('is-visible')
      dot.classList.remove('is-visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
