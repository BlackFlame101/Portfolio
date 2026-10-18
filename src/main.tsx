import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './i18n'
import './index.css'
import { assetUrl } from './lib/assetUrl'
import { expertise } from './content/expertise'
import { experience, education } from './content/experience'
import { projects } from './content/projects'
import { socials } from './content/socials'
import { getNotes, postNote as saveSharedNote, guestbookReady } from './lib/guestbook'
import { sendMessage, inboxReady } from './lib/formspree'

const navItems = ['about', 'expertise', 'projects', 'experience', 'contact'] as const
type SectionId = (typeof navItems)[number]
type Note = { id: string; name: string; note: string; created_at: string }
type FormStatus = 'idle' | 'sending' | 'success' | 'error'

function App() {
  const { t, i18n } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [language, setLanguage] = useState(i18n.language.startsWith('fr') ? 'fr' : 'en')
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [contactTab, setContactTab] = useState<'note' | 'inbox'>('note')
  const [notes, setNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [guestbookStatus, setGuestbookStatus] = useState<FormStatus>('idle')
  const [inboxStatus, setInboxStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    const update = () => {
      setShowTop(window.scrollY > 440)
      for (const id of navItems) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top < window.innerHeight * 0.45) setActiveSection(id)
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    let alive = true
    if (!guestbookReady) {
      setNotesLoading(false)
      return () => { alive = false }
    }
    void getNotes()
      .then((data) => {
        if (!alive) return
        if (data) setNotes(data)
        setNotesLoading(false)
      })
    return () => { alive = false }
  }, [])

  const changeLanguage = (next: 'en' | 'fr') => {
    void i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    document.documentElement.lang = next
    setLanguage(next)
  }

  const submitNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    if (String(values.get('website') ?? '').trim()) return
    const name = String(values.get('name') ?? '').trim().slice(0, 40)
    const note = String(values.get('note') ?? '').trim().slice(0, 280)
    if (!guestbookReady || !name || !note) {
      setGuestbookStatus('error')
      return
    }
    const lastPosted = Number(localStorage.getItem('guestbook-last-post') ?? 0)
    if (Date.now() - lastPosted < 30000) {
      setGuestbookStatus('error')
      return
    }
    const optimistic: Note = { id: `local-${Date.now()}`, name, note, created_at: new Date().toISOString() }
    setNotes((previous) => [optimistic, ...previous])
    setGuestbookStatus('sending')
    const savedNote = await saveSharedNote(name, note)
    if (!savedNote) {
      setNotes((previous) => previous.filter((item) => item.id !== optimistic.id))
      setGuestbookStatus('error')
      return
    }
    localStorage.setItem('guestbook-last-post', String(Date.now()))
    setNotes((previous) => previous.map((item) => item.id === optimistic.id ? savedNote : item))
    setGuestbookStatus('success')
    form.reset()
  }

  const submitInbox = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setInboxStatus('sending')
    const result = await sendMessage(new FormData(event.currentTarget))
    setInboxStatus(result ? 'success' : 'error')
    if (result) event.currentTarget.reset()
  }

  const nav = (mobile = false) => navItems.map((id) => (
    <a key={id} href={`#${id}`} className={`nav-link ${activeSection === id ? 'is-active' : ''}`} onClick={() => mobile && setMenuOpen(false)}>{t(`nav.${id}`)}</a>
  ))
  const reveal = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: reduceMotion ? 0 : 0.55 },
  }

  return (
    <>
      <a className="skip-link" href="#main">{t('a11y.skip')}</a>
      <header className="site-header">
        <div className="header-inner wrap">
          <a href="#home" className="brand" aria-label={t('nav.home')}>BADR<span>®</span></a>
          <nav className="desktop-nav" aria-label={t('nav.label')}>{nav()}</nav>
          <div className="header-actions">
            <div className="language-toggle" aria-label={t('language.label')}>
              <button type="button" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button><span>/</span><button type="button" aria-pressed={language === 'fr'} onClick={() => changeLanguage('fr')}>FR</button>
            </div>
            <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? '×' : '☰'}<span className="sr-only">{t('nav.menu')}</span></button>
          </div>
        </div>
        <AnimatePresence>{menuOpen && <motion.nav id="mobile-menu" className="mobile-nav" aria-label={t('nav.label')} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{nav(true)}<div className="mobile-language"><button type="button" onClick={() => changeLanguage('en')}>English</button><button type="button" onClick={() => changeLanguage('fr')}>Français</button></div></motion.nav>}</AnimatePresence>
      </header>

      <main id="main">
        <section id="home" className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero-stickers" aria-hidden="true"><span className="sticker sticker-cyan sticker-year">{t('hero.year')}</span><span className="sticker sticker-black sticker-gh">⌘<small>GITHUB</small></span><span className="sticker sticker-pink sticker-open">● {t('hero.open')}</span><span className="sticker sticker-green sticker-ml">✦ ML Systems</span><span className="sticker sticker-purple sticker-rag">◈ RAG + LLM</span><span className="sticker sticker-yellow sticker-star">✳</span></div>
          <motion.div className="hero-content" initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65 }}>
            <p className="hero-eyebrow"><span className="status-dot" />{t('hero.hello')}</p>
            <h1 id="hero-title"><span>BADR-EDDINE</span><strong>BENOUARI</strong></h1>
            <p className="hero-role"><span aria-hidden="true">&gt;</span> {t('hero.role')}</p>
            <div className="hero-ctas"><a href="#projects" className="button button-dark">✦ {t('hero.projects')}</a><a href="#contact" className="button button-yellow">↗ {t('hero.talk')}</a></div>
            <div className="hero-socials">{socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</a>)}<a href={`mailto:${t('meta.email')}`}>{t('contact.emailMe')}</a><a href={`mailto:${t('meta.email')}?subject=${encodeURIComponent(t('hero.cv'))}`}>{t('hero.cv')}</a></div>
          </motion.div>
          <a className="scroll-cue" href="#about"><span>{t('hero.scroll')}</span><i /></a>
        </section>

        <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 5 }, (_, i) => <span key={i}>{t('about.marquee')} ✦ </span>)}</div></div>

        <section id="about" className="section wrap" aria-labelledby="about-title">
          <motion.div {...reveal}><SectionHeader number="01" label={t('nav.about')} title={t('about.title')} id="about-title" /></motion.div>
          <motion.div className="about-card hard-card" {...reveal}>
            <div className="about-copy"><p>{t('about.p1')}</p><p>{t('about.p2')}</p><div className="fact-row"><span>✦ {t('about.location')}</span><span>✦ {t('about.languages')}</span></div><a href={`mailto:${t('meta.email')}?subject=${encodeURIComponent(t('about.cv'))}`} className="button button-dark">▣ {t('about.cv')}</a></div>
            <div className="about-portrait"><img className="portrait-photo" src={assetUrl('images/photo.webp')} alt={t('about.photoAlt')} width="400" height="400" loading="lazy" /></div>
          </motion.div>
        </section>

        <section id="expertise" className="section wrap" aria-labelledby="expertise-title">
          <motion.div {...reveal}><SectionHeader number="02" label={t('nav.expertise')} title={t('expertise.title')} /><span className="section-sticker">{t('expertise.sticker')} ✦</span></motion.div>
          <div className="expertise-grid">{expertise.map((item, index) => <motion.article key={item.key} className={`expertise-card hard-card color-${item.color}`} {...reveal} transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.06 }}><MiniIllustration kind={item.illustration} /><span className="chip">{t(`expertise.items.${item.key}.title`)}</span><p>{t(`expertise.items.${item.key}.description`)}</p></motion.article>)}</div>
        </section>

        <section id="projects" className="section wrap projects-section" aria-labelledby="projects-title">
          <motion.div {...reveal}><SectionHeader number="03" label={t('nav.projects')} title={t('projects.title')} /></motion.div>
          <p className="projects-intro">{t('projects.intro')}</p>
            <div className="projects-grid">{projects.map((project, index) => <motion.article key={project.key} className="project-card hard-card" {...reveal} transition={{ delay: reduceMotion ? 0 : index * 0.08 }}>
            <a className="project-image-link" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${t(`projects.items.${project.key}.title`)} — ${t('projects.openProject')}`}><img className="project-image" src={assetUrl(project.image)} alt={t(`projects.items.${project.key}.${project.imageAltKey}`)} loading="lazy" width="1600" height="900" /></a>
            <div className="project-body"><div className="project-title-row"><h3>{t(`projects.items.${project.key}.title`)}</h3></div><p>{t(`projects.items.${project.key}.description`)}</p><div className="stack-list">{project.stack.map((tech) => <span className="stack-chip" key={tech}>{tech}</span>)}</div><div className="project-links">{project.github ? <a href={project.github} target="_blank" rel="noopener noreferrer">↗ GitHub</a> : null}{project.live ? <a href={project.live} target="_blank" rel="noopener noreferrer">↗ {t('projects.live')}</a> : null}{project.key === 'socra' ? <span className="external-note">{t('projects.externalLinkNote')}</span> : null}</div></div>
          </motion.article>)}</div>
          <p className="shipping-note">✳ {t('projects.shipping')}</p>
        </section>

        <section id="experience" className="experience-section" aria-labelledby="experience-title">
          <div className="wrap section"><motion.div {...reveal}><SectionHeader number="04" label={t('nav.experience')} title={t('experience.title')} dark /></motion.div>
            <div className="timeline">{experience.map((item, index) => <motion.article className="timeline-entry" key={item.key} {...reveal} transition={{ delay: reduceMotion ? 0 : index * 0.1 }}><div className="timeline-dot" /><div className="experience-card"><div className="experience-meta"><span className="role-chip">{t('experience.role')}</span><time>{t(`experience.items.${item.key}.dates`)}</time></div><h3>{t(`experience.items.${item.key}.title`)}</h3><p className="company">{t(`experience.items.${item.key}.company`)}</p><p className="experience-description">{t(`experience.items.${item.key}.description`)}</p><div className="stack-list">{item.stack.map((tech) => <span key={tech} className="stack-chip">{tech}</span>)}</div></div></motion.article>)}</div>
            <motion.div className="education" {...reveal}><h3>{t('experience.education')}</h3><div className="education-grid">{education.map((item) => <article key={item.key}><span>{t(`experience.educationItems.${item.key}.dates`)}</span><h4>{t(`experience.educationItems.${item.key}.title`)}</h4><p>{t(`experience.educationItems.${item.key}.school`)}</p></article>)}</div></motion.div>
          </div>
        </section>

        <div className="marquee contact-marquee" aria-hidden="true"><div>{Array.from({ length: 5 }, (_, i) => <span key={i}>{t('contact.marquee')} ✦ </span>)}</div></div>
        <section id="contact" className="section wrap" aria-labelledby="contact-title">
          <motion.div {...reveal}><SectionHeader number="05" label={t('nav.contact')} title={t('contact.title')} /><p className="section-subtitle">{t('contact.subtitle')}</p></motion.div>
          <div className="contact-grid">
            <motion.div className="guestbook hard-card" {...reveal}><div className="guestbook-head"><span>◉ {t('contact.guestbook')} — {notes.length} {t('contact.notes')}</span><i title={guestbookReady ? t('contact.connected') : t('contact.setupRequired')} /></div><div className="notes-list" aria-live="polite">{notesLoading ? <p className="service-message">{t('contact.loading')}</p> : !guestbookReady ? <p className="service-message">{t('contact.setupRequired')}</p> : notes.length === 0 ? <p className="service-message">{t('contact.noNotes')}</p> : notes.map((note, index) => <article key={note.id} className={`note-row note-${index % 4}`}><span className="note-avatar">{note.name.slice(0, 2).toUpperCase()}</span><div className="note-bubble"><b>{note.name}</b><p>{note.note}</p><time>{new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date(note.created_at))}</time></div></article>)}</div></motion.div>
            <motion.div className="contact-panel hard-card" {...reveal}><div className="contact-tabs" role="tablist" aria-label={t('contact.tabs')}><button role="tab" id="tab-note" aria-selected={contactTab === 'note'} aria-controls="panel-note" onClick={() => setContactTab('note')}>✍ {t('contact.leaveNote')}</button><button role="tab" id="tab-inbox" aria-selected={contactTab === 'inbox'} aria-controls="panel-inbox" onClick={() => setContactTab('inbox')}>▣ {t('contact.directInbox')}</button></div>
              {contactTab === 'note' ? <form id="panel-note" role="tabpanel" aria-labelledby="tab-note" className="contact-form" onSubmit={submitNote}><label>{t('contact.name')} *<input name="name" required maxLength={40} autoComplete="name" placeholder={t('contact.namePlaceholder')} /></label><label>{t('contact.note')} *<textarea name="note" required maxLength={280} rows={4} placeholder={t('contact.notePlaceholder')} /></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><button className="button button-dark submit-button" disabled={!guestbookReady || guestbookStatus === 'sending'}>{guestbookStatus === 'sending' ? t('contact.posting') : `✺ ${t('contact.postNote')}`}</button>{!guestbookReady && <p className="form-error">{t('contact.setupRequired')}</p>}{guestbookStatus === 'success' && <p role="status" className="form-success">{t('contact.postSuccess')}</p>}{guestbookStatus === 'error' && <p role="alert" className="form-error">{t(guestbookReady ? 'contact.cooldown' : 'contact.setupRequired')}</p>}</form> : <form id="panel-inbox" role="tabpanel" aria-labelledby="tab-inbox" className="contact-form" onSubmit={submitInbox}><label>{t('contact.name')} *<input name="name" required maxLength={100} autoComplete="name" placeholder={t('contact.namePlaceholder')} /></label><label>{t('contact.email')} *<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></label><label>{t('contact.message')} *<textarea name="message" required rows={4} placeholder={t('contact.messagePlaceholder')} /></label><button className="button button-dark submit-button" disabled={inboxStatus === 'sending'}>{inboxStatus === 'sending' ? t('contact.sending') : `↗ ${t('contact.send')}`}</button>{inboxStatus === 'success' && <p role="status" className="form-success">{t('contact.sendSuccess')}</p>}{inboxStatus === 'error' && <p role="alert" className="form-error">{t(inboxReady ? 'contact.sendError' : 'contact.inboxOffline')}</p>}</form>}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="wrap footer-inner"><a href="#home" className="brand">BADR<span>®</span></a><div>{socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</a>)}<a href={`mailto:${t('meta.email')}`}>{t('contact.emailMe')}</a></div><small>© {new Date().getFullYear()} BADR-EDDINE BENOUARI</small></div></footer>
      <AnimatePresence>{showTop && <motion.a className="back-to-top" href="#home" aria-label={t('a11y.backToTop')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>↑</motion.a>}</AnimatePresence>
    </>
  )
}

function SectionHeader({ number, label, title, id, dark = false }: { number: string; label: string; title: string; id?: string; dark?: boolean }) {
  return <div className={`section-header ${dark ? 'section-header-dark' : ''}`}><span className="section-label">[ {number} — {label} ]</span><h2 id={id}>{title}<i aria-hidden="true" /></h2></div>
}

function MiniIllustration({ kind }: { kind: string }) {
  if (kind === 'workflow') return <div className="mini-illustration workflow-art" aria-hidden="true"><span>input</span><i>→</i><span>RAG</span><i>→</i><span>output</span></div>
  if (kind === 'terminal') return <div className="mini-illustration terminal-art" aria-hidden="true"><b>● ● ●</b><code>$ python agent.py<br />› analyze(data)<br />› done ✓</code></div>
  if (kind === 'chart') return <div className="mini-illustration chart-art" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
  if (kind === 'database') return <div className="mini-illustration database-art" aria-hidden="true">▤<span>API ↔ DB</span></div>
  if (kind === 'pipeline') return <div className="mini-illustration pipeline-art" aria-hidden="true">▱ → ▧ → ▤</div>
  return <div className="mini-illustration server-art" aria-hidden="true"><span>▰</span><span>▰</span><span>▰</span></div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
