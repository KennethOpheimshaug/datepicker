// E-posten som får svarene (sendes via FormSubmit.co – ingen backend nødvendig)
export const EMAIL_TO = 'kennetholsen87@gmail.com'

// Bildene ligger i public/images (nedskalert fra originalene i /bilder).
// Rekkefølgen følger plasseringene i LAYOUT i Collage.jsx. Null = rosa placeholder.
const img = (n) => `${import.meta.env.BASE_URL}images/${n}.jpg`
export const COLLAGE_IMAGES = [1, 7, 4, 2, 8, 3, 5, 6].map(img)

export const OPTIONS = [
  { id: 'kino', emoji: '🎬', label: 'Kino', phrase: 'kino' },
  { id: 'middag', emoji: '🍝', label: 'Middag', phrase: 'middag' },
  { id: 'aktivitet', emoji: '🎳', label: 'Aktivitet', hint: 'bowling, museum, minigolf', phrase: 'en aktivitet' },
  { id: 'puslespill', emoji: '🕯️', label: 'Puslespill hjemme med levende lys', phrase: 'puslespill hjemme' },
]

// Christina Perri – A Thousand Years (offisiell musikkvideo på YouTube)
export const MUSIC_YOUTUBE_ID = 'rtOvBOTyX00'

// Volum 0-100 (YouTube-standard er 100)
export const MUSIC_VOLUME = 40
