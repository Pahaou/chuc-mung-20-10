import { useId } from 'react'
import { motion, type Variants } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { wish } from '../data/content'
import './WishCard.css'

const ease = [0.22, 1, 0.36, 1] as const

const reveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease } },
}

const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.5 } } as const

function CornerOrnament({ className }: { className: string }) {
  const id = useId().replace(/:/g, '')
  const gold = `url(#${id})`
  const leaf = 'M0 0C5-6 15-7 22-2 15 3 6 4 0 0z'

  return (
    <svg className={`wish__corner ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#a77a35" />
          <stop offset="0.5" stopColor="#ecd5a2" />
          <stop offset="1" stopColor="#c39a52" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={gold} strokeWidth="1.1" strokeLinecap="round">
        <path d="M8 112C28 92 46 76 60 54 72 34 90 18 112 10" />
        <path d="M34 88c-6-10-6-20 0-28M52 66c8-4 18-4 26 2M76 34c-2-10 0-18 6-24" />
        <circle cx="60" cy="54" r="7" />
        <path d="M56 54c0-3 6-4 7-1 1 3-3 4-4 2" />
        <path d="M53 51c-4 6 0 13 7 13s11-6 8-12" />
      </g>
      <g fill={gold} opacity="0.85">
        <path d={leaf} transform="translate(22 98) rotate(-60)" />
        <path d={leaf} transform="translate(24 96) rotate(10)" />
        <path d={leaf} transform="translate(44 76) rotate(-70)" />
        <path d={leaf} transform="translate(86 26) rotate(-20)" />
        <path d={leaf} transform="translate(96 18) rotate(-80)" />
        <circle cx="112" cy="10" r="2.2" />
        <circle cx="34" cy="60" r="1.6" />
        <circle cx="78" cy="68" r="1.6" />
      </g>
    </svg>
  )
}

export default function WishCard() {
  return (
    <section className="section wish" aria-labelledby="wish-title">
      <motion.header className="section-heading" {...inView} variants={reveal}>
        <span className="eyebrow">{wish.eyebrow}</span>
        <h2 id="wish-title" className="display-title">
          {wish.title}
        </h2>
      </motion.header>

      <motion.article
        className="wish__card"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease }}
      >
        <div className="wish__paper">
          <span className="wish__seal" aria-hidden="true">
            <svg viewBox="0 0 100 90">
              <path d="M50 86C22 66 4 50 4 28 4 14 15 4 28 4c10 0 18 5 22 13 4-8 12-13 22-13 13 0 24 10 24 24 0 22-18 38-46 58z" />
            </svg>
          </span>

          <CornerOrnament className="wish__corner--tl" />
          <CornerOrnament className="wish__corner--br" />

          <div className="wish__body">
            <motion.p className="wish__greeting" {...inView} variants={reveal}>
              {wish.greeting}
            </motion.p>

            {wish.paragraphs.map((text, i) => (
              <motion.p key={i} className="wish__text" {...inView} variants={reveal}>
                {text}
              </motion.p>
            ))}

            <motion.div className="wish__sign" {...inView} variants={reveal}>
              <span className="wish__divider" aria-hidden="true" />
              <p className="wish__signature">{wish.signature}</p>
              <p className="wish__sender">— {wish.sender} —</p>
            </motion.div>
          </div>
        </div>
      </motion.article>

      <motion.a
        href="#garden"
        className="scroll-cue"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <span>Còn nữa</span>
        <ChevronDown size={18} strokeWidth={1.5} />
      </motion.a>
    </section>
  )
}
