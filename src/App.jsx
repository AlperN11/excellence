import { useState, useEffect } from 'react'
import { products, technologies, fabrics, conceptFeatures, conceptProducts, contact } from './data.js'

function Logo({ light }) {
  return (
    <a href="#top" className={`logo ${light ? 'logo--light' : ''}`}>
      <img className="logo__img" src={light ? '/logo-white.svg' : '/logo.svg'} alt="Excellence Bedding" />
    </a>
  )
}

const nav = [
  ['#hakkimizda', 'Hakkımızda'],
  ['#teknoloji', 'Teknoloji'],
  ['#urunler', 'Koleksiyon'],
  ['#konsept', 'Garden Concept'],
  ['#iletisim', 'İletişim'],
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`header ${scrolled ? 'header--solid' : ''}`}>
      <div className="header__inner">
        <Logo light={!scrolled} />
        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {nav.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <button className="burger" aria-label="Menü" onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero">
      <img className="hero__bg" src="/assets/hero-feather.jpeg" alt="" />
      <div className="hero__scrim" />
      <div className="hero__content">
        <h1 className="hero__title">Sağlıklı uykunun<br /><em>zarafetle</em> buluştuğu yer</h1>
        <p className="hero__lead">
          30 yıllık tecrübe, kesintisiz Ar-Ge ve hijyeni ön planda tutan tasarım anlayışıyla
          Excellence Bedding; en konforlu uyku deneyimini yaşam alanlarınıza taşıyor.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#urunler">Koleksiyonu Keşfet</a>
          <a className="btn btn--ghost" href="#teknoloji">Uyku Teknolojileri</a>
        </div>
      </div>
    </section>
  )
}

function About() {
  const stats = [
    ['30+', 'Yıllık Tecrübe'],
    ['7', 'Yatak Koleksiyonu'],
    ['2', 'Üretim & Merkez'],
    ['∞', 'Kesintisiz Ar-Ge'],
  ]
  return (
    <section id="hakkimizda" className="about section">
        <div className="about__text">
          <p className="kicker">Hakkımızda</p>
          <h2>Teknolojiyi ve <em>doğal konforu</em> aynı yatakta buluşturuyoruz</h2>
          <p>
            Excellence Bedding olarak, 30+ yıllık tecrübemiz ve ürün kalitemizle sizlere en iyi hizmeti
            sunmaktan gurur duyuyoruz. Müşterilerimize daha kaliteli ürünler sağlamak adına teknolojiyi
            her zaman yakından takip ediyor, Ar-Ge çalışmalarımıza kesintisiz devam ediyor ve sürekli yenileniyoruz.
          </p>
          <p>
            Yataklarımızı tasarlarken hijyen ve konforu ön planda tutuyoruz. Amacımız; sizlere sağlıklı ve
            en konforlu uyku deneyiminin yanı sıra, yaşam alanlarınız için estetik ve rahat çözümler sunmaktır.
          </p>
          <div className="about__stats">
            {stats.map(([n, l]) => (
              <div key={l} className="stat">
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}

function Fabrics() {
  return (
    <section className="fabrics section">
      <div className="section__head">
        <p className="kicker">Kumaş Teknolojileri</p>
        <h2>Teninizle uyum içinde</h2>
      </div>
      <div className="fabrics__grid">
        {fabrics.map((f) => (
          <article key={f.title} className="fabric-card">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Tech() {
  return (
    <section id="teknoloji" className="tech tech--photo section section--dark">
      <img className="tech__bg" src="/assets/products/lavender/4.jpg" alt="" />
      <div className="tech__scrim" />
      <div className="tech__inner">
        <div className="section__head section__head--light">
          <p className="kicker">Uyku Teknolojileri</p>
          <h2>Konforun mühendisliği</h2>
          <p className="section__sub">
            Modern uyku deneyiminin kalbinde, her noktanıza eşsiz destek sunan yay ve sünger sistemleri yer alır.
          </p>
        </div>
        <div className="tech__grid">
          {technologies.map((t, i) => (
            <article key={t.id} className="tech-card tech-card--photo">
              <img className="tech-card__icon" src={t.icon} alt="" loading="lazy" />
              <div className="tech-card__text">
                <span className="tech-card__no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Firmness({ level }) {
  return (
    <div className="firmness">
      <span className="firmness__label">Yumuşak</span>
      <div className="firmness__dots">
        {[5, 4, 3, 2, 1].map((n) => (
          <span key={n} className={`fdot ${n === level ? 'fdot--on' : ''}`} />
        ))}
      </div>
      <span className="firmness__label">Sert</span>
    </div>
  )
}

function ProductCard({ p, onOpen }) {
  return (
    <button className="pcard" style={{ '--accent': p.accent }} onClick={() => onOpen(p)}>
      <div className="pcard__img">
        <img src={p.img} alt={p.name} loading="lazy" />
        <span className="pcard__spring">{p.spring}</span>
      </div>
      <div className="pcard__body">
        <h3>{p.name}</h3>
        <p className="pcard__tag">{p.tagline}</p>
        <span className="pcard__more">Detayları gör →</span>
      </div>
    </button>
  )
}

function ProductModal({ p, onClose }) {
  const [sel, setSel] = useState(0)
  useEffect(() => {
    if (!p) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [p, onClose])
  useEffect(() => { setSel(0) }, [p?.id])
  if (!p) return null
  const gallery = p.gallery?.length ? p.gallery : [p.cut].filter(Boolean)
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" style={{ '--accent': p.accent }} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Kapat">×</button>
        <div className="modal__media">
          <img className="gallery__main" src={gallery[sel] ?? gallery[0]} alt={`${p.name} fotoğraf ${sel + 1}`} />
          {gallery.length > 1 && (
            <div className="gallery__thumbs">
              {gallery.map((g, i) => (
                <button key={g} className={`gthumb ${i === sel ? 'gthumb--on' : ''}`} onClick={() => setSel(i)} aria-label={`${p.name} fotoğraf ${i + 1}`}>
                  <img src={g} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="modal__info">
          <p className="kicker">{p.spring}</p>
          <h3>{p.name}</h3>
          <p className="modal__tagline">{p.tagline}</p>
          <p className="modal__desc">{p.desc}</p>

          <Firmness level={p.firmness} />

          <div className="specs">
            <div><span>Yatak Yüksekliği</span><strong>{p.heights.yatak}</strong></div>
            <div><span>Baza / Ayak</span><strong>{p.heights.baza} / {p.heights.ayak}</strong></div>
          </div>

          <div className="modal__block">
            <span className="modal__blocklabel">Üretim Boyutları</span>
            <div className="chips">
              {p.sizes.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Products() {
  const [active, setActive] = useState(null)
  return (
    <section id="urunler" className="products section">
      <div className="section__head">
        <p className="kicker">Koleksiyon</p>
        <h2>Yatak Serisi</h2>
        <p className="section__sub">
          Her biri belirli bir ihtiyaç için tasarlanmış yedi imza yatak. Kartlara dokunarak teknik
          detayları ve boyutları inceleyin.
        </p>
      </div>
      <div className="products__grid">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} onOpen={setActive} />
        ))}
      </div>
      <ProductModal p={active} onClose={() => setActive(null)} />
    </section>
  )
}

function ConceptModal({ c, onClose }) {
  useEffect(() => {
    if (!c) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [c, onClose])
  if (!c) return null
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Kapat">×</button>
        <div className="modal__media">
          <img className="gallery__main" src={c.img} alt={c.name} />
        </div>
        <div className="modal__info modal__info--concept">
          <p className="kicker">Garden Concept</p>
          <h3>{c.name}</h3>
          <p className="modal__desc">{c.text}</p>
          <div className="modal__block">
            <span className="modal__blocklabel">Renk Seçenekleri</span>
            <div className="chips">
              {c.colors.map((col) => <span key={col} className="chip chip--soft">{col}</span>)}
            </div>
          </div>
          <div className="modal__block">
            <span className="modal__blocklabel">Özellikler</span>
            <ul className="concept__features concept__features--modal">
              {conceptFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Concept() {
  const [active, setActive] = useState(null)
  return (
    <section id="konsept" className="concept section--dark">
      <div className="concept__inner">
        <div className="concept__intro">
          <p className="kicker">Garden Concept</p>
          <h2>Konfor, dış mekâna taşınıyor</h2>
          <p className="section__sub">
            Metal gövdeli dış mekân koleksiyonu; dayanıklılığı ve konforu her mevsim bir arada sunar.
          </p>
          <ul className="concept__features">
            {conceptFeatures.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="concept__grid">
          {conceptProducts.map((c) => (
            <button key={c.name} className="ccard ccard--btn" onClick={() => setActive(c)}>
              <div className="ccard__img"><img src={c.img} alt={c.name} loading="lazy" /></div>
              <div className="ccard__body">
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <div className="chips">
                  {c.colors.map((col) => <span key={col} className="chip chip--soft">{col}</span>)}
                </div>
                <span className="ccard__more">Büyüt →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ConceptModal c={active} onClose={() => setActive(null)} />
    </section>
  )
}

function CTA() {
  return (
    <section className="cta">
      <img className="cta__bg" src="/assets/products/lavender/1.jpg" alt="" />
      <div className="cta__scrim" />
      <div className="cta__content">
        <h2>Kaliteli uyku bir tercih değil,<br /><em>bir yatırımdır.</em></h2>
        <a className="btn btn--primary" href="#iletisim">Bize Ulaşın</a>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer id="iletisim" className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__muted">
            Excellence Bedding Ürün özellikleri, fiyatları ve diğer bilgiler önceden bildirilmeksizin değiştirilebilir.
          </p>
        </div>
        <div className="footer__cols">
          {contact.offices.map((o) => (
            <div key={o.city} className="footer__col">
              <h4>{o.city}</h4>
              <p>{o.address.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
            </div>
          ))}
          <div className="footer__col">
            <h4>İLETİŞİM</h4>
            {contact.phones.map((ph) => (
              <p key={ph.no}>{ph.label}:<br /><a href={`tel:${ph.no.replace(/[^+\d]/g, '')}`}>{ph.no}</a></p>
            ))}
            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            <p><a href={`https://${contact.web}`} target="_blank" rel="noreferrer">{contact.web}</a></p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Excellence Bedding. Tüm hakları saklıdır.</span>
        <span>Sağlıklı ve konforlu uyku için tasarlandı.</span>
      </div>
    </footer>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section__head, .pcard, .fabric-card, .tech-card, .ccard, .stat, .about__media, .about__text')
    els.forEach((el) => el.classList.add('reveal'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  useReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Fabrics />
        <Tech />
        <Products />
        <Concept />
        <CTA />
      </main>
      <Contact />
    </>
  )
}
