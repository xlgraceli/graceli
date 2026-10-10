import { useEffect, useRef, useState } from 'react'
import './App.css'

const windows = {
  about: { title: 'about me.txt', icon: '/icons/about.svg', width: 700, height: 540 },
  work: { title: 'my work.folder', icon: '/icons/work.svg', width: 640, height: 440 },
  links: { title: 'links.url', icon: '/icons/links.svg', width: 420, height: 340 },
  faq: { title: 'faq.readme', icon: '/icons/faq.svg', width: 440, height: 370 },
  fun: { title: 'fun stuff ✦', icon: '/icons/fun-star.svg', width: 450, height: 350 },
}

const iconPath = (id) => id === 'fun' ? '/icons/fun-star.svg' : `/icons/${id}.svg`

const skyStars = [[7,14],[15,31],[22,9],[29,23],[37,12],[44,35],[51,18],[58,8],[64,29],[72,14],[79,33],[86,11],[93,25],[11,49],[27,43],[41,54],[63,46],[88,51]]

function SmallIcon({ type }) {
  const paths = {
    github: <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.9 2.24 3.7 1.82.1-.73.4-1.23.7-1.51-2.48-.28-5.1-1.24-5.1-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.43 3.04-1.15 3.04-1.15.61 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3.01 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/>,
    linkedin: <path d="M5.2 3.1a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0ZM1.3 7h3.7v15.5H1.3V7Zm6 0h3.5v2.1h.1c.5-.95 1.7-2 3.6-2 3.9 0 4.6 2.55 4.6 5.85v9.55h-3.7V14c0-2.05-.05-4.7-2.85-4.7-2.85 0-3.3 2.23-3.3 4.55v8.65H7.3V7Z"/>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></>,
    book: <><path d="M12 7v14M12 7c-2-2-5-3-9-2v14c4-1 7 0 9 2m0-14c2-2 5-3 9-2v14c-4-1-7 0-9 2"/><path d="m17 2 4 4-7 7-4 1 1-4z"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/><path d="M16 8.5a2.5 2.5 0 1 1 5 0c0 2-2.5 4.5-2.5 4.5S16 10.5 16 8.5Z"/></>,
    network: <><circle cx="12" cy="12" r="2.5"/><circle cx="4" cy="5" r="2"/><circle cx="20" cy="5" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><path d="m10 10-4.5-3.5M14 10l4.5-3.5M10 14l-4.5 3.5M14 14l4.5 3.5"/></>,
  }
  return <svg className={`small-icon small-icon-${type}`} viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>
}

function App() {
  const [open, setOpen] = useState([])
  const [front, setFront] = useState('')
  const [positions, setPositions] = useState({})
  const [sizes, setSizes] = useState({})
  const [dark, setDark] = useState(false)
  const [sound, setSound] = useState(true)
  const [music, setMusic] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [mascotPhrase, setMascotPhrase] = useState('')
  const mascotPhraseIndex = useRef({ day: -1, night: -1 })
  const mascotPhraseTimer = useRef(null)
  const dragging = useRef(null)
  const resizing = useRef(null)
  const zIndex = useRef(5)
  const musicContext = useRef(null)
  const musicTimer = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => {
      window.clearInterval(timer)
      window.clearInterval(musicTimer.current)
      window.clearTimeout(mascotPhraseTimer.current)
      musicContext.current?.close()
    }
  }, [])

  function playSound(kind = 'open') {
    if (!sound) return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const context = new AudioContextClass()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(kind === 'close' ? 380 : 620, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(kind === 'close' ? 220 : 880, context.currentTime + 0.065)
      gain.gain.setValueAtTime(0.045, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.075)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.08)
      oscillator.onended = () => context.close()
    } catch { /* Sound is optional when browser audio is unavailable. */ }
  }

  function openWindow(id) {
    playSound()
    if (!open.includes(id)) setOpen((current) => [...current, id])
    zIndex.current += 1
    setFront(id)
  }

  function toggleMusic() {
    if (music) {
      window.clearInterval(musicTimer.current)
      musicContext.current?.close()
      musicContext.current = null
      musicTimer.current = null
      setMusic(false)
      return
    }
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const context = new AudioContextClass()
      musicContext.current = context
      const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 698.46]
      let step = 0
      const playNote = () => {
        const oscillator = context.createOscillator()
        const volume = context.createGain()
        const time = context.currentTime
        oscillator.type = 'sine'
        oscillator.frequency.value = notes[step % notes.length]
        volume.gain.setValueAtTime(0.0001, time)
        volume.gain.exponentialRampToValueAtTime(0.018, time + 0.08)
        volume.gain.exponentialRampToValueAtTime(0.0001, time + 1.15)
        oscillator.connect(volume)
        volume.connect(context.destination)
        oscillator.start(time)
        oscillator.stop(time + 1.2)
        step += 1
      }
      playNote()
      musicTimer.current = window.setInterval(playNote, 900)
      setMusic(true)
    } catch {
      setMusic(false)
    }
  }

  function talkToMascot() {
    playSound()
    const mode = dark ? 'night' : 'day'
    const phrases = dark
      ? ['hi there', 'how are you', 'check out my page', "what's up", 'I love watermelons', 'good night']
      : ['hi there', 'how are you', 'check out my page', "what's up", 'you wanna see my frogs?']
    const options = phrases.map((_, index) => index).filter((index) => index !== mascotPhraseIndex.current[mode])
    const next = options[Math.floor(Math.random() * options.length)]
    mascotPhraseIndex.current[mode] = next
    setMascotPhrase(phrases[next])
    window.clearTimeout(mascotPhraseTimer.current)
    mascotPhraseTimer.current = window.setTimeout(() => setMascotPhrase(''), 3000)
  }

  function closeWindow(id) {
    playSound('close')
    setOpen((current) => current.filter((item) => item !== id))
  }

  function startDrag(event, id) {
    if (event.button !== 0) return
    event.preventDefault()
    const pos = positions[id] || defaultPosition(id)
    dragging.current = { id, dx: event.clientX - pos.x, dy: event.clientY - pos.y }
    zIndex.current += 1
    setFront(id)
    const move = (moveEvent) => {
      if (!dragging.current) return
      const { id: active, dx, dy } = dragging.current
      const maxX = Math.max(0, window.innerWidth - 120)
      const maxY = Math.max(0, window.innerHeight - 90)
      setPositions((current) => ({ ...current, [active]: { x: Math.max(0, Math.min(maxX, moveEvent.clientX - dx)), y: Math.max(28, Math.min(maxY, moveEvent.clientY - dy)) } }))
    }
    const stop = () => {
      dragging.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

  function startResize(event, id) {
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const rect = event.currentTarget.parentElement.getBoundingClientRect()
    resizing.current = { id, startX: event.clientX, startY: event.clientY, width: rect.width, height: rect.height, top: rect.top, left: rect.left }
    setFront(id)
    const move = (moveEvent) => {
      if (!resizing.current) return
      const { id: active, startX, startY, width, height, top, left } = resizing.current
      const maxWidth = Math.max(280, window.innerWidth - left - 10)
      const maxHeight = Math.max(240, window.innerHeight - top - 85)
      setSizes((current) => ({
        ...current,
        [active]: {
          width: Math.max(280, Math.min(maxWidth, width + moveEvent.clientX - startX)),
          height: Math.max(240, Math.min(maxHeight, height + moveEvent.clientY - startY)),
        },
      }))
    }
    const stop = () => {
      resizing.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

  function resizeWithKeys(event, id) {
    const change = { ArrowRight: [20, 0], ArrowLeft: [-20, 0], ArrowDown: [0, 20], ArrowUp: [0, -20] }[event.key]
    if (!change) return
    event.preventDefault()
    const current = sizes[id] || { width: Math.min(windows[id].width, window.innerWidth - 20), height: Math.min(windows[id].height, window.innerHeight - 100) }
    setSizes((existing) => ({
      ...existing,
      [id]: {
        width: Math.max(280, Math.min(window.innerWidth - 20, current.width + change[0])),
        height: Math.max(240, Math.min(window.innerHeight - 100, current.height + change[1])),
      },
    }))
  }

  function defaultPosition(id) {
    const width = windows[id].width
    const height = windows[id].height
    return { x: Math.max(18, Math.min(window.innerWidth - width - 24, window.innerWidth * 0.36 + (Object.keys(positions).length % 3) * 22)), y: Math.max(50, Math.min(window.innerHeight - height - 80, 88 + (Object.keys(positions).length % 3) * 24)) }
  }

  function renderContent(id) {
    if (id === 'about') return <div className="about-content"><div className="portrait"><img src="/images/profile-photo.jpeg" alt="Grace Li" /></div><div className="resume"><p className="mini-kicker">COMPUTER ENGINEERING · SOFTWARE</p><h2>Grace Li <span>✿</span></h2><p className="resume-role">University of Toronto · BASc<br />PEY Co-op · expected 2028</p><div className="resume-line"/><p className="resume-summary">Computer Engineering student focused on software, with experience across DevOps, computer vision, and full-stack development.</p><p className="resume-section-label">EXPERIENCE</p><div className="resume-entry"><div><b>Cerebras Systems</b><span>DevOps Engineer Intern · May 2026–Present</span></div><p>Reworked CI blacklist tracking, cutting payloads from ~40k entries to tens. Built Jenkins automation and CI reliability tooling.</p></div><div className="resume-entry"><div><b>Magna International</b><span>Software Development Intern · Apr 2025–Apr 2026</span></div><p>Built PyTorch/YOLO vision pipelines; C++ with OpenMP/GPU acceleration cut runtime 3×.</p></div><div className="resume-entry"><div><b>Climind</b><span>Full Stack Development Intern · Jul–Aug 2024</span></div><p>Improved rPPG heart-rate accuracy by 20% and reduced Phi-3 inference latency by 35%.</p></div><p className="resume-section-label">SKILLS</p><p className="resume-skills">Python · C/C++ · Java · SQL · JavaScript · Verilog · Assembly<br/>Git · Linux · Bash · Docker · Jenkins · PyTorch · YOLO · OpenCV</p><p className="resume-coursework">COURSEWORK &nbsp; Operating Systems · Algorithms · Networks · Software Design</p></div></div>
    if (id === 'work') return <div className="work-content"><p className="window-intro">A few projects I’m proud of ♡</p>{[
      { number: '01', period: 'MAY–AUG 2025', icon: 'book', title: 'AI Writing Detector', description: 'Hybrid RoBERTa and linguistic-feature classifier, scoring over 80% F1 on a 500k-row dataset.', tags: 'Python · PyTorch · NLP', url: 'https://github.com/xlgraceli/AI_Detector' },
      { number: '02', period: 'JAN 2025', icon: 'network', title: 'Coalescence', description: 'SciBERT + NER pipeline querying Semantic Scholar’s 214M+ papers and balancing relevance with semantic opposition. React and FastAPI power low-latency recommendations.', tags: 'Python · FastAPI · React · SciBERT', url: 'https://github.com/xlgraceli/Coalescence' },
      { number: '03', period: 'JAN–APR 2025', icon: 'map', title: 'Accessible GIS Navigator', description: 'C++ mapping tool with Dijkstra, A*, and multi-stop route planning, recalculated in real time.', tags: 'C++ · STL · Algorithms' },
    ].map(({ number, period, icon, title, description, tags, url })=><article className={`mini-project ${url ? 'has-link' : 'no-link'}`} key={number}><div className="mini-project-icon"><SmallIcon type={icon}/></div><div><span>{number} / PROJECT · {period}</span><h3>{title}</h3><p>{description}</p><small>{tags}</small></div>{url && <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${title} on GitHub`}><SmallIcon type="github"/></a>}</article>)}</div>
    if (id === 'links') return <div className="links-content"><p className="window-intro">Little corners of the internet where you can find me.</p>{[
      { icon: 'github', label: 'GitHub', description: 'Projects & experiments', url: 'https://github.com/xlgraceli' },
      { icon: 'linkedin', label: 'LinkedIn', description: 'School and work things', url: 'https://www.linkedin.com/in/xlgraceli/' },
      { icon: 'mail', label: 'Email', description: 'Say hello', url: 'mailto:xlgraceli@gmail.com' },
    ].map(({ icon, label, description, url })=><a className="link-row" href={url} target={url.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" key={label}><span className="link-icon"><SmallIcon type={icon}/></span><span><b>{label}</b><small>{description}</small></span><i>↗</i></a>)}</div>
    if (id === 'faq') return <div className="faq-content"><p className="window-intro">A few quick facts, just in case you were wondering ♡</p><div><b>What are you studying?</b><p>Computer Engineering, with most of my curiosity pointed toward software.</p></div><div><b>What do you like building?</b><p>Friendly interfaces, small tools, and projects that help me learn something new.</p></div><div><b>Are you open to opportunities?</b><p>Absolutely! I’m interested in internships and meeting thoughtful collaborators.</p></div></div>
    return <div className="fun-content"><p className="window-intro">A few things that make my little brain happy ♡</p><div className="fun-grid"><div><span>✎</span><b>DRAWING</b><small>tiny paper sketches</small></div><div className="fun-dancing"><span>♫</span><b>DANCING</b><small>Wance Crew</small><nav aria-label="Wance Crew social links"><a href="https://www.youtube.com/@WanceCrew" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/wancecrew/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.tiktok.com/@wancecrew" target="_blank" rel="noreferrer">TikTok</a></nav></div><div><span>☕</span><b>COFFEE</b><small>one more little cup</small></div><div><span>🧭</span><b>SIDE QUESTS</b><small>always in progress</small></div></div><p className="fun-note">CURRENT STATUS: learning something new...</p></div>
  }

  return <main className={dark ? 'desktop night' : 'desktop'} onPointerDown={(event) => { if (event.target === event.currentTarget) setFront('') }}>
    <div className="desktop-wallpaper" aria-hidden="true"><div className="wallpaper-circle"/><div className="wallpaper-sparkle sparkle-one">✳</div><div className="wallpaper-sparkle sparkle-two">✿</div><div className="sky-stars">{skyStars.map(([x,y],i)=><i key={i} style={{left:`${x}%`,top:`${y}%`}} />)}</div><div className="string-lights">{Array.from({length:9},(_,i)=><i key={i}/>)}</div></div>
    <div className="mascot-wrap"><div className={`mascot-bubble ${mascotPhrase ? 'show' : ''}`} aria-live="polite">{mascotPhrase}</div><button className="theme-mascot" onClick={talkToMascot} aria-label={dark ? 'Talk to Melon' : 'Talk to Froggo'} title={dark ? 'Talk to Melon' : 'Talk to Froggo'}><img src={dark ? '/images/melon.png' : '/images/froggo.png'} alt="" /></button></div>
    <header className="desktop-top"><a href="#home" className="desktop-brand"><span>g.</span> grace’s little corner</a><div className="top-right"><button className={`theme-switch ${dark ? 'is-night' : 'is-day'}`} onClick={() => { playSound(); setMascotPhrase(''); window.clearTimeout(mascotPhraseTimer.current); setDark(!dark) }} aria-label={dark ? 'Switch to daylight theme' : 'Switch to night theme'} aria-pressed={dark} title={dark ? 'Switch to daylight' : 'Switch to night'}><span className="theme-switch-icon" aria-hidden="true">{dark ? <svg viewBox="0 0 24 24"><path d="M20.2 15.8A8.6 8.6 0 0 1 8.2 3.9 8.7 8.7 0 1 0 20.2 15.8Z"/><path d="m17.5 3 .6 1.8 1.9.7-1.9.6-.6 1.9-.7-1.9-1.8-.6 1.8-.7z"/></svg> : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.8v2.1m0 16.2v2.1M1.8 12h2.1m16.2 0h2.1M4.8 4.8l1.5 1.5m11.4 11.4 1.5 1.5m0-14.4-1.5 1.5M6.3 17.7l-1.5 1.5"/></svg>}</span><span className="theme-switch-copy"><small>THEME</small><b>{dark ? 'NIGHT' : 'DAYLIGHT'}</b></span><span className="theme-switch-track" aria-hidden="true"><i/></span></button><button onClick={() => { setSound(!sound); if (!sound) setTimeout(() => playSound(), 0) }} className="audio-control" aria-label={sound ? 'Sound effects on. Click to turn off.' : 'Sound effects off. Click to turn on.'} title="Sound effects: little clicks when you use the page"><span className="audio-symbol">{sound ? '◖))' : '◖'}</span><small>SFX</small></button><button className={`audio-control ${music ? 'music-on' : ''}`} onClick={toggleMusic} aria-label={music ? 'Background music on. Click to turn off.' : 'Background music off. Click to turn on.'} aria-pressed={music} title="Background music: a soft looping melody"><span className="audio-symbol">♫</span><small>MUSIC</small></button></div></header>
    <section className="desktop-icons" aria-label="Desktop apps">{['about','work','links','faq','fun'].map((id)=><button className={`desktop-icon ${front === id ? 'selected' : ''}`} key={id} onDoubleClick={() => openWindow(id)} onClick={() => openWindow(id)}><span><img src={iconPath(id)} alt="" /></span><b>{id === 'fun' ? 'fun stuff' : id}</b></button>)}</section>
    <div className="desktop-welcome"><div className="welcome-sparkle">✳</div><p className="welcome-small">WELCOME TO MY LITTLE CORNER</p><h1>hi, I’m <em>Grace!</em></h1><p>computer engineering student<br/>who enjoys building software.</p><span className="welcome-hint">tap an app to peek inside <b>↖</b></span></div>
    {open.map((id) => {const config=windows[id];const pos=positions[id] || defaultPosition(id);const size=sizes[id] || {width:Math.min(config.width,window.innerWidth-20),height:Math.min(config.height,window.innerHeight-100)};return <section className={`app-window ${front===id?'in-front':''}`} key={id} style={{left:pos.x,top:pos.y,width:size.width,height:size.height,maxWidth:Math.max(280,window.innerWidth-pos.x-10),zIndex:front===id?20:10+open.indexOf(id)}} onPointerDown={() => setFront(id)} aria-label={config.title}><header className="window-title" onPointerDown={(event)=>startDrag(event,id)}><span className="window-app-icon"><img src={config.icon} alt="" /></span><span>{config.title}</span><span className="window-title-dots">✿ ✿ ✿</span><button className="window-close" onPointerDown={(event)=>event.stopPropagation()} onClick={()=>closeWindow(id)} aria-label="Close window">×</button></header><div className="window-body">{renderContent(id)}</div><footer className="window-status"><span>✿ &nbsp; grace’s desktop</span><span>1 item &nbsp;·&nbsp; happy day!</span></footer><button className="window-resize" onPointerDown={(event)=>startResize(event,id)} onKeyDown={(event)=>resizeWithKeys(event,id)} aria-label={`Resize ${config.title}`} title="Drag or use arrow keys to resize" /></section>})}
    <div className={`desktop-clock ${dark ? 'clock-night' : 'clock-day'}`}><span className="clock-icon">{dark ? '☾' : '☀'}</span><div><small>LOCAL TIME</small><b>{now.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' })}</b><span>{now.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })} · {dark ? 'stargazing hours' : 'sunny day'}</span></div><i>✿</i></div>
    <footer className="dock"><div className="dock-apps">{['about','work','links','faq','fun'].map((id)=><button key={id} className={open.includes(id)?'active':''} onClick={()=>openWindow(id)} aria-label={`Open ${id}`} title={id}><img src={iconPath(id)} alt="" /></button>)}</div><span className="dock-divider"/><button className="dock-home" onClick={()=>{setOpen([]);playSound('close')}} aria-label="Return to desktop and close all windows" title="Return to desktop"><img src="/icons/home.svg" alt="" /></button><span className="dock-name">grace’s desktop</span></footer>
  </main>
}

export default App
