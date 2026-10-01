import { COLLAGE_IMAGES } from './config'

const TINTS = ['#f9c5d1', '#f4a6b8', '#fbd8c4', '#e8b4d0', '#fce1e8', '#f7b7a3', '#f2a0b5', '#fad0d9']

// Plassering i % av skjermen, størrelse i vmin, og rotasjon (0 = rett)
const LAYOUT = [
  { x: 2, y: 4, s: 34, r: -6 },
  { x: 36, y: 0, s: 26, r: 0 },
  { x: 66, y: 5, s: 32, r: 5 },
  { x: 0, y: 52, s: 28, r: 0 },
  { x: 24, y: 62, s: 34, r: 7 },
  { x: 58, y: 56, s: 30, r: -4 },
  { x: 80, y: 38, s: 26, r: 0 },
  { x: 74, y: 70, s: 28, r: 8 },
]

export default function Collage() {
  return (
    <div className="collage" aria-hidden="true">
      {LAYOUT.map((p, i) => {
        const src = COLLAGE_IMAGES[i]
        return (
          <div
            key={i}
            className="tile"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}vmin`,
              height: `${p.s * 1.2}vmin`,
              transform: `rotate(${p.r}deg)`,
              background: src ? `center 30% / cover url(${src})` : TINTS[i % TINTS.length],
              animationDelay: `${(i % 4) * 0.5}s`,
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
