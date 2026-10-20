import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Điều khiển nhạc nền.
 * - Có `src`: phát file audio (lặp lại, tăng âm lượng từ từ).
 * - Không có `src` hoặc file lỗi: phát giai điệu hộp nhạc tạo bằng Web Audio.
 * Chỉ bắt đầu khi được gọi từ một thao tác của người dùng.
 */

type Engine = {
  start: () => Promise<void>
  stop: () => void
  dispose: () => void
}

const midiToFreq = (m: number) => 440 * 2 ** ((m - 69) / 12)

// Vòng hoà âm kiểu Canon: C – G/B – Am – Em/G – F – C/E – F – G
const BARS: { bass: number; arp: number[]; lead: number }[] = [
  { bass: 48, arp: [60, 64, 67, 72], lead: 88 },
  { bass: 47, arp: [59, 62, 67, 71], lead: 86 },
  { bass: 45, arp: [57, 60, 64, 69], lead: 84 },
  { bass: 43, arp: [55, 59, 64, 67], lead: 83 },
  { bass: 41, arp: [53, 57, 60, 65], lead: 81 },
  { bass: 40, arp: [52, 55, 60, 64], lead: 79 },
  { bass: 41, arp: [53, 57, 60, 65], lead: 81 },
  { bass: 43, arp: [55, 59, 62, 67], lead: 83 },
]
const ARP_ORDER = [0, 1, 2, 3, 2, 1, 2, 3]
const BPM = 68
const EIGHTH = 60 / BPM / 2
const MASTER_VOLUME = 0.32

function createSynthEngine(): Engine {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) {
    return { start: async () => {}, stop: () => {}, dispose: () => {} }
  }

  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let bus: GainNode | null = null
  let timer: number | undefined
  let step = 0
  let nextTime = 0
  let active = false

  const build = () => {
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    bus = ctx.createGain()
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 5200
    bus.connect(tone)
    tone.connect(master)

    // Hồi âm tổng hợp: nhiễu trắng tắt dần
    const seconds = 2.8
    const impulse = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2.6
      }
    }
    const reverb = ctx.createConvolver()
    reverb.buffer = impulse
    const wet = ctx.createGain()
    wet.gain.value = 0.42
    tone.connect(reverb)
    reverb.connect(wet)
    wet.connect(master)
  }

  const note = (midi: number, time: number, velocity: number, length: number) => {
    if (!ctx || !bus) return
    const f = midiToFreq(midi)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, time)
    env.gain.linearRampToValueAtTime(velocity, time + 0.006)
    env.gain.exponentialRampToValueAtTime(0.0001, time + length)
    env.connect(bus)

    const body = ctx.createOscillator()
    body.type = 'sine'
    body.frequency.value = f
    body.connect(env)

    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.value = f * 2.003
    shimmerGain.gain.setValueAtTime(0.28, time)
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, time + length * 0.35)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(env)

    body.start(time)
    shimmer.start(time)
    body.stop(time + length + 0.05)
    shimmer.stop(time + length + 0.05)
  }

  const schedule = () => {
    if (!ctx) return
    while (nextTime < ctx.currentTime + 0.35) {
      const bar = BARS[Math.floor(step / 8) % BARS.length]
      const pos = step % 8
      note(bar.arp[ARP_ORDER[pos]], nextTime, pos === 0 ? 0.2 : 0.13, 1.6)
      if (pos === 0) {
        note(bar.bass, nextTime, 0.16, 3.2)
        note(bar.lead, nextTime + 0.02, 0.1, 2.6)
      }
      if (pos === 4 && step % 16 === 12) note(bar.lead - 3, nextTime, 0.07, 1.8)
      nextTime += EIGHTH
      step++
    }
  }

  return {
    async start() {
      if (!ctx) build()
      if (!ctx || !master) return
      active = true
      await ctx.resume()
      nextTime = ctx.currentTime + 0.08
      schedule()
      window.clearInterval(timer)
      timer = window.setInterval(schedule, 90)
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + 1.5)
    },
    stop() {
      if (!ctx || !master) return
      active = false
      window.clearInterval(timer)
      const c = ctx
      master.gain.cancelScheduledValues(c.currentTime)
      master.gain.setValueAtTime(master.gain.value, c.currentTime)
      master.gain.linearRampToValueAtTime(0, c.currentTime + 0.4)
      window.setTimeout(() => {
        if (!active && c.state === 'running') void c.suspend()
      }, 500)
    },
    dispose() {
      window.clearInterval(timer)
      void ctx?.close()
      ctx = null
    },
  }
}

function createFileEngine(src: string, onError: () => void): Engine {
  const audio = new Audio()
  audio.loop = true
  audio.preload = 'none'
  audio.volume = 0
  audio.addEventListener('error', onError, { once: true })
  let fade: number | undefined

  const fadeTo = (target: number, done?: () => void) => {
    window.clearInterval(fade)
    fade = window.setInterval(() => {
      const next = audio.volume + (target > audio.volume ? 0.04 : -0.06)
      if ((target > audio.volume && next >= target) || (target <= audio.volume && next <= target)) {
        audio.volume = target
        window.clearInterval(fade)
        done?.()
      } else {
        audio.volume = Math.min(1, Math.max(0, next))
      }
    }, 50)
  }

  return {
    async start() {
      if (!audio.src) audio.src = src
      await audio.play()
      fadeTo(0.6)
    },
    stop() {
      fadeTo(0, () => audio.pause())
    },
    dispose() {
      window.clearInterval(fade)
      audio.pause()
      audio.removeAttribute('src')
    },
  }
}

export function useBackgroundMusic(src: string | null) {
  const [playing, setPlaying] = useState(false)
  const engineRef = useRef<Engine | null>(null)
  const playingRef = useRef(false)
  const resumeOnVisibleRef = useRef(false)

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = src
        ? createFileEngine(src, () => {
            // File nhạc không dùng được → chuyển sang giai điệu tổng hợp
            const wasPlaying = playingRef.current
            engineRef.current?.dispose()
            engineRef.current = createSynthEngine()
            if (wasPlaying) void engineRef.current.start()
          })
        : createSynthEngine()
    }
    return engineRef.current
  }, [src])

  const play = useCallback(async () => {
    if (playingRef.current) return
    playingRef.current = true
    setPlaying(true)
    try {
      await getEngine().start()
    } catch {
      playingRef.current = false
      setPlaying(false)
    }
  }, [getEngine])

  const pause = useCallback(() => {
    if (!playingRef.current) return
    playingRef.current = false
    setPlaying(false)
    engineRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    if (playingRef.current) pause()
    else void play()
  }, [play, pause])

  // Tạm dừng khi chuyển tab, phát tiếp khi quay lại
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && playingRef.current) {
        resumeOnVisibleRef.current = true
        pause()
      } else if (!document.hidden && resumeOnVisibleRef.current) {
        resumeOnVisibleRef.current = false
        void play()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [play, pause])

  useEffect(
    () => () => {
      engineRef.current?.dispose()
      engineRef.current = null
      playingRef.current = false
    },
    [],
  )

  return { playing, play, toggle }
}
