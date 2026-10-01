import { useEffect, useRef, useState } from 'react'
import { MUSIC_YOUTUBE_ID, MUSIC_VOLUME } from './config'

// Spiller sangen via innebygd YouTube-spiller (skjult). Nettlesere blokkerer lyd før brukeren
// har klikket, så musikken starter ved første klikk hvor som helst på siden.
export default function Music() {
  const player = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const create = () => {
      player.current = new window.YT.Player('yt-music', {
        videoId: MUSIC_YOUTUBE_ID,
        playerVars: { playsinline: 1, loop: 1, playlist: MUSIC_YOUTUBE_ID, controls: 0 },
        events: {
          onReady: (e) => {
            e.target.setVolume(MUSIC_VOLUME)
            setReady(true)
          },
          onStateChange: (e) => setPlaying(e.data === window.YT.PlayerState.PLAYING),
        },
      })
    }
    if (window.YT?.Player) create()
    else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = create
    }
    return () => player.current?.destroy?.()
  }, [])

  // Start ved første brukerinteraksjon
  useEffect(() => {
    if (!ready) return
    const start = () => {
      player.current.playVideo()
      window.removeEventListener('pointerdown', start)
    }
    window.addEventListener('pointerdown', start)
    return () => window.removeEventListener('pointerdown', start)
  }, [ready])

  const toggle = (e) => {
    e.stopPropagation()
    if (playing) player.current.pauseVideo()
    else player.current.playVideo()
  }

  return (
    <>
      <div className="yt-hidden" aria-hidden="true">
        <div id="yt-music" />
      </div>
      {ready && (
        <button className="music-toggle" onClick={toggle} aria-label={playing ? 'Pause musikk' : 'Spill musikk'}>
          {playing ? '🔊' : '🔇'}
        </button>
      )}
    </>
  )
}
