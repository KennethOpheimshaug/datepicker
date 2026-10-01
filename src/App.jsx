import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

function Question1({ onYes }) {
  const [noCount, setNoCount] = useState(0)
  const [celebrate, setCelebrate] = useState(false)

  const yes = () => {
    setCelebrate(true)
    setTimeout(onYes, 1800)
  }

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
        <motion.button className="btn primary" onClick={yes} animate={{ scale: noCount === 0 ? 1 : noCount === 1 ? 1.5 : 1.8 }}>
          Ja 💕
        </motion.button>
        <AnimatePresence>
          {noCount < 2 && (
            <motion.button
              key="no"
              className="btn ghost"
              onClick={() => setNoCount((n) => n + 1)}
              animate={{ scale: noCount === 0 ? 1 : 0.5 }}
              exit={{ x: 700, y: -500, rotate: 720, opacity: 0, scale: 0.2, transition: { duration: 0.9, ease: 'easeIn' } }}
            >
              Nei
            </motion.button>
          )}
        </AnimatePresence>
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
