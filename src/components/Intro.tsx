import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'motion/react'

import { intro } from '../data/content'
import GlowHeart from './GlowHeart'
import './Intro.css'

type Props = {
  onOpen: () => void
  onRevealed: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

const stack: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.35 } },
  leave: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const line: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease } },
  leave: { opacity: 0, y: -18, filter: 'blur(8px)', transition: { duration: 0.5, ease } },
}

const heart: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease } },
  leave: { opacity: 1, scale: 1.35, transition: { duration: 0.9, ease } },
}

// Tách số ngày ra để làm điểm nhấn: "Chúc Mừng Ngày" + "20/10"
const splitAt = intro.title.lastIndexOf(' ')
const titleLead = intro.title.slice(0, splitAt)
const titleAccent = intro.title.slice(splitAt + 1)

export default function Intro({ onOpen, onRevealed }: Props) {
  const [opening, setOpening] = useState(false)
  const [origin, setOrigin] = useState({ x: '50%', y: '40%' })
  const heartRef = useRef<HTMLDivElement>(null)
  const revealedRef = useRef(false)

  const reveal = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    onRevealed()
  }

  const handleOpen = () => {
    if (opening) return
    const rect = heartRef.current?.getBoundingClientRect()
    if (rect) setOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setOpening(true)
    onOpen()
  }

  // Dự phòng: luôn mở nội dung dù animation bị tắt hoặc gián đoạn
  useEffect(() => {
    if (!opening) return
    const t = window.setTimeout(reveal, 2600)
    return () => window.clearTimeout(t)
  }, [opening])

  return (
    <motion.section
      className="intro"
      aria-label="Màn hình mở đầu"
      exit={{ opacity: 0, transition: { duration: 1, ease } }}
    >
      <div className="intro__bg" aria-hidden="true">
        <div className="intro__rays" />
        <div className="intro__vignette" />
        <div className="grain" />
      </div>

      <motion.div
        className="intro__content"
        variants={stack}
        initial="hidden"
        animate={opening ? 'leave' : 'show'}
      >
        <motion.div ref={heartRef} className="intro__heart" variants={heart}>
          <GlowHeart intense={opening} />
        </motion.div>

        <motion.p className="intro__eyebrow" variants={line}>
          {intro.eyebrow}
        </motion.p>

        <motion.h1 className="intro__title" variants={line}>
          <span className="intro__title-lead">{titleLead}</span>
          <span className="intro__title-accent gold-text">{titleAccent}</span>
        </motion.h1>

        <motion.p className="intro__script" variants={line}>
          {intro.script}
        </motion.p>

        <motion.div variants={line} className="intro__action">
          <motion.button
            type="button"
            className="btn-lux intro__button"
            onClick={handleOpen}
            disabled={opening}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {intro.button}
            <span className="btn-lux__heart" aria-hidden="true">
              ♡
            </span>
          </motion.button>
          <span className="intro__note">♪ Nhạc nhẹ sẽ phát khi bạn mở quà</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="intro__bloom"
        aria-hidden="true"
        style={{ left: origin.x, top: origin.y, x: '-50%', y: '-50%' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={opening ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
        onAnimationComplete={() => {
          if (opening) reveal()
        }}
      />
    </motion.section>
  )
}
