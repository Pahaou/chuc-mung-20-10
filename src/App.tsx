import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'

import { musicSrc } from './data/content'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import Intro from './components/Intro'
import WishCard from './components/WishCard'
import FlowerGarden from './components/FlowerGarden'
import Finale from './components/Finale'
import PetalField from './components/PetalField'
import TapHearts from './components/TapHearts'
import CursorGlow from './components/CursorGlow'
import MusicToggle from './components/MusicToggle'

export default function App() {
  const [opened, setOpened] = useState(false)
  const music = useBackgroundMusic(musicSrc)

  useEffect(() => {
    document.body.classList.toggle('is-locked', !opened)
    if (opened) window.scrollTo(0, 0)
  }, [opened])

  const handleOpen = useCallback(() => {
    void music.play()
  }, [music.play])

  return (
    <MotionConfig reducedMotion="user">
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop__orb backdrop__orb--a" />
        <div className="backdrop__orb backdrop__orb--b" />
        <div className="backdrop__orb backdrop__orb--c" />
        <div className="grain" />
      </div>

      <PetalField />
      <CursorGlow />
      <TapHearts />
      <MusicToggle playing={music.playing} onToggle={music.toggle} />

      <AnimatePresence>
        {!opened && <Intro key="intro" onOpen={handleOpen} onRevealed={() => setOpened(true)} />}
      </AnimatePresence>

      {opened && (
        <main className="main">
          <WishCard />
          <FlowerGarden />
          <Finale />
        </main>
      )}
    </MotionConfig>
  )
}
