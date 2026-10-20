import { motion, AnimatePresence } from 'motion/react'
import { Music, VolumeX } from 'lucide-react'
import './effects.css'

type Props = {
  playing: boolean
  onToggle: () => void
}

export default function MusicToggle({ playing, onToggle }: Props) {
  const label = playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'

  return (
    <motion.button
      type="button"
      className={`music-toggle${playing ? ' is-playing' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={playing}
      title={label}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <span className="music-toggle__ring" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? 'on' : 'off'}
          className="music-toggle__icon"
          initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {playing ? <Music size={18} strokeWidth={1.8} /> : <VolumeX size={18} strokeWidth={1.8} />}
        </motion.span>
      </AnimatePresence>
      <span className="music-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </motion.button>
  )
}
