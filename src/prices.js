// Toptan fiyat listesi (sadece yönetimde kullanılır)
export const PRICES = {
  'ozone-therapy': {
    '120x200': { yatak: 9208, baza: 7476, baslik: 8458, set: 25142 },
    '150x200': { yatak: 11510, baza: 9345, baslik: 10150, set: 31005 },
    '160x200': { yatak: 12316, baza: 9345, baslik: 10861, set: 32521 },
    '180x200': { yatak: 13812, baza: 11214, baslik: 12180, set: 37206 },
  },
  bodybalance: {
    '120x200': { yatak: 8240, baza: 7372, baslik: 2813, set: 18425 },
    '150x200': { yatak: 10300, baza: 9215, baslik: 3375, set: 22890 },
    '160x200': { yatak: 11021, baza: 9860, baslik: 3611, set: 24492 },
    '180x200': { yatak: 12360, baza: 11058, baslik: 4050, set: 27468 },
  },
  panthenol: {
    '120x200': { yatak: 8240, baza: 7372, baslik: 3000, set: 18612 },
    '150x200': { yatak: 10300, baza: 9215, baslik: 3600, set: 23115 },
    '160x200': { yatak: 11021, baza: 9860, baslik: 3852, set: 24733 },
    '180x200': { yatak: 12360, baza: 11058, baslik: 4320, set: 27738 },
  },
  lavender: {
    '120x200': { yatak: 9208, baza: 7180, baslik: 2721, set: 19109 },
    '150x200': { yatak: 11510, baza: 8975, baslik: 3265, set: 23750 },
    '160x200': { yatak: 12316, baza: 9603, baslik: 3494, set: 25413 },
    '180x200': { yatak: 13812, baza: 10770, baslik: 3918, set: 28500 },
  },
  'anti-aging': {
    '120x200': { yatak: 9316, baza: 7476, baslik: 3017, set: 19809 },
    '150x200': { yatak: 11645, baza: 9345, baslik: 3620, set: 24610 },
    '160x200': { yatak: 12460, baza: 9999, baslik: 3873, set: 26333 },
    '180x200': { yatak: 13974, baza: 11214, baslik: 4344, set: 29532 },
  },
  manolya: {
    '90x190': { yatak: 4200, baza: 4886, baslik: 1813, set: 10898 },
    '100x200': { yatak: 4900, baza: 5700, baslik: 2071, set: 12671 },
    '120x200': { yatak: 5880, baza: 6840, baslik: 2417, set: 15137 },
    '150x200': { yatak: 7350, baza: 8550, baslik: 2900, set: 18800 },
    '160x200': { yatak: 7865, baza: 9149, baslik: 3103, set: 20116 },
  },
  optimal: {
    '90x190': { yatak: 4200, baza: 4886, baslik: 1584, set: 10670 },
    '100x200': { yatak: 4900, baza: 5700, baslik: 1811, set: 12411 },
    '120x200': { yatak: 5880, baza: 6840, baslik: 2113, set: 14833 },
    '150x200': { yatak: 7350, baza: 8550, baslik: 2535, set: 18435 },
    '160x200': { yatak: 7865, baza: 9149, baslik: 2712, set: 19725 },
  },
}

const GARDEN_PRICES = [
  ['Space Swing', 10750],
  ['Gondol', 19375],
]

function setKey(label) {
  const s = String(label || '').toLocaleLowerCase('tr')
  if (s.includes('yatak') || s.includes('mattress')) return 'yatak'
  if (s.includes('baza') || s.includes('base')) return 'baza'
  if (s.includes('başlık') || s.includes('baslik') || s.includes('headboard')) return 'baslik'
  return 'set'
}

export function priceFor(productId, variant, setLabel) {
  if (String(productId).startsWith('g-')) {
    const name = String(productId).slice(2)
    const f = GARDEN_PRICES.find(([n]) => n === name)
    return f ? f[1] : null
  }
  const table = PRICES[productId]
  if (!table) return null
  const row = table[variant]
  if (!row) return null
  return row[setKey(setLabel)] ?? null
}

export function unitPrice(it) {
  if (!it) return null
  const pid = it.pid || guessId(it.product)
  return priceFor(pid, it.variant, it.set)
}

export function orderSubtotal(order) {
  return (order.items || []).reduce((sum, it) => {
    const unit = unitPrice(it)
    return sum + (unit || 0) * (it.qty || 0)
  }, 0)
}

function guessId(name) {
  const s = String(name || '').toLocaleLowerCase('tr')
  if (s.includes('ozone')) return 'ozone-therapy'
  if (s.includes('bodybalance')) return 'bodybalance'
  if (s.includes('panthenol')) return 'panthenol'
  if (s.includes('lavender')) return 'lavender'
  if (s.includes('anti')) return 'anti-aging'
  if (s.includes('manolya')) return 'manolya'
  if (s.includes('optimal')) return 'optimal'
  if (s.includes('space swing')) return 'g-Space Swing'
  if (s.includes('gondol')) return 'g-Gondol'
  return name
}

export const fmtTL = (n) => '₺' + Number(n || 0).toLocaleString('tr-TR')
export const fmtUSD = (n) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })
