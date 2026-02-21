// ── NAVIGATION ──
const IDS = ['admin','inperson','teen','senior','child','reflection'];

function go(id) {
  IDS.forEach(s => document.getElementById('s-'+s).classList.toggle('on', s===id));
  document.querySelectorAll('.ntab').forEach((t,i) => t.classList.toggle('on', IDS[i]===id));
  window.scrollTo(0,0);
}


// ── VIDEO MINIMIZE / MAXIMIZE (virtual views) ──
function toggleVideoMinimize(view) {
  const layout = document.querySelector(
    view === 'teen' ? '.teen-layout' : view === 'senior' ? '.snr-layout' : '.ch-layout'
  );
  const video = document.querySelector(
    view === 'teen' ? '.teen-video' : view === 'senior' ? '.snr-video' : '.ch-video'
  );
  const btn = (layout && layout.closest('.scr')) ? layout.querySelector('.vctrl-video') : null;
  if (!layout || !video) return;
  layout.classList.toggle('video-minimized');
  video.classList.toggle('video-minimized');
  if (btn) btn.setAttribute('title', video.classList.contains('video-minimized') ? 'Expand video' : 'Minimize video');
}


// ── PHASE TIMER (teen view) ──
const TOTAL = 1200; // 20 min
let secs = 504;     // start at 8:24 remaining
let slowing = false;
let timerInt = null;

function fmt(s) {
  return Math.floor(s/60) + ':' + (s%60).toString().padStart(2,'0');
}

function tickTimer() {
  if (slowing) return;
  if (secs > 0) { secs--; renderTimer(); }
}

function renderTimer() {
  const val  = document.getElementById('pt-val');
  const fill = document.getElementById('pt-fill');
  if (!val || !fill) return;
  val.textContent = fmt(secs);
  const pct = (secs / TOTAL) * 100;
  fill.style.width = pct + '%';
  fill.className = 'pt-fill' + (pct < 25 ? ' urgent' : pct < 40 ? ' warn' : '');
}

function toggleSlow() {
  slowing = !slowing;
  const btn   = document.getElementById('slow-btn');
  const timer = document.getElementById('phase-timer');
  const name  = document.getElementById('pt-name');
  if (!btn || !timer || !name) return;
  if (slowing) {
    btn.textContent = '▶ Resume pace';
    btn.classList.add('slow-on');
    timer.classList.add('slow');
    name.textContent = 'Paused — taking our time';
    name.classList.add('slow');
  } else {
    btn.textContent = '⏸ Slow down';
    btn.classList.remove('slow-on');
    timer.classList.remove('slow');
    name.textContent = 'Together Time';
    name.classList.remove('slow');
  }
}

timerInt = setInterval(tickTimer, 1000);
renderTimer();


// ── READINESS — distributed across views ──
// Marcus is already ready (self). Dorothy and Liam signal from their own views.
const ready = { dorothy: false, liam: false };

function markReady(person) {
  ready[person] = true;

  // Sidebar status
  const ps  = document.getElementById('ps-'+person);
  const sig = document.getElementById('psig-'+person);
  if (ps)  ps.textContent = 'Ready ✓';
  if (sig) sig.className = 'psig sig-on';

  // Video tile ring + check
  const ring = document.getElementById('vr-'+person);
  const ck   = document.getElementById('vc-'+person);
  if (ring) ring.classList.add('ready');
  if (ck)   ck.classList.add('show');

  // Update counter and maybe unlock
  const count   = 1 + (ready.dorothy ? 1 : 0) + (ready.liam ? 1 : 0);
  const countEl = document.getElementById('ready-count');
  if (countEl) countEl.textContent = count + ' of 3 ready to move on';
  if (ready.dorothy && ready.liam) {
    const btn = document.getElementById('next-btn');
    if (btn) btn.classList.add('unlocked');
  }
}

function tryAdvance() {
  const btn = document.getElementById('next-btn');
  if (!btn || !btn.classList.contains('unlocked')) return;
  btn.textContent = '✓ Moving on...';
  btn.style.background = 'var(--sky)';
  btn.style.borderColor = 'var(--sky)';
}


// ── SENIOR: optional note + ready signal ──
function snrReady() {
  const btn = document.getElementById('snr-btn');
  if (!btn) return;
  btn.textContent = 'Ready ✓';
  btn.classList.add('done');
  btn.onclick = null;
  markReady('dorothy');
}


// ── CHILD: tap a reaction while talking, then signal done ──
function react(btn, emoji) {
  document.querySelectorAll('.ch-react').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 2000);
}

function childReady() {
  const btn = document.getElementById('ch-share-btn');
  if (!btn) return;
  btn.textContent = 'Done ✓';
  btn.classList.add('done');
  btn.onclick = null;

  markReady('liam');

  // Update the shared slot in Marcus's call
  const slot = document.getElementById('shared-slot');
  const icon = document.getElementById('shared-icon');
  const lbl  = document.getElementById('shared-lbl');
  if (slot) slot.classList.add('has-content');
  if (icon) icon.textContent = '💬';
  if (lbl)  lbl.textContent = 'Liam shared his story';
}


// ── IN-PERSON PHASE CARDS ──
const PH = [

// ── PHASE 0: ARRIVAL ──
`<div class="sh-ses">Session 4 · Arrival</div>
<div class="sh-t">Welcome back.</div>
<div class="sh-i">You've met three times now. Get comfortable!</div>
<div class="fac-prep">
  <div class="fac-prep-lbl"><span class="n-marcus">Marcus</span> · before you begin</div>
  <div class="fac-prep-t">Have a story ready — something you really wanted to do but couldn't, until you kept trying. Share it first to set the tone!</div>
</div>
<div class="ph-2col">
  <div>
    <div class="ses-brief">
      <div class="ses-brief-idea">"It takes time and practice to learn new things."</div>
      <div class="ses-brief-tags">
        <span class="sb-tag sb-tag--plum">patience</span>
        <span class="sb-tag sb-tag--berry">frustration</span>
        <span class="sb-tag sb-tag--sun">mastery</span>
        <span class="sb-tag sb-tag--sky">encouragement</span>
      </div>
    </div>
  </div>
  <div>
    <div class="ab">
      <div class="ab-step">Step 01</div>
      <div class="ab-p">Start with <span class="n-liam">Liam</span>.</div>
      <div class="ab-i"><span class="n-marcus">Marcus</span>, ask him: <em>"What's one thing you've been trying really hard to get better at this week?"</em> Let him answer fully. Then <span class="n-dorothy">Dorothy</span> — same question, but from your life.</div>
    </div>
    <div class="ab">
      <div class="ab-step">Step 02</div>
      <div class="ab-p">Prime for the video.</div>
      <div class="ab-i">Each person thinks of one thing they can't do <em>yet</em>. Hold onto it — you'll come back to it after you watch.</div>
    </div>
    <div class="rdy-sec">
      <div class="rdy-lbl">Ready to watch?</div>
      <div class="rdy-row">
        <div class="rp"><button class="rb" id="rd0" onclick="tr('rd0')">🤔</button><div class="rn"><span class="n-dorothy">Dorothy</span></div></div>
        <div class="rp"><button class="rb y" id="rm0" onclick="tr('rm0')">👍</button><div class="rn"><span class="n-marcus">Marcus</span></div></div>
        <div class="rp"><button class="rb" id="rl0" onclick="tr('rl0')">🤔</button><div class="rn"><span class="n-liam">Liam</span></div></div>
      </div>
    </div>
  </div>
</div>
<div class="card-nav"><button class="btn-bk" style="visibility:hidden">←</button><button class="btn-nx" onclick="ph(1)">Start the video →</button></div>`,

// ── PHASE 1: WATCH TOGETHER ──
`<div class="sh-ses">Session 4 · Watch Together</div>
<div class="sh-t">The Power of Yet</div>
<div class="sh-i">Watch this together, then talk about it.</div>
<div class="ph-2col ph-2col--55">
  <div class="ph-vid-col">
    <div class="vid-lg" id="vid-main" onclick="playVid(event)">
      <button class="vid-lg-play" id="vid-play-btn" type="button">▶</button>
      <div class="vid-lg-title">The Power of Yet · Sesame Street</div>
      <div class="vid-lg-meta" id="vid-meta">3 min · Watch all the way through</div>
    </div>
  </div>
  <div>
    <div class="vid-about">
      <div class="vid-about-credit">Janelle Monáe with Elmo · Sesame Street · 3 min</div>
      <div class="vid-about-note">This song names the feeling of not being there yet without making it feel like failure. Let it land before you talk about it.</div>
    </div>
    <div class="watch-for">
      <div class="wf-lbl">While you watch, notice</div>
      <div class="wf-items">
        <div class="wf-it">What does Elmo want to do but can't do yet?</div>
        <div class="wf-it">How does he feel about it? Does that feeling feel familiar?</div>
        <div class="wf-it">What changes his mind about giving up?</div>
      </div>
    </div>
  </div>
</div>
<div class="card-nav"><button class="btn-bk" onclick="ph(0)">← Back</button><button class="btn-nx" onclick="ph(2)">We've watched it →</button></div>`,

// ── PHASE 2: SHARE & CONNECT ──
`<div class="sh-ses">Session 4 · Share & Connect</div>
<div class="sh-t">Now talk about it.</div>
<div class="sh-i"><span class="n-marcus">Marcus</span>, lead the conversation. Use as many of these as you need.</div>
<div class="ph-3col">
  <div class="dp-col">
    <div class="dp-num-badge">01 · Start with <span class="n-liam">Liam</span></div>
    <div class="dp-q">"What was Elmo trying to do? Did you ever feel like that?"</div>
    <div class="dp-hint">Let <span class="n-liam">Liam</span> answer without rushing. Then open it to <span class="n-dorothy">Dorothy</span> and <span class="n-marcus">Marcus</span>.</div>
  </div>
  <div class="dp-col">
    <div class="dp-num-badge">02 · Invite <span class="n-dorothy">Dorothy</span></div>
    <div class="dp-q">"<span class="n-dorothy">Dorothy</span>, what's something you couldn't do — and then could?"</div>
    <div class="dp-hint">This is where the generations meet. Give her room. <span class="n-liam">Liam</span> may be surprised by her answer.</div>
  </div>
  <div class="dp-col">
    <div class="dp-num-badge">03 · Go around</div>
    <div class="dp-q">"What's something you can't do <em>yet</em>?"</div>
    <div class="dp-hint">Everyone answers, including <span class="n-marcus">Marcus</span>. That word "yet" does a lot — don't rush past it.</div>
  </div>
</div>
<div class="spark-strip">
  <span class="spark-strip-tag">✦ Optional</span>
  <span class="spark-strip-label">Try it together:</span>
  <span class="spark-strip-d">Stand on one foot, one finger on your nose. See how many tries to hold it for five seconds. Try counting out loud!.</span>
</div>
<div class="rdy-sec">
  <div class="rdy-lbl">Ready to close?</div>
  <div class="rdy-row">
    <div class="rp"><button class="rb" id="rd2" onclick="tr('rd2')">🤔</button><div class="rn"><span class="n-dorothy">Dorothy</span></div></div>
    <div class="rp"><button class="rb y" id="rm2" onclick="tr('rm2')">👍</button><div class="rn"><span class="n-marcus">Marcus</span></div></div>
    <div class="rp"><button class="rb" id="rl2" onclick="tr('rl2')">🤔</button><div class="rn"><span class="n-liam">Liam</span></div></div>
  </div>
</div>
<div class="card-nav"><button class="btn-bk" onclick="ph(1)">← Back</button><button class="btn-nx" onclick="ph(3)">Closing →</button></div>`,

// ── PHASE 3: CLOSE ──
`<div class="sh-ses">Session 4 · Close</div>
<div class="sh-t">One word each.</div>
<div class="sh-i">Every session ends the same way. Say it out loud, then type it here.</div>
<div class="ab">
  <div class="ab-p">How do you feel right now?</div>
  <div class="ab-i">Go around the table. First word that comes to mind — no explaining it!</div>
</div>
<div class="word-row">
  <div class="word-slot"><div class="word-lbl"><span class="n-dorothy">Dorothy</span></div><input class="word-input" placeholder="one word..." /></div>
  <div class="word-slot"><div class="word-lbl"><span class="n-marcus">Marcus</span></div><input class="word-input" placeholder="one word..." /></div>
  <div class="word-slot"><div class="word-lbl"><span class="n-liam">Liam</span></div><input class="word-input" placeholder="one word..." /></div>
</div>
<div class="next-sesh">
  <div class="ns-icon">🤝</div>
  <div class="ns-info">
    <div class="ns-lbl">Coming Up · Session 5</div>
    <div class="ns-t">Try a Little Kindness</div>
    <div class="ns-d"><span class="n-dorothy">Dorothy</span>, come with an act of kindness that moved you. <span class="n-marcus">Marcus</span> — think about how you'd explain kindness to a 6-year-old.</div>
  </div>
</div>
<div class="card-nav"><button class="btn-bk" onclick="ph(2)">← Back</button><button class="btn-nx" onclick="endSession()">End session ✓</button></div>`

];

function ph(i) {
  document.querySelectorAll('.pht').forEach((t,j) => t.classList.toggle('on', j===i));
  document.getElementById('sh-card').innerHTML = PH[i];
  if (i === 1) initVid();
}

function tr(id) {
  const b = document.getElementById(id);
  if (!b) return;
  const y = b.classList.contains('y');
  b.classList.toggle('y', !y);
  b.textContent = y ? '🤔' : '👍';
}


// ── IN-PERSON VIDEO OVERLAY ──
const VID_YOUTUBE_ID = 'QUHxWhvb4ng'; // Sesame Street — The Power of Yet (Janelle Monáe)
let vidPlaying = false;

function initVid() {
  vidPlaying = false;
  const overlay = document.getElementById('ip-video-overlay');
  const iframe  = document.getElementById('ip-video-iframe');
  if (overlay) overlay.classList.remove('is-open');
  if (iframe)  iframe.removeAttribute('src');
}

function playVid(ev) {
  if (ev && ev.target.closest('.ip-video-overlay-shrink')) return;
  const overlay = document.getElementById('ip-video-overlay');
  const iframe  = document.getElementById('ip-video-iframe');
  if (!overlay || overlay.classList.contains('is-open')) return;
  vidPlaying = true;
  overlay.classList.add('is-open');
  if (iframe) iframe.setAttribute('src', 'https://www.youtube.com/embed/' + VID_YOUTUBE_ID + '?autoplay=1&rel=0');
}

function collapseVid(ev) {
  if (ev) ev.stopPropagation();
  const overlay = document.getElementById('ip-video-overlay');
  const iframe  = document.getElementById('ip-video-iframe');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  if (iframe) iframe.removeAttribute('src');
  vidPlaying = false;
}


// ── INIT — start on Watch Together so the video is immediately visible ──
ph(1);


// ── TRIAD DETAIL MODAL ──

const TRIADS = [
  {
    id: 'A',
    colorRgb: '91,187,111',
    members: [
      { name: 'Dorothy', emoji: '👩‍🦳', age: 68, bg: '#E8F5EB', cls: 'n-dorothy' },
      { name: 'Marcus',  emoji: '🧑',   age: 16, bg: '#E8F0FB', cls: 'n-marcus'  },
      { name: 'Liam',    emoji: '👦',   age:  6, bg: '#FEF3E2', cls: 'n-liam'    },
    ],
    status: 'Active',
    statusCls: 'bg-a',
    next: 'Session 4 · Today',
    sessions: [
      { num: 1, theme: "Hello, I'm Me",        state: 'done'     },
      { num: 2, theme: "Something I Love",      state: 'done'     },
      { num: 3, theme: "Hard Days",             state: 'done'     },
      { num: 4, theme: "Power of Yet",          state: 'current'  },
      { num: 5, theme: "Try a Kindness",        state: 'upcoming' },
      { num: 6, theme: "My Neighborhood",       state: 'upcoming' },
      { num: 7, theme: "Making Things",         state: 'upcoming' },
      { num: 8, theme: "Looking Back",          state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 100, color: 'var(--grass)' },
      { label: 'Reflection depth',        pct: 82,  color: 'var(--sky)'   },
      { label: 'Teen confidence arc',     pct: 78,  color: 'var(--plum)'  },
      { label: 'Cross-gen participation', pct: 96,  color: 'var(--sun)'   },
    ],
    signal: {
      warn: false,
      icon: '💡',
      text: "Facilitation scaffolding has been automatically reduced for Session 4 — this triad's dynamic is mature enough for open prompts. Marcus is advancing phases faster each session, a strong sign of growing confidence.",
    },
    reflections: [
      { author: 'Marcus',  cls: 'n-marcus',  quote: "I didn't expect Dorothy to have a story like that. It made me think differently about what hard actually means." },
      { author: 'Dorothy', cls: 'n-dorothy', quote: "Watching Marcus pause for Liam and not rush to fill the silence — that's real patience. He's learning something I couldn't have taught him directly." },
    ],
  },
  {
    id: 'B',
    colorRgb: '74,191,206',
    members: [
      { name: 'Harold', emoji: '👴', age: 72, bg: '#E2F4F7' },
      { name: 'Priya',  emoji: '👩', age: 14, bg: '#F3EEF8' },
      { name: 'Sofia',  emoji: '👧', age:  7, bg: '#FFF0F0' },
    ],
    status: 'Active',
    statusCls: 'bg-a',
    next: 'Session 6 · Tomorrow',
    sessions: [
      { num: 1, theme: "Hello, I'm Me",        state: 'done'     },
      { num: 2, theme: "Something I Love",      state: 'done'     },
      { num: 3, theme: "Hard Days",             state: 'done'     },
      { num: 4, theme: "Power of Yet",          state: 'done'     },
      { num: 5, theme: "Try a Kindness",        state: 'done'     },
      { num: 6, theme: "My Neighborhood",       state: 'current'  },
      { num: 7, theme: "Making Things",         state: 'upcoming' },
      { num: 8, theme: "Looking Back",          state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 100, color: 'var(--grass)' },
      { label: 'Reflection depth',        pct: 91,  color: 'var(--sky)'   },
      { label: 'Teen confidence arc',     pct: 88,  color: 'var(--plum)'  },
      { label: 'Cross-gen participation', pct: 95,  color: 'var(--sun)'   },
    ],
    signal: {
      warn: false,
      icon: '💡',
      text: "Priya consistently signals ready first — her pacing instinct is strong. Session 6 is a natural moment to let her explore a longer discussion phase without the default time prompts.",
    },
    reflections: [
      { author: 'Priya',  quote: "Harold told a story about his street growing up that I keep thinking about. It's so different from mine but also kind of the same?" },
      { author: 'Harold', quote: "Sofia asked me if I had friends who looked different from me when I was young. I wasn't prepared for that — but I'm glad she asked." },
    ],
  },
  {
    id: 'C',
    colorRgb: '245,166,35',
    members: [
      { name: 'Ruth',  emoji: '👵', age: 70, bg: '#FFF3E0' },
      { name: 'James', emoji: '🧒', age: 15, bg: '#E8F5EB' },
      { name: 'Eli',   emoji: '👦', age:  5, bg: '#E8F0FB' },
    ],
    status: 'Check in',
    statusCls: 'bg-p',
    next: '12 days since last session',
    sessions: [
      { num: 1, theme: "Hello, I'm Me",        state: 'done'     },
      { num: 2, theme: "Something I Love",      state: 'done'     },
      { num: 3, theme: "Hard Days",             state: 'paused'   },
      { num: 4, theme: "Power of Yet",          state: 'upcoming' },
      { num: 5, theme: "Try a Kindness",        state: 'upcoming' },
      { num: 6, theme: "My Neighborhood",       state: 'upcoming' },
      { num: 7, theme: "Making Things",         state: 'upcoming' },
      { num: 8, theme: "Looking Back",          state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 62, color: 'var(--sun)'   },
      { label: 'Reflection depth',        pct: 55, color: 'var(--sky)'   },
      { label: 'Teen confidence arc',     pct: 49, color: 'var(--plum)'  },
      { label: 'Cross-gen participation', pct: 71, color: 'var(--grass)' },
    ],
    signal: {
      warn: true,
      icon: '⚠️',
      text: "This triad hasn't met in 12 days. James hasn't opened the platform since Session 2. A short personal check-in before rescheduling tends to work better than a reminder notification here.",
    },
    reflections: [
      { author: 'Ruth', quote: "It felt a bit rushed at the end. I wasn't sure James was ready to move to the next part, but we did anyway." },
    ],
  },
  {
    id: 'D',
    colorRgb: '123,94,167',
    members: [
      { name: 'Gloria', emoji: '👩‍🦳', age: 66, bg: '#F3EEF8' },
      { name: 'Devon',  emoji: '👦',   age: 13, bg: '#E2F4F7' },
      { name: 'Amara',  emoji: '👧',   age:  6, bg: '#FEF3E2' },
    ],
    status: 'Starting',
    statusCls: 'bg-a',
    next: 'Session 1 · Next week',
    sessions: [
      { num: 1, theme: "Hello, I'm Me",        state: 'current'  },
      { num: 2, theme: "Something I Love",      state: 'upcoming' },
      { num: 3, theme: "Hard Days",             state: 'upcoming' },
      { num: 4, theme: "Power of Yet",          state: 'upcoming' },
      { num: 5, theme: "Try a Kindness",        state: 'upcoming' },
      { num: 6, theme: "My Neighborhood",       state: 'upcoming' },
      { num: 7, theme: "Making Things",         state: 'upcoming' },
      { num: 8, theme: "Looking Back",          state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 0, color: 'var(--grass)' },
      { label: 'Reflection depth',        pct: 0, color: 'var(--sky)'   },
      { label: 'Teen confidence arc',     pct: 0, color: 'var(--plum)'  },
      { label: 'Cross-gen participation', pct: 0, color: 'var(--sun)'   },
    ],
    signal: {
      warn: false,
      icon: '✨',
      text: "Devon's intake form flagged \"doesn't know what to say to old people\" — a completely normal entry point. Session 1 scaffolding is designed to dissolve that awkwardness before it becomes a pattern.",
    },
    reflections: [],
  },
];


function openTriadModal(idx) {
  const t  = TRIADS[idx];
  const bg = document.getElementById('tcm-bg');

  // Avatars
  document.getElementById('tcm-av-row').innerHTML = t.members.map(m =>
    `<div class="tcm-av" style="background:${m.bg}">${m.emoji}</div>`
  ).join('');

  // ID + status badge
  document.getElementById('tcm-id-row').innerHTML =
    `<span class="tcm-id">Triad ${t.id}</span><span class="bg ${t.statusCls}">${t.status}</span>`;

  // Title with person-color spans where available
  document.getElementById('tcm-ttl').innerHTML = t.members.map((m, i) => {
    const name = m.cls ? `<span class="${m.cls}">${m.name}</span>` : m.name;
    if (i === 0) return name;
    if (i === t.members.length - 1) return ` & ${name}`;
    return `, ${name}`;
  }).join('');

  // Ages + next
  document.getElementById('tcm-meta').textContent =
    t.members.map(m => m.age).join(' · ') + '  ·  ' + t.next;

  // Header glow (triad accent color)
  document.getElementById('tcm-hd-glow').style.background =
    `radial-gradient(circle at 82% 35%, rgba(${t.colorRgb},.22), transparent 58%)`;

  // ── Body ──

  // Session arc
  const arcHTML = t.sessions.map(s => {
    const dotStyle = s.state === 'done'
      ? `style="background:rgba(${t.colorRgb},1);color:#fff"`
      : '';
    const dotLabel = s.state === 'done' ? '✓' : s.num;
    return `<div class="tcm-arc-it ${s.state}">
      <div class="tcm-arc-dot" ${dotStyle}>${dotLabel}</div>
      <div class="tcm-arc-nm">${s.theme}</div>
    </div>`;
  }).join('');

  // Health bars
  const healthHTML = t.health.map(h =>
    `<div class="tcm-bar-row">
      <div class="tcm-bar-lbl">${h.label}</div>
      <div class="tcm-bar-track"><div class="tcm-bar-fill" style="width:${h.pct}%;background:${h.color}"></div></div>
      <div class="tcm-bar-pct">${h.pct > 0 ? h.pct + '%' : '—'}</div>
    </div>`
  ).join('');

  // Reflection quotes
  let reflHTML = '';
  if (t.reflections && t.reflections.length) {
    const doneCount = t.sessions.filter(s => s.state === 'done').length;
    const quotes = t.reflections.map(r => {
      const authorLabel = r.cls
        ? `<span class="${r.cls}">${r.author}</span>`
        : r.author;
      return `<div class="tcm-quote">
        <div class="tcm-quote-text">"${r.quote}"</div>
        <div class="tcm-quote-author">— ${authorLabel} · after Session ${doneCount}</div>
      </div>`;
    }).join('');
    reflHTML = `<div class="tcm-sec">
      <div class="tcm-sec-lbl">Last Session · Reflection Highlights</div>
      ${quotes}
    </div>`;
  }

  // Actions
  const actHTML = `<div class="tcm-actions">
    <button class="tcm-act-btn primary" onclick="closeTriadModal();go('teen')">Open teen view</button>
    <button class="tcm-act-btn">Send check-in</button>
    <button class="tcm-act-btn">Download report</button>
  </div>`;

  document.getElementById('tcm-body').innerHTML = `
    <div class="tcm-sec">
      <div class="tcm-sec-lbl">Session Arc</div>
      <div class="tcm-arc">${arcHTML}</div>
    </div>
    <div class="tcm-sec">
      <div class="tcm-sec-lbl">Triad Health</div>
      ${healthHTML}
    </div>
    ${reflHTML}
    ${actHTML}
  `;

  bg.classList.add('open');
  document.addEventListener('keydown', tcmEscListener);
}

function closeTriadModal() {
  document.getElementById('tcm-bg').classList.remove('open');
  document.removeEventListener('keydown', tcmEscListener);
}

function tcmBgClick(e) {
  if (e.target === document.getElementById('tcm-bg')) closeTriadModal();
}

function tcmEscListener(e) {
  if (e.key === 'Escape') closeTriadModal();
}


// ── SESSION END SCREEN ──

function endSession() {
  const screen  = document.getElementById('end-screen');
  const wordsEl = document.getElementById('end-words');
  const savedEl = document.getElementById('end-saved');

  // Collect the three one-word ritual inputs
  const inputs = document.querySelectorAll('.word-input');
  const people = [
    { name: 'Dorothy', cls: 'n-dorothy' },
    { name: 'Marcus',  cls: 'n-marcus'  },
    { name: 'Liam',    cls: 'n-liam'    },
  ];

  if (wordsEl) {
    const filled = Array.from(inputs)
      .map((inp, i) => ({ val: inp.value.trim(), ...people[i] }))
      .filter(w => w.val);

    if (filled.length) {
      wordsEl.innerHTML =
        `<div class="ew-lbl">Your words from today</div>` +
        `<div class="ew-chips">` +
        filled.map(w =>
          `<div class="ew-chip"><span class="${w.cls}">${w.name}</span> · <em>${w.val}</em></div>`
        ).join('') +
        `</div>`;
    }
  }

  // Timestamp
  if (savedEl) {
    const now = new Date();
    savedEl.textContent = 'Saved · ' + now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  screen.classList.add('open');
  launchConfetti();
}

function closeEndScreen() {
  document.getElementById('end-screen').classList.remove('open');
  go('admin');
}

function launchConfetti() {
  const screen = document.getElementById('end-screen');
  const colors = [
    '#F5A623', '#F5A623',          // sun (more frequent — warmest)
    '#4ABFCE', '#5BBB6F',          // sky, grass
    '#7B5EA7', '#E05C5C',          // plum, berry
    '#FEF9F1', '#FEF9F1',          // cream specks
  ];

  // Remove any leftover pieces from a previous run
  screen.querySelectorAll('.confetti-piece').forEach(el => el.remove());

  for (let i = 0; i < 60; i++) {
    const el       = document.createElement('div');
    el.className   = 'confetti-piece';
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const isSlim   = Math.random() < .28;
    const isCircle = !isSlim && Math.random() < .3;
    const size     = 5 + Math.random() * 8;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 1.6;
    const dur      = 2.4 + Math.random() * 2;

    el.style.cssText = `
      background: ${color};
      left: ${left}%;
      width: ${isSlim ? size * .35 : size}px;
      height: ${isSlim ? size * 3 : size}px;
      border-radius: ${isCircle ? '50%' : '2px'};
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    screen.appendChild(el);
    setTimeout(() => el.remove(), (delay + dur + .3) * 1000);
  }
}
