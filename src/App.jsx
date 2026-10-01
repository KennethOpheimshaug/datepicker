import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import Collage from './Collage'
import TimeWheel from './TimeWheel'
import Music from './Music'
import { OPTIONS, EMAIL_TO } from './config'

const slide = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.95 },
  transition: { duration: 0.45, ease: 'easeOut' },
}

const todayISO = () => new Date().toLocaleDateString('sv-SE')
const prettyDate = (iso) => {
  const s = new Date(iso + 'T12:00:00').toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const findOpt = (id) => OPTIONS.find((o) => o.id === id)

function Hearts() {
  return (
    <div className="hearts">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          style={{ left: `${(i * 7 + 5) % 100}%`, animationDelay: `${(i % 7) * 0.12}s`, fontSize: `${20 + (i % 4) * 8}px` }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

// «Nei»-knappen som aktivt flytter seg bort fra pekeren
function EvasiveNo() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const dodge = (e) => {
      const el = ref.current
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      if (!el || !vw || !vh) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + 70
      if (dist > reach) return

      const margin = 16
      const step = 180
      const ux = dist < 1 ? 1 : dx / dist
      const uy = dist < 1 ? 0 : dy / dist
      let tx = cx + ux * step
      let ty = cy + uy * step
      const inside = (x, y) =>
        x - r.width / 2 > margin && x + r.width / 2 < vw - margin && y - r.height / 2 > margin && y + r.height / 2 < vh - margin
      if (!inside(tx, ty)) {
        // havnet i et hjørne: hopp til et tilfeldig sted et godt stykke unna pekeren
        for (let i = 0; i < 20; i++) {
          tx = margin + r.width / 2 + Math.random() * (vw - r.width - 2 * margin)
          ty = margin + r.height / 2 + Math.random() * (vh - r.height - 2 * margin)
          if (Math.hypot(tx - e.clientX, ty - e.clientY) > 200) break
        }
      }
      // r er inkludert dagens forskyvning, så trekk den fra for å få målet i x/y
      const to = { type: 'spring', stiffness: 260, damping: 18 }
      animate(x, x.get() + tx - cx, to)
      animate(y, y.get() + ty - cy, to)
    }
    window.addEventListener('pointermove', dodge)
    window.addEventListener('pointerdown', dodge) // berøringsskjerm
    return () => {
      window.removeEventListener('pointermove', dodge)
      window.removeEventListener('pointerdown', dodge)
    }
  }, [])

  return (
    <motion.button
      ref={ref}
      className="btn ghost evasive"
      initial={{ scale: 0.5 }}
      animate={{ scale: 0.5 }}
      style={{ x, y }}
    >
      Nei
    </motion.button>
  )
}

function Question1({ onYes }) {
  const [noCount, setNoCount] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const yesRef = useRef(null)
  const yx = useMotionValue(0)
  const yy = useMotionValue(0)
  const ys = useMotionValue(1)
  const yr = useMotionValue(0)

  const yes = () => {
    setCelebrate(true)
    setTimeout(onYes, 1800)
  }

  useEffect(() => {
    if (noCount === 1) {
      const c = animate(ys, 1.5, { type: 'spring' })
      return () => c.stop()
    }
    if (noCount < 2) return
    // «Ja» vokser 50 % til, rister, flyttes til midten og vokser gradvis til 40 % av skjermen
    let stopped = false
    const running = []
    const run = async () => {
      const el = yesRef.current
      if (!el) return
      await animate(ys, 2.25, { type: 'spring' })
      if (stopped) return
      await animate(yr, [0, -10, 10, -8, 8, -5, 5, 0], { duration: 0.7 })
      if (stopped) return
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight
      const r = el.getBoundingClientRect()
      const baseCx = r.left + r.width / 2 - yx.get()
      const baseCy = r.top + r.height / 2 - yy.get()
      const target = Math.max(2.25, (0.4 * vw) / el.offsetWidth)
      running.push(
        animate(yx, vw / 2 - baseCx, { duration: 1.2, ease: 'easeInOut' }),
        animate(yy, vh / 2 - baseCy, { duration: 1.2, ease: 'easeInOut' }),
        animate(ys, target, { duration: 5, ease: 'easeOut' }),
      )
    }
    run()
    return () => {
      stopped = true
      running.forEach((c) => c.stop())
    }
  }, [noCount, ys, yr, yx, yy])

  if (celebrate)
    return (
      <motion.div className="center" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <Hearts />
        <h1 className="script big">Flott, så bra! 💖</h1>
      </motion.div>
    )

  return (
    <>
      <h1 className="script">Vil du gå på date med meg?</h1>
      <div className="buttons yesno">
        <motion.button ref={yesRef} className="btn primary yes" onClick={yes} style={{ x: yx, y: yy, scale: ys, rotate: yr }}>
          Ja 💕
        </motion.button>
        {noCount < 2 ? (
          <motion.button className="btn ghost" onClick={() => setNoCount((n) => n + 1)} animate={{ scale: noCount === 0 ? 1 : 0.5 }}>
            Nei
          </motion.button>
        ) : (
          <EvasiveNo />
        )}
      </div>
      {noCount === 1 && <p className="hint">Er du helt sikker? 🥺</p>}
    </>
  )
}

function Question2({ onPick }) {
  return (
    <>
      <h1 className="script">Hva har du lyst til?</h1>
      <div className="options">
        {OPTIONS.map((o, i) => (
          <motion.button
            key={o.id}
            className="option"
            onClick={() => onPick(o.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="emoji">{o.emoji}</span>
            <span>
              {o.label}
              {o.hint && <small> ({o.hint})</small>}
            </span>
          </motion.button>
        ))}
      </div>
    </>
  )
}

function DateTimeFields({ day, time, setDay, setTime }) {
  return (
    <div className="datetime">
      <label className="field">
        <span>Dato</span>
        <input type="date" value={day} min={todayISO()} onChange={(e) => setDay(e.target.value)} />
      </label>
      <div className="field">
        <span>Klokkeslett</span>
        <TimeWheel value={time} onChange={setTime} />
      </div>
    </div>
  )
}

function Question3({ choice, onDone }) {
  const [day, setDay] = useState(todayISO())
  const [time, setTime] = useState('18:00')
  return (
    <>
      <h1 className="script">Når er du ledig for {findOpt(choice).phrase}?</h1>
      <DateTimeFields {...{ day, time, setDay, setTime }} />
      <button className="btn primary" disabled={!day} onClick={() => onDone(day, time)}>
        Videre →
      </button>
    </>
  )
}

function Summary({ a }) {
  const o = findOpt(a.choice)
  return (
    <div className="summary">
      <div><b>{o.emoji} {o.label}</b></div>
      <div>📅 {prettyDate(a.day)}</div>
      <div>🕒 kl. {a.time}</div>
    </div>
  )
}

function EditModal({ a, onSave, onClose }) {
  const [choice, setChoice] = useState(a.choice)
  const [day, setDay] = useState(a.day)
  const [time, setTime] = useState(a.time)
  return (
    <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal"
        initial={{ y: 60, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="script">Endre valgene dine</h2>
        <div className="chips">
          {OPTIONS.map((o) => (
            <button key={o.id} className={'chip' + (o.id === choice ? ' on' : '')} onClick={() => setChoice(o.id)}>
              {o.emoji} {o.label}
            </button>
          ))}
        </div>
        <DateTimeFields {...{ day, time, setDay, setTime }} />
        <div className="buttons">
          <button className="btn ghost" onClick={onClose}>Avbryt</button>
          <button className="btn primary" disabled={!day} onClick={() => onSave({ choice, day, time })}>Lagre</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Question4({ a, setA, onConfirm, status }) {
  const [editing, setEditing] = useState(false)
  return (
    <>
      <h1 className="script">Ser dette riktig ut?</h1>
      <Summary a={a} />
      <div className="buttons">
        <button className="btn primary" onClick={onConfirm} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sender…' : 'Ja!'}
        </button>
        <button className="btn ghost" onClick={() => setEditing(true)} disabled={status === 'sending'}>
          Nei, jeg vil endre noe
        </button>
      </div>
      {status === 'error' && <p className="hint">Oi, noe gikk galt med sendingen. Prøv igjen 🙈</p>}
      <AnimatePresence>
        {editing && (
          <EditModal
            a={a}
            onClose={() => setEditing(false)}
            onSave={(n) => {
              setA(n)
              setEditing(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function Done({ a }) {
  return (
    <div className="center">
      <Hearts />
      <h1 className="script big">Det blir fint! 💌</h1>
      <Summary a={a} />
      <p className="hint">Svaret ditt er sendt – gleder meg!</p>
    </div>
  )
}

async function sendEmail(a) {
  const o = findOpt(a.choice)
  const res = await fetch(`https://formsubmit.co/ajax/${EMAIL_TO}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: 'Hun sa ja til date! 💕',
      _captcha: 'false',
      _template: 'table',
      Aktivitet: o.label,
      Dato: prettyDate(a.day),
      Klokkeslett: a.time,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === 'false') throw new Error('send failed')
}

export default function App() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState({ choice: null, day: '', time: '18:00' })
  const [status, setStatus] = useState('idle')

  const confirm = async () => {
    setStatus('sending')
    try {
      await sendEmail(a)
      setStatus('idle')
      setStep(4)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Collage />
      <Music />
      <main className="stage">
        <AnimatePresence mode="wait">
          <motion.section key={step} className="card" {...slide}>
            {step === 0 && <Question1 onYes={() => setStep(1)} />}
            {step === 1 && (
              <Question2
                onPick={(choice) => {
                  setA((p) => ({ ...p, choice }))
                  setStep(2)
                }}
              />
            )}
            {step === 2 && (
              <Question3
                choice={a.choice}
                onDone={(day, time) => {
                  setA((p) => ({ ...p, day, time }))
                  setStep(3)
                }}
              />
            )}
            {step === 3 && <Question4 a={a} setA={setA} onConfirm={confirm} status={status} />}
            {step === 4 && <Done a={a} />}
          </motion.section>
        </AnimatePresence>
      </main>
    </>
  )
}
