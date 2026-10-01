import { COLLAGE_IMAGES } from './config'

const TINTS = ['#f9c5d1', '#f4a6b8', '#fbd8c4', '#e8b4d0', '#fce1e8', '#f7b7a3']

export default function Collage() {
  return (
    <div className="collage" aria-hidden="true">
      {COLLAGE_IMAGES.map((src, i) => {
        const rot = ((i * 37) % 11) - 5
        return (
          <div
            key={i}
            className="tile"
            style={{
              transform: `rotate(${rot}deg)`,
              background: src ? `center / cover url(${src})` : TINTS[i % TINTS.length],
              animationDelay: `${(i % 6) * 0.4}s`,
            }}
          >
            {!src && <span>♥</span>}
          </div>
        )
      })}
      <div className="collage-veil" />
    </div>
  )
}
