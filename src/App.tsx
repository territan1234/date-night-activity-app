import { useState, useRef, useEffect } from 'react'
import './App.css'

type Category = 'sweat' | 'chill'

interface Activity {
  name: string
  emoji: string
  desc: string
  floats: [string, string, string, string]
}

const DATA: Record<Category, Activity[]> = {
  sweat: [
    { name: 'Cycling at East Coast Park',    emoji: '🚴‍♀️', desc: 'Race each other along the beachfront — loser buys the coconut shake!',              floats: ['🌊', '☀️', '💨', '🏖️'] },
    { name: 'Rollerblading',                 emoji: '🛼',   desc: 'Hold hands, crash gracefully, laugh a lot. The rink is all yours.',                  floats: ['⭐', '💫', '✨', '🌀'] },
    { name: 'Night Walk at Henderson Wave',  emoji: '🌉',   desc: 'Stroll through the sky together. Bring bug spray. Pack the romance.',                floats: ['🌙', '⭐', '🌿', '✨'] },
    { name: 'Darts Competition',             emoji: '🎯',   desc: 'Winner picks the next date night. No pressure… or ALL the pressure.',               floats: ['🏆', '💪', '🎉', '✨'] },
    { name: 'Arcade at Orchard',             emoji: '🕹️',  desc: 'Spend $20, win each other stuffed animals, feel 12 years old again.',               floats: ['🎮', '⭐', '🎊', '💛'] },
    { name: 'Axe Throwing',                  emoji: '🪓',   desc: 'Surprisingly therapeutic. Also surprisingly impressive on a date.',                  floats: ['💪', '🔥', '🎯', '⚡'] },
    { name: 'Smash Room',                    emoji: '🔨',   desc: 'Smash plates, not feelings. All the stress exits here.',                             floats: ['💥', '⚡', '🔥', '😤'] },
    { name: 'Zoo or Night Safari',           emoji: '🦁',   desc: 'Spot animals in the dark. Marvel at nature. Eat overpriced fries.',                 floats: ['🌿', '🦜', '🌙', '🐾'] },
    { name: 'Badminton',                     emoji: '🏸',   desc: 'The rallies go long, but so do the laughs. Bring the competitiveness.',             floats: ['💨', '⭐', '💪', '🏆'] },
    { name: 'Dance at a Club',               emoji: '💃',   desc: "Move to the music. Don't think — just feel it. Find your groove.",                  floats: ['🎵', '✨', '🎶', '🪩'] },
  ],
  chill: [
    { name: 'Cinema — The Projector',            emoji: '🎬',  desc: 'The projector room hits different. Giant screen, tiny world outside.',                      floats: ['🍿', '🌟', '🎭', '💕'] },
    { name: 'Visit a Museum or Gallery',          emoji: '🏛️', desc: 'Pretend to understand modern art together. Giggle. It\'s perfectly okay.',                  floats: ['🖼️', '✨', '🎨', '💭'] },
    { name: 'National Library Deep Dive',         emoji: '📚',  desc: 'Pick a random topic, become experts, then debate it over tea.',                             floats: ['💡', '✨', '📖', '🤓'] },
    { name: 'Discourse Dinner',                   emoji: '🍽️', desc: 'No phones. Real conversation. See what surfaces when you actually talk.',                    floats: ['🕯️', '💬', '❤️', '🌹'] },
    { name: 'Prawning',                           emoji: '🦐',  desc: "It's 2am, you're beside a pond, and you're both completely hooked. Literally.",              floats: ['🌙', '🐟', '⭐', '🎣'] },
    { name: 'Art Jamming or Urban Sketching',     emoji: '🎨',  desc: 'Make questionable art and hang it on the fridge forever. That\'s love.',                    floats: ['🖌️', '🌈', '✨', '💕'] },
    { name: 'Board Game or Console Cafe',         emoji: '🎲',  desc: 'Strategic thinking + snacks + each other = the best kind of quality time.',                 floats: ['♟️', '🎮', '☕', '✨'] },
    { name: 'Karaoke',                            emoji: '🎤',  desc: 'Sing badly. Sing boldly. Sing together. The mic never judges.',                             floats: ['🎵', '🎶', '⭐', '💃'] },
    { name: 'Picnic & Vision Board',              emoji: '🧺',  desc: 'Spread out under the open sky and dream about your future together.',                        floats: ['🌸', '☁️', '💕', '🌿'] },
    { name: 'Vibe Code on Claude',                emoji: '💻',  desc: 'Co-create something together — a tool, a game, a little dream. Build it.',                  floats: ['✨', '🤖', '💡', '🚀'] },
  ],
}

function spawnBurst(cat: Category) {
  const emojis = cat === 'sweat'
    ? ['🔥', '✨', '💥', '⭐', '💪', '🎉', '🏅']
    : ['✨', '💕', '⭐', '🌸', '💜', '🌟', '🎀']
  const cx = window.innerWidth / 2
  const cy = window.innerHeight * 0.38
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div')
    el.className = 'ptcl'
    el.textContent = emojis[i % emojis.length]
    const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    const dist = 70 + Math.random() * 170
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist - 50
    const rot = ((Math.random() - 0.5) * 600) + 'deg'
    el.style.cssText = `left:${cx}px;top:${cy}px;--tx:${tx}px;--ty:${ty}px;--rot:${rot};animation-delay:${i * 0.035}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1600)
  }
}

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'activity'>('landing')
  const [cat, setCat]       = useState<Category | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [animKey, setAnimKey]   = useState(0)
  const usedRef = useRef<Record<Category, number[]>>({ sweat: [], chill: [] })

  function pickRandom(c: Category): Activity {
    const list = DATA[c]
    if (usedRef.current[c].length >= list.length) usedRef.current[c] = []
    const avail = list.map((_, i) => i).filter(i => !usedRef.current[c].includes(i))
    const idx = avail[Math.floor(Math.random() * avail.length)]
    usedRef.current[c].push(idx)
    return list[idx]
  }

  function choose(c: Category) {
    setCat(c)
    setActivity(pickRandom(c))
    setAnimKey(k => k + 1)
    setScreen('activity')
  }

  function spin() {
    if (!cat) return
    setActivity(pickRandom(cat))
    setAnimKey(k => k + 1)
  }

  useEffect(() => {
    if (animKey > 0 && cat) spawnBurst(cat)
  }, [animKey, cat])

  return (
    <>
      {screen === 'landing' && (
        <div id="landing">
          <div className="title-wrap">
            <span className="hearts-row">💕 💕 💕</span>
            <h1>Date Night<br />Picker</h1>
            <p className="subtitle">What's the vibe tonight?</p>
          </div>

          <div className="cards-row">
            <button className="ccard sweat" onClick={() => choose('sweat')}>
              <div className="ccard-icon">🔥</div>
              <h2>Get Your<br />Sweat On</h2>
              <span>Active, adventurous & a little intense</span>
            </button>
            <button className="ccard chill" onClick={() => choose('chill')}>
              <div className="ccard-icon">✨</div>
              <h2>Don't<br />Sweat It</h2>
              <span>Laid-back, cozy & wonderfully chill</span>
            </button>
          </div>

          <p className="foot-hint">tap a card to spin the wheel 🎰</p>
        </div>
      )}

      {screen === 'activity' && cat && activity && (
        <div id="activity" className={cat}>
          <div className="glow g1" />
          <div className="glow g2" />

          <div className="act-inner">
            <div className="badge">
              {cat === 'sweat' ? 'Sweat Mode 🔥' : 'Chill Mode ✨'}
            </div>

            <div key={`illus-${animKey}`} className="illus-wrap">
              <div className="illus-blob">{activity.emoji}</div>
              <span className="flt flt1">{activity.floats[0]}</span>
              <span className="flt flt2">{activity.floats[1]}</span>
              <span className="flt flt3">{activity.floats[2]}</span>
              <span className="flt flt4">{activity.floats[3]}</span>
            </div>

            <div key={`result-${animKey}`} className="result-card">
              <div className="rname">{activity.name}</div>
              <div className="rdesc">{activity.desc}</div>
            </div>

            <div className="btns">
              <button className="btn btn-spin" onClick={spin}>Pick Again 🎲</button>
              <button className="btn btn-back" onClick={() => setScreen('landing')}>← Change</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
