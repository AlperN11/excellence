import { useState, useEffect } from 'react'
import { content, LANG_KEY } from './content.js'

function Logo({ light }) {
  return (
    <a href="#top" className={`logo ${light ? 'logo--light' : ''}`}>
      <img className="logo__img" src={light ? '/logo-white.svg' : '/logo.svg'} alt="Excellence Bedding" />
    </a>
  )
}

function Header({ nav, menuLabel, lang, onLang }) {
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
        <div className="langswitch" role="group" aria-label="Language">
          <button className={lang === 'tr' ? 'on' : ''} onClick={() => onLang('tr')}>TR</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => onLang('en')}>EN</button>
        </div>
        <button className="burger" aria-label={menuLabel} onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

function Hero({ t }) {
  return (
    <section id="top" className="hero">
      <img className="hero__bg" src="/assets/hero-feather.jpeg" alt="" />
      <div className="hero__scrim" />
      <div className="hero__content">
        <h1 className="hero__title">{t.titleA}<br /><em>{t.titleEm}</em>{t.titleB ? ` ${t.titleB}` : ''}</h1>
        <p className="hero__lead">{t.lead}</p>
        <div className="hero__cta">
          <a className="btn btn--ghost" href="#urunler">{t.primary}</a>
          <a className="btn btn--primary" href="#konsept">{t.ghost}</a>
        </div>
      </div>
    </section>
  )
}

function About({ t }) {
  return (
    <section id="hakkimizda" className="about section">
        <div className="about__text">
          <p className="kicker">{t.kicker}</p>
          <h2>{t.titleA}<em>{t.titleEm}</em>{t.titleB}</h2>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <div className="about__stats">
            {t.stats.map(([n, l]) => (
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

function Fabrics({ t }) {
  return (
    <section id="teknoloji" className="fabrics section">
      <div className="section__head">
        <p className="kicker">{t.kicker}</p>
        <h2>{t.title}</h2>
      </div>
      <div className="fabrics__grid">
        {t.items.map((f) => (
          <article key={f.title} className="fabric-card">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Firmness({ level, soft, hard }) {
  return (
    <div className="firmness">
      <span className="firmness__label">{soft}</span>
      <div className="firmness__dots">
        {[5, 4, 3, 2, 1].map((n) => (
          <span key={n} className={`fdot ${n === level ? 'fdot--on' : ''}`} />
        ))}
      </div>
      <span className="firmness__label">{hard}</span>
    </div>
  )
}

function ProductCard({ p, details, onOpen }) {
  return (
    <button className="pcard" style={{ '--accent': p.accent }} onClick={() => onOpen(p)}>
      <div className="pcard__img">
        <img src={p.img} alt={p.name} loading="lazy" />
        <span className="pcard__spring">{p.spring}</span>
      </div>
      <div className="pcard__body">
        <h3>{p.name}</h3>
        <p className="pcard__tag">{p.tagline}</p>
        <span className="pcard__more">{details}</span>
      </div>
    </button>
  )
}

function ProductModal({ p, ui, onClose }) {
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
  const gallery = p.gallery?.length ? p.gallery : [p.img].filter(Boolean)
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" style={{ '--accent': p.accent }} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label={ui.close}>×</button>
        <div className="modal__media">
          <img className="gallery__main" src={gallery[sel] ?? gallery[0]} alt={`${p.name} ${ui.photo} ${sel + 1}`} />
          {gallery.length > 1 && (
            <div className="gallery__thumbs">
              {gallery.map((g, i) => (
                <button key={g} className={`gthumb ${i === sel ? 'gthumb--on' : ''}`} onClick={() => setSel(i)} aria-label={`${p.name} ${ui.photo} ${i + 1}`}>
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

          <Firmness level={p.firmness} soft={ui.soft} hard={ui.firm} />

          <div className="specs">
            {p.heights.map((h) => (
              <div key={h.label}><span>{h.label}</span><strong>{h.value}</strong></div>
            ))}
          </div>

          <div className="modal__block">
            <span className="modal__blocklabel">{ui.sizes}</span>
            <div className="chips">
              {p.sizes.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Products({ t, ui }) {
  const [active, setActive] = useState(null)
  return (
    <section id="urunler" className="products section">
      <div className="section__head">
        <p className="kicker">{t.kicker}</p>
        <h2>{t.title}</h2>
        <p className="section__sub">{t.sub}</p>
      </div>
      <div className="products__grid">
        {t.items.map((p) => (
          <ProductCard key={p.id} p={p} details={ui.details} onOpen={setActive} />
        ))}
      </div>
      <ProductModal p={active} ui={ui} onClose={() => setActive(null)} />
    </section>
  )
}

function ConceptModal({ c, t, ui, onClose }) {
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
        <button className="modal__close" onClick={onClose} aria-label={ui.close}>×</button>
        <div className="modal__media">
          <img className="gallery__main" src={c.img} alt={c.name} />
        </div>
        <div className="modal__info modal__info--concept">
          <p className="kicker">{t.kicker}</p>
          <h3>{c.name}</h3>
          <p className="modal__desc">{c.text}</p>
          <div className="modal__block">
            <span className="modal__blocklabel">{ui.colors}</span>
            <div className="chips">
              {c.colors.map((col) => <span key={col} className="chip chip--soft">{col}</span>)}
            </div>
          </div>
          <div className="modal__block">
            <span className="modal__blocklabel">{ui.features}</span>
            <ul className="concept__features concept__features--modal">
              {t.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Concept({ t, ui }) {
  const [active, setActive] = useState(null)
  return (
    <section id="konsept" className="concept section--dark">
      <div className="concept__inner">
        <div className="concept__intro">
          <p className="kicker">{t.kicker}</p>
          <h2>{t.title}</h2>
          <p className="section__sub">{t.sub}</p>
          <ul className="concept__features">
            {t.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="concept__grid">
          {t.items.map((c) => (
            <button key={c.name} className="ccard ccard--btn" onClick={() => setActive(c)}>
              <div className="ccard__img"><img src={c.img} alt={c.name} loading="lazy" /></div>
              <div className="ccard__body">
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <div className="chips">
                  {c.colors.map((col) => <span key={col} className="chip chip--soft">{col}</span>)}
                </div>
                <span className="ccard__more">{ui.enlarge}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ConceptModal c={active} t={t} ui={ui} onClose={() => setActive(null)} />
    </section>
  )
}

function CTA({ t }) {
  return (
    <section className="cta">
      <img className="cta__bg" src="/assets/products/lavender/1.jpg" alt="" />
      <div className="cta__scrim" />
      <div className="cta__content">
        <h2>{t.titleA}<br /><em>{t.titleEm}</em></h2>
        <a className="btn btn--primary" href="#iletisim">{t.button}</a>
      </div>
    </section>
  )
}

function Contact({ t }) {
  return (
    <footer id="iletisim" className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__muted">{t.info}</p>
        </div>
        <div className="footer__cols">
          {t.offices.map((o) => (
            <div key={o.city} className="footer__col">
              <h4>{o.city}</h4>
              <p>{o.address.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
            </div>
          ))}
          <div className="footer__col">
            <h4>{t.contactTitle}</h4>
            {t.phones.map((ph) => (
              <p key={ph.no}>{ph.label}:<br /><a href={`tel:${ph.no.replace(/[^+\d]/g, '')}`}>{ph.no}</a></p>
            ))}
            <p><a href={`mailto:${t.email}`}>{t.email}</a></p>
            <p><a href={`https://${t.web}`} target="_blank" rel="noreferrer">{t.web}</a></p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} {t.rightsA}</span>
        <span>{t.rightsB}</span>
      </div>
    </footer>
  )
}

function LangModal({ ui, onChoose }) {
  return (
    <div className="modal">
      <div className="langmodal__panel">
        <h3>{ui.chooseTitle}</h3>
        <p>{ui.chooseSub}</p>
        <div className="langmodal__btns">
          <button className="btn btn--primary" onClick={() => onChoose('tr')}>Türkçe</button>
          <button className="btn btn--ghost btn--dark" onClick={() => onChoose('en')}>English</button>
        </div>
      </div>
    </div>
  )
}

function useSmoothAnchors() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id.length < 2) return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      const top = el.getBoundingClientRect().top + window.scrollY - 70
      if (reduce) { window.scrollTo(0, top); return }
      const start = window.scrollY
      const dist = top - start
      const dur = 900
      let t0 = null
      const step = (ts) => {
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / dur, 1)
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        window.scrollTo(0, start + dist * ease)
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section__head, .pcard, .fabric-card, .ccard, .stat, .about__media, .about__text')
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
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || null } catch { return null }
  })
  const [showLang, setShowLang] = useState(() => {
    try { return !localStorage.getItem(LANG_KEY) } catch { return true }
  })
  const t = content[lang || 'tr']
  useReveal()
  useSmoothAnchors()
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'tr'
  }, [lang])
  const choose = (l) => {
    setLang(l)
    try { localStorage.setItem(LANG_KEY, l) } catch { /* ignore */ }
    setShowLang(false)
  }
  return (
    <>
      <Header nav={t.nav} menuLabel={t.ui.menu} lang={lang || 'tr'} onLang={choose} />
      <main>
        <Hero t={t.hero} />
        <About t={t.about} />
        <Fabrics t={t.fabrics} />
        <Products t={t.products} ui={t.ui} />
        <Concept t={t.concept} ui={t.ui} />
        <CTA t={t.cta} />
      </main>
      <Contact t={t.contact} />
      {showLang && <LangModal ui={t.ui} onChoose={choose} />}
    </>
  )
}
