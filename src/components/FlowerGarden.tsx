import { useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

import { garden } from '../data/content'
import { burstHearts } from './TapHearts'
import './FlowerGarden.css'

const ease = [0.22, 1, 0.36, 1] as const

const centerOf = (el: Element) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

export default function FlowerGarden() {
  const [active, setActive] = useState<number | null>(null)
  const [sent, setSent] = useState(0)

  const pick = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    setActive(i)
    const { x, y } = centerOf(e.currentTarget)
    burstHearts(x, y - 40, 6)
  }

  const sendLove = (e: MouseEvent<HTMLButtonElement>) => {
    const { x, y } = centerOf(e.currentTarget)
    burstHearts(x, y, 16)
    setSent((n) => n + 1)
  }

  const current = active === null ? null : garden.flowers[active]

  return (
    <section id="garden" className="section garden" aria-labelledby="garden-title">
      <motion.header
        className="section-heading"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease }}
      >
        <span className="eyebrow">{garden.eyebrow}</span>
        <h2 id="garden-title" className="display-title">
          {garden.title}
        </h2>
      </motion.header>

      <div className="garden__row">
        {garden.flowers.map((flower, i) => {
          const isActive = active === i
          return (
            <motion.button
              key={flower.kind}
              type="button"
              className={`garden__item${isActive ? ' is-active' : ''}`}
              onClick={(e) => pick(i, e)}
              aria-pressed={isActive}
              aria-label={`${flower.name}: ${flower.message}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: i * 0.15, ease }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="garden__arch">
                <img
                  className="garden__photo"
                  src={flower.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: flower.focus }}
                />
              </span>
              <span className="garden__name">{flower.name}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="garden__message" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={current?.kind ?? 'hint'}
            className={current ? 'garden__quote' : 'garden__hint'}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease }}
          >
            {current ? `“${current.message}”` : garden.hint}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        className="garden__action"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.button
          type="button"
          className="btn-lux"
          onClick={sendLove}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <Sparkles size={17} strokeWidth={1.6} aria-hidden="true" />
          {garden.button}
          <span className="btn-lux__heart" aria-hidden="true">
            ♡
          </span>
        </motion.button>
        {sent > 0 && (
          <motion.span
            key={sent}
            className="garden__count"
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease }}
          >
            Đã gửi {sent} lần yêu thương ♡
          </motion.span>
        )}
      </motion.div>
    </section>
  )
}
