// E-posten som får svarene (sendes via FormSubmit.co – ingen backend nødvendig)
export const EMAIL_TO = 'kennetholsen87@gmail.com'

// Bytt ut disse med egne bilder: legg filene i /public/images og skriv f.eks. '/images/1.jpg'
// (på GitHub Pages: bruk 'images/1.jpg' uten ledende skråstrek).
// Er et felt null vises en myk fargeflate med hjerte som placeholder.
export const COLLAGE_IMAGES = Array.from({ length: 48 }, () => null)

export const OPTIONS = [
  { id: 'kino', emoji: '🎬', label: 'Kino', phrase: 'kino' },
  { id: 'middag', emoji: '🍝', label: 'Middag', phrase: 'middag' },
  { id: 'aktivitet', emoji: '🎳', label: 'Aktivitet', hint: 'bowling, museum, minigolf', phrase: 'en aktivitet' },
  { id: 'puslespill', emoji: '🕯️', label: 'Puslespill hjemme med levende lys', phrase: 'puslespill hjemme' },
]
