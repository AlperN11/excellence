import { useState, useEffect, useRef } from 'react'
import { content, LANG_KEY, COOKIE_KEY } from './content.js'

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

let pageAudioCtx = null
function pageSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    pageAudioCtx = pageAudioCtx || new AC()
    const ctx = pageAudioCtx
    if (ctx.state === 'suspended') ctx.resume()
    const dur = 0.35
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) {
      const p = i / d.length
      d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * p) * 0.5
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.1
    filter.frequency.setValueAtTime(1200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + dur)
    const gain = ctx.createGain()
    gain.gain.value = 0.1
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
  } catch { /* ignore */ }
}

function Book({ t, prevLabel, nextLabel }) {
  const pages = t.pages
  const n = pages.length
  const [pos, setPos] = useState(0)
  const [dir, setDir] = useState(1)
  const [turn, setTurn] = useState(null)
  useEffect(() => {
    pages.forEach((src) => { const im = new Image(); im.src = src })
  }, [pages[0]])
  const dragX = useRef(null)
  useEffect(() => { setPos(0); setTurn(null); setDir(1) }, [pages[0]])
  const leftOf = (p) => {
    const i = (p - 1) * 2
    return { type: 'story', i }
  }
  const rightOf = (p) => {
    const i = (p - 1) * 2 + 1
    return i < n ? { type: 'story', i } : { type: 'blank' }
  }
  const face = (slot) => {
    if (slot.type === 'cover') {
      return (
        <button key="cover" className="bookcover" onClick={() => go(1)} aria-label={nextLabel}>
          <img src="/logo.svg" alt="Excellence Bedding" />
        </button>
      )
    }
    if (slot.type === 'blank') return <div key="blank" className="bblank" />
    if (slot.type === 'backcover') return <div key="back" className="bback" />
    return <img key={pages[slot.i]} className="bpage" src={pages[slot.i]} alt={`${t.story} ${slot.i + 1}`} loading="eager" draggable={false} />
  }
  const go = (d) => {
    if (turn) return
    const to = Math.min(3, Math.max(0, pos + d))
    if (to === pos) return
    pageSound()
    setDir(d)
    const from = pos
    setTurn(d > 0
      ? (from === 0
        ? { dir: d, side: 'right', front: { type: 'cover' }, back: { type: 'backcover' } }
        : { dir: d, side: 'right', front: rightOf(from), toLeft: leftOf(to) })
      : (to === 0
        ? { dir: d, side: 'left', front: { type: 'cover' }, back: leftOf(from) }
        : { dir: d, side: 'left', front: rightOf(to), back: leftOf(from) }))
    setTimeout(() => { setPos(to); setTurn(null) }, 950)
  }
  const cap = pos === 0 ? t.coverLabel : (() => {
    const a = (pos - 1) * 2 + 1
    const b = a + 1
    return b <= n ? `${a} - ${b}` : `${a}`
  })()
  const slogan = pos === 0 ? t.slogan : (() => {
    const idx = [(pos - 1) * 2, (pos - 1) * 2 + 1].filter((i) => i < n)
    return idx.map((i) => t.slogans[i]).join(' · ')
  })()
  const onDown = (e) => { dragX.current = e.clientX }
  const onMove = (e) => {
    if (dragX.current === null || turn) return
    const dx = e.clientX - dragX.current
    if (dx < -70) { dragX.current = null; go(1) }
    else if (dx > 70) { dragX.current = null; go(-1) }
  }
  const onUp = () => { dragX.current = null }
  const spread = (p) => (
    <>
      <div className="bpage2">{face(leftOf(p))}</div>
      <div className="bpage2">{face(rightOf(p))}</div>
    </>
  )
  const jump = (p) => {
    if (p === pos || turn) return
    const step = (cur) => {
      if (cur === p) return
      go(cur < p ? 1 : -1)
      setTimeout(() => step(cur + (cur < p ? 1 : -1)), 1000)
    }
    step(pos)
  }
  return (
    <div className="bookwrap">
      <div
        className={`book ${pos === 0 && !turn ? 'book--closed' : 'book--spread'}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {pos === 0 && !turn ? (
          face({ type: 'cover' })
        ) : (
          spread(turn ? (turn.dir > 0 ? pos + 1 : pos) : pos)
        )}
        {turn && turn.side === 'right' && (
          <div className="bleaf bleaf--right fwd">
            <div className="bleaf__face bleaf__front">{face(turn.front)}</div>
            <div className="bleaf__face bleaf__back">{face(turn.back)}</div>
          </div>
        )}
        {turn && turn.side === 'left' && (
          <div className="bleaf bleaf--left bwd">
            <div className="bleaf__face bleaf__front">{face(turn.front)}</div>
            <div className="bleaf__face bleaf__back">{face(turn.back)}</div>
          </div>
        )}
      </div>
      <p className="bookslogan">{slogan}</p>
      <div className="booknav">
        <button className="garrow garrow--sm" onClick={() => go(-1)} disabled={pos === 0} aria-label={prevLabel}>‹</button>
        <span className="booknums">{cap}</span>
        <button className="garrow garrow--sm" onClick={() => go(1)} disabled={pos === 3} aria-label={nextLabel}>›</button>
      </div>
    </div>
  )
}

function Fabrics({ t, ui }) {
  return (
    <section id="kumas" className="fabrics fabrics--book section">
      <div className="section__head">
        <h2>{t.title}</h2>
      </div>
      <Book t={t} prevLabel={ui.prev} nextLabel={ui.next} />
    </section>
  )
}

function Tech({ t }) {
  const fabrics = t.items.slice(0, 3)
  const systems = t.items.slice(3)
  const cards = (list, start) => (
    <div className="tech__grid">
      {list.map((it, i) => (
        <article key={it.id} className="tech-card tech-card--photo">
          <img className="tech-card__icon" src={it.icon} alt="" loading="lazy" />
          <div className="tech-card__text">
            <span className="tech-card__no">{String(start + i + 1).padStart(2, '0')}</span>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
  return (
    <section id="teknoloji" className="tech tech--photo section section--dark">
      <img className="tech__bg" src="/assets/products/lavender/4.jpg" alt="" />
      <div className="tech__scrim" />
      <div className="tech__inner">
        <div className="section__head section__head--light">
          <p className="kicker">{t.kicker}</p>
          <h2>{t.title}</h2>
          <p className="section__sub">{t.sub}</p>
        </div>
        <h3 className="tech__group">{t.fabricsTitle}</h3>
        {cards(fabrics, 0)}
        <h3 className="tech__group">{t.systemsTitle}</h3>
        {cards(systems, 3)}
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
  const [zoom, setZoom] = useState(1)
  const [zoom2, setZoom2] = useState(1)
  const [isFull, setIsFull] = useState(false)
  const [page, setPage] = useState(0)
  const mediaRef = useRef(null)
  const detailRef = useRef(null)
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
  useEffect(() => { setSel(0); setZoom(1); setZoom2(1); setPage(0) }, [p?.id])
  useEffect(() => { setZoom2(1) }, [page])
  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])
  if (!p) return null
  const gallery = p.gallery?.length ? p.gallery : [p.img].filter(Boolean)
  const photoBg = p.galleryBg?.[sel]
  const dimgs = p.detail?.images || []
  const lastPage = dimgs.length
  const curDetail = dimgs[page]
  const lightTools = !!curDetail?.dark
  const toggleFull = () => {
    if (!document.fullscreenElement) mediaRef.current?.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen()
  }
  const toggleFullDetail = () => {
    if (!document.fullscreenElement) detailRef.current?.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen()
  }
  const zoomBox = (src, alt) => (
    <div
      className={`gallery__zoombox ${zoom > 1 ? 'zoomed' : ''}`}
      onClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
    >
      <img className="gallery__main" src={src} alt={alt} style={{ transform: `scale(${zoom})` }} />
    </div>
  )
  return (
    <div className="modal" onClick={onClose}>
      <div className={`modal__panel${dimgs.length > 0 && page !== lastPage ? ' modal__panel--detail' : ''}`} style={{ '--accent': p.accent }} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label={ui.close}>×</button>
        <div className={`modal__media${photoBg ? ' modal__media--photo' : ''}`} ref={mediaRef} style={photoBg ? { background: photoBg } : undefined}>
          <div className="gallery__toolbar">
            <button className="gtool" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label={ui.zoomOut}>−</button>
            <span className="gzoom">{Math.round(zoom * 100)}%</span>
            <button className="gtool" onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} aria-label={ui.zoomIn}>+</button>
            <button className="gtool" onClick={toggleFull} aria-label={ui.full}>{isFull ? '⤡' : '⛶'}</button>
          </div>
          <div className="gallery__viewer">
            {gallery.length > 1 && (
              <button className="garrow" onClick={() => setSel((sel - 1 + gallery.length) % gallery.length)} aria-label={ui.prev}>‹</button>
            )}
            {zoomBox(gallery[sel] ?? gallery[0], `${p.name} ${ui.photo} ${sel + 1}`)}
            {gallery.length > 1 && (
              <button className="garrow" onClick={() => setSel((sel + 1) % gallery.length)} aria-label={ui.next}>›</button>
            )}
          </div>
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
        {dimgs.length > 0 && page !== lastPage ? (
          <div className="modal__info modal__info--detail" ref={detailRef} style={curDetail?.bg ? { background: curDetail.bg } : undefined}>
            <div className="gallery__toolbar">
              <button className={`gtool${lightTools ? '' : ' gtool--dark'}`} onClick={() => setZoom2((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label={ui.zoomOut}>−</button>
              <span className={`gzoom${lightTools ? '' : ' gzoom--dark'}`}>{Math.round(zoom2 * 100)}%</span>
              <button className={`gtool${lightTools ? '' : ' gtool--dark'}`} onClick={() => setZoom2((z) => Math.min(3, +(z + 0.5).toFixed(1)))} aria-label={ui.zoomIn}>+</button>
              <button className={`gtool${lightTools ? '' : ' gtool--dark'}`} onClick={toggleFullDetail} aria-label={ui.full}>{isFull ? '⤡' : '⛶'}</button>
            </div>
            <div
              className={`gallery__zoombox ${zoom2 > 1 ? 'zoomed' : ''}`}
              onClick={() => setZoom2((z) => (z > 1 ? 1 : 2))}
            >
              <img className="detail__img" src={curDetail.src} alt={p.name} style={{ transform: `scale(${zoom2})` }} />
            </div>
            <div className="pages pages--bottom">
              {[...Array(dimgs.length + 1)].map((_, i) => (
                <button key={i} className={`page-dot ${page === i ? 'on' : ''}`} style={{ '--accent': p.accent }} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
            </div>
          </div>
        ) : (
        <div className="modal__info">
          <p className="kicker">{p.spring}</p>
          <h3>{p.name}</h3>
          <p className="modal__tagline">{p.tagline}</p>
          {(dimgs.length === 0 || page === lastPage) && (
            <>
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
            </>
          )}
          {dimgs.length > 0 && (
            <div className="pages pages--bottom">
              {[...Array(dimgs.length + 1)].map((_, i) => (
                <button key={i} className={`page-dot ${page === i ? 'on' : ''}`} style={{ '--accent': p.accent }} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
        )}
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
  const [zoom, setZoom] = useState(1)
  const [isFull, setIsFull] = useState(false)
  const mediaRef = useRef(null)
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
  useEffect(() => { setZoom(1) }, [c?.name])
  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])
  if (!c) return null
  const toggleFull = () => {
    if (!document.fullscreenElement) mediaRef.current?.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen()
  }
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label={ui.close}>×</button>
        <div className="modal__media" ref={mediaRef}>
          <div className="gallery__toolbar">
            <button className="gtool" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label={ui.zoomOut}>−</button>
            <span className="gzoom">{Math.round(zoom * 100)}%</span>
            <button className="gtool" onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} aria-label={ui.zoomIn}>+</button>
            <button className="gtool" onClick={toggleFull} aria-label={ui.full}>{isFull ? '⤡' : '⛶'}</button>
          </div>
          <div
            className={`gallery__zoombox ${zoom > 1 ? 'zoomed' : ''}`}
            onClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
          >
            <img className="gallery__main" src={c.img} alt={c.name} style={{ transform: `scale(${zoom})` }} />
          </div>
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

function CookieBanner({ t, onDone }) {
  const [custom, setCustom] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [personal, setPersonal] = useState(false)
  return (
    <div className="cookiebanner" role="dialog" aria-label={t.title}>
      <h4>{t.title}</h4>
      <p>{t.text}</p>
      {custom && (
        <div className="cookiebanner__opts">
          <label className="cookieopt">
            <span><strong>{t.necessaryTitle}</strong><small>{t.necessaryDesc}</small></span>
            <span className="switch on locked"><span /></span>
          </label>
          <label className="cookieopt">
            <span><strong>{t.analyticsTitle}</strong><small>{t.analyticsDesc}</small></span>
            <button type="button" aria-label={t.analyticsTitle} className={`switch ${analytics ? 'on' : ''}`} onClick={() => setAnalytics((v) => !v)}><span /></button>
          </label>
          <label className="cookieopt">
            <span><strong>{t.personalTitle}</strong><small>{t.personalDesc}</small></span>
            <button type="button" aria-label={t.personalTitle} className={`switch ${personal ? 'on' : ''}`} onClick={() => setPersonal((v) => !v)}><span /></button>
          </label>
        </div>
      )}
      <div className="cookiebanner__btns">
        {custom
          ? <button className="btn btn--primary btn--sm" onClick={() => onDone({ necessary: true, analytics, personal })}>{t.save}</button>
          : (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => onDone({ necessary: true, analytics: true, personal: true })}>{t.acceptAll}</button>
              <button className="btn btn--dark btn--sm" onClick={() => onDone({ necessary: true, analytics: false, personal: false })}>{t.necessaryOnly}</button>
              <button className="cookiebanner__link" onClick={() => setCustom(true)}>{t.customize}</button>
            </>
          )}
      </div>
    </div>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section__head, .pcard, .fabric-card, .tech-card, .ccard, .stat, .about__media, .about__text, .bookwrap')
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
  const [consent, setConsent] = useState(() => {
    try { return localStorage.getItem(COOKIE_KEY) } catch { return null }
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
  const saveConsent = (c) => {
    setConsent('1')
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)) } catch { /* ignore */ }
  }
  return (
    <>
      <Header nav={t.nav} menuLabel={t.ui.menu} lang={lang || 'tr'} onLang={choose} />
      <main>
        <Hero t={t.hero} />
        <About t={t.about} />
        <Fabrics t={t.fabrics} ui={t.ui} />
        <Tech t={t.tech} />
        <Products t={t.products} ui={t.ui} />
        <Concept t={t.concept} ui={t.ui} />
        <CTA t={t.cta} />
      </main>
      <Contact t={t.contact} />
      {showLang && <LangModal ui={t.ui} onChoose={choose} />}
      {!consent && !showLang && <CookieBanner t={t.cookies} onDone={saveConsent} />}
    </>
  )
}
