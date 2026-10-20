import { useId } from 'react'
import { motion, type Variants } from 'motion/react'

import { finale, footer } from '../data/content'
import Fireworks from './Fireworks'
import './Finale.css'

const ease = [0.22, 1, 0.36, 1] as const
const PETAL = 'M0 0C-14-10-18-36 0-52 18-36 14-10 0 0z'

const bloomPetal: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, delay: 0.2 + i * 0.07, ease },
  }),
}

const rise: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, delay: 0.9 + i * 0.25, ease },
  }),
}

/** Bông hoa bung nở khi cuộn tới cuối trang. */
function BloomFlower() {
  const id = useId().replace(/:/g, '')
  const rings = [
    { count: 10, scale: 1, rot: 0, fill: `url(#${id}-outer)` },
    { count: 10, scale: 0.72, rot: 18, fill: `url(#${id}-inner)` },
    { count: 6, scale: 0.42, rot: 0, fill: `url(#${id}-core)` },
  ]
  let order = 0

  return (
    <motion.svg
      className="finale__bloom"
      viewBox="-70 -70 140 140"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <defs>
        <linearGradient id={`${id}-outer`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c23c63" />
          <stop offset="1" stopColor="#ffd3de" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#a12d4f" />
          <stop offset="1" stopColor="#f3aec0" />
        </linearGradient>
        <linearGradient id={`${id}-core`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#a77a35" />
          <stop offset="1" stopColor="#f6e8c8" />
        </linearGradient>
      </defs>
      {rings.map((ring, r) =>
        Array.from({ length: ring.count }, (_, k) => {
          const i = order++
          return (
            <g key={`${r}-${k}`} transform={`rotate(${ring.rot + (360 / ring.count) * k}) scale(${ring.scale})`}>
              <motion.path
                d={PETAL}
                fill={ring.fill}
                stroke="rgba(255,235,240,0.35)"
                strokeWidth="0.6"
                custom={i}
                variants={bloomPetal}
                style={{ originX: 0.5, originY: 1 }}
              />
            </g>
          )
        }),
      )}
      <motion.circle
        r="6"
        fill="#f6e8c8"
        custom={order}
        variants={bloomPetal}
        style={{ filter: 'drop-shadow(0 0 6px rgba(246,232,200,0.9))' }}
      />
    </motion.svg>
  )
}

export default function Finale() {
  return (
    <section className="finale" aria-labelledby="finale-title">
      <Fireworks />
      <div className="finale__aura" aria-hidden="true" />

      <motion.div
        className="finale__content"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <BloomFlower />

        <motion.p className="finale__line" custom={0} variants={rise}>
          {finale.line}
        </motion.p>

        <motion.h2 id="finale-title" className="finale__title" custom={1} variants={rise}>
          <span className="gold-text">{finale.title}</span>
          <span className="finale__heart" aria-hidden="true">
            ♡
          </span>
        </motion.h2>

        <motion.p className="finale__date" custom={2} variants={rise}>
          <span aria-hidden="true" />
          {finale.date}
          <span aria-hidden="true" />
        </motion.p>
      </motion.div>

      <footer className="footer">
        <p>
          {footer.text} <span aria-hidden="true">♡</span> {footer.year}
        </p>
      </footer>
    </section>
  )
}
