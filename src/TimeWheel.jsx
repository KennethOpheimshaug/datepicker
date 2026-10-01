import { useEffect, useRef } from 'react'

const ITEM = 44
const pad = (n) => String(n).padStart(2, '0')

function Wheel({ values, value, onChange, label }) {
  const ref = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const el = ref.current
    const idx = values.indexOf(value)
    if (el && idx >= 0 && Math.abs(el.scrollTop - idx * ITEM) > 1) el.scrollTop = idx * ITEM
  }, [value, values])

  const onScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const idx = Math.round(ref.current.scrollTop / ITEM)
      const v = values[Math.min(values.length - 1, Math.max(0, idx))]
      if (v !== value) onChange(v)
    }, 90)
  }

  return (
    <div className="wheel" ref={ref} onScroll={onScroll} role="listbox" aria-label={label} tabIndex={0}>
      <div style={{ height: ITEM }} />
      {values.map((v) => (
        <div
          key={v}
          className={'wheel-item' + (v === value ? ' active' : '')}
          onClick={() => {
            ref.current.scrollTo({ top: values.indexOf(v) * ITEM, behavior: 'smooth' })
            onChange(v)
          }}
        >
          {pad(v)}
        </div>
      ))}
      <div style={{ height: ITEM }} />
    </div>
  )
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

// value: "HH:MM"
export default function TimeWheel({ value, onChange }) {
  const [h, m] = value.split(':').map(Number)
  return (
    <div className="time-wheel">
      <div className="wheel-highlight" />
      <Wheel values={HOURS} value={h} label="Time" onChange={(v) => onChange(`${pad(v)}:${pad(m)}`)} />
      <span className="colon">:</span>
      <Wheel values={MINUTES} value={m} label="Minutt" onChange={(v) => onChange(`${pad(h)}:${pad(v)}`)} />
    </div>
  )
}
