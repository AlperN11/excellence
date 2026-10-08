import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const out = resolve(root, 'dist-admin')

if (!existsSync(resolve(dist, 'admin.html'))) {
  console.error('admin.html bulunamadı, önce `npm run build` çalıştırın.')
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(resolve(out, 'assets'), { recursive: true })

// Yönetim sayfası sitenin giriş sayfası olacak
writeFileSync(resolve(out, 'index.html'), readFileSync(resolve(dist, 'admin.html'), 'utf8'))

// Ortak dosyalar (JS/CSS/SVG/görseller)
cpSync(resolve(dist, 'assets'), resolve(out, 'assets'), { recursive: true })
for (const f of ['favicon.svg', 'logo.svg', 'logo-white.svg']) {
  if (existsSync(resolve(dist, f))) cpSync(resolve(dist, f), resolve(out, f))
}

// Özel alan adı ve Jekyll engelleyici
writeFileSync(resolve(out, 'CNAME'), 'admin.excellence.tr\n')
writeFileSync(resolve(out, '.nojekyll'), '')

console.log('dist-admin hazır: admin.excellence.tr')
