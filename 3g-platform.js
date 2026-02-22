// ── NAVIGATION ──
const IDS = ['admin','inperson','teen','senior','child','reflection'];

function go(id) {
  IDS.forEach(s => document.getElementById('s-'+s).classList.toggle('on', s===id));
  document.querySelectorAll('.ntab').forEach((t,i) => t.classList.toggle('on', IDS[i]===id));
  document.getElementById('end-screen').classList.remove('open');
  if (id === 'inperson') ph(0);
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

function burstSparkles(btn) {
  const emojis = ['✨','🌟','💫','⭐','🎉','🎊','🌈','💥','🦄','🍭'];
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('span');
    el.className = 'ch-sparkle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / 18) * 2 * Math.PI + Math.random() * .5;
    const dist  = 60 + Math.random() * 80;
    el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    el.style.setProperty('--dr', `${(Math.random() - .5) * 360}deg`);
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.fontSize = (12 + Math.random() * 10) + 'px';
    el.style.animationDelay = (Math.random() * .12) + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function childReady() {
  const btn = document.getElementById('ch-share-btn');
  if (!btn) return;
  burstSparkles(btn);
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
<div class="card-nav"><button class="btn-bk" onclick="ph(2)">← Back</button><button class="btn-nx" onclick="clickComplete(event,'endSession')">End session ✓</button></div>`

];

function ph(i) {
  document.querySelectorAll('.pht').forEach((t,j) => t.classList.toggle('on', j===i));
  document.getElementById('sh-card').innerHTML = PH[i];
  if (i === 1) initVid();
}

function prevPhase() {
  const tabs = Array.from(document.querySelectorAll('.pht'));
  const cur  = tabs.findIndex(t => t.classList.contains('on'));
  if (cur > 0) ph(cur - 1);
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


// ── VIRTUAL SESSION PHASES ──
// Arc dots in teen sidebar are clickable — vph(i) syncs all three virtual views.

let curVph = 2;
const VPH_COLORS = ['#F5A623', '#E05C5C', '#F07C2E', '#65E97B', '#40BFFF'];

function vph(i) {
  curVph = i;

  // Update session arc dots in teen sidebar
  document.querySelectorAll('#s-teen .arc-it').forEach((el, j) => {
    el.className = 'arc-it' + (j < i ? ' done' : j === i ? ' now' : '');
    const dot = el.querySelector('.arc-dot');
    if (dot) dot.style.background = j <= i ? VPH_COLORS[j] : 'rgba(255,255,255,.1)';
  });

  // Show phase timer only during Together Time
  const timer = document.getElementById('phase-timer');
  if (timer) timer.style.display = i === 2 ? '' : 'none';

  // Render phase content in each virtual view
  const tpc = document.getElementById('teen-phase-content');
  if (tpc) tpc.innerHTML = vphTeenHTML(i);

  const snrCard = document.getElementById('snr-card-content');
  if (snrCard) snrCard.innerHTML = vphSnrHTML(i);

  const childContent = document.getElementById('child-phase-content');
  if (childContent) childContent.innerHTML = vphChildHTML(i);
}

function vphTeenHTML(i) {
  const phases = [
    {
      tag: 'Arrival & Spark',
      prompt: 'Get everyone settled and set the tone.',
      instr: `Welcome <span class="n-dorothy">Dorothy</span> and <span class="n-liam">Liam</span> by name. Check they can hear you. Then ask: <em>"How's everyone doing today?"</em> — give <span class="n-liam">Liam</span> room to answer first.`,
      intent: `Your energy in the first 60 seconds sets the tone for the whole call. Be warm and real — <span class="n-liam">Liam</span> is reading the room before he says a word.`,
      prev: null, next: 1
    },
    {
      tag: 'Sesame Video',
      prompt: 'Share your screen and play the video together.',
      instr: `Hit share screen, then start the video. No talking during — let everyone watch all the way through. After it ends, <strong>pause before asking anything.</strong> Give the silence a moment to land.`,
      intent: `The video does the heavy lifting — Elmo makes it safe to talk about frustration and trying. Don't rush past the quiet after it ends. That pause is the session working.`,
      prev: 0, next: 2
    },
    {
      tag: 'Together Time',
      prompt: 'Share a time you had to keep trying — and how it felt to finally get it.',
      instr: `Go first with your own story. Then invite <span class="n-dorothy">Dorothy</span>. Once she's done, bring <span class="n-liam">Liam</span> in by asking about something he's working on right now.`,
      intent: `<span class="n-dorothy">Dorothy</span> likely has a story that will genuinely surprise <span class="n-liam">Liam</span>. Give her space. If she pauses, don't rush to fill it — silence here is the session working.`,
      prev: 1, next: 3
    },
    {
      tag: 'Activity Together',
      prompt: 'Try it together: stand on one foot, finger on your nose.',
      instr: `Everyone plays — including you. Count out loud: <em>"3, 2, 1, go!"</em> See how many tries before each person holds it for 5 seconds. Let yourself wobble first.`,
      intent: `Struggling together breaks hierarchy. <span class="n-liam">Liam</span> needs to see that adults don't always get things right either. That's the whole lesson in this moment.`,
      prev: 2, next: 4
    },
    {
      tag: 'Closing Ritual',
      prompt: 'One word from each person. Then say a real goodbye.',
      instr: `Ask: <em>"One word — how do you feel right now? No explaining."</em> Let <span class="n-liam">Liam</span> go first, then <span class="n-dorothy">Dorothy</span>, then you. Close with: <em>"Same time next week?"</em>`,
      intent: `Ritual endings matter as much as openings. <span class="n-liam">Liam</span> is learning how to close things warmly — by watching you do it well.`,
      prev: 3, next: null
    }
  ];

  const p = phases[i];
  const navLabels = ['Arrival', 'Video', 'Share', 'Activity', 'Close'];
  const backBtn = p.prev !== null
    ? `<button class="tc-btn" onclick="vph(${p.prev})">← ${navLabels[p.prev]}</button>`
    : `<button class="tc-btn" style="visibility:hidden">←</button>`;
  const fwdBtn = p.next !== null
    ? `<button class="tc-btn" onclick="vph(${p.next})">${navLabels[p.next]} →</button>`
    : '';

  return `
    <div class="t-phase-tag">● ${p.tag}</div>
    <div class="t-prompt">${p.prompt}</div>
    <div class="t-instr">${p.instr}</div>
    <div class="intent">
      <div class="int-icon">🧭</div>
      <div>
        <div class="int-lbl">What this moment is for</div>
        <div class="int-txt">${p.intent}</div>
      </div>
    </div>
    <div class="t-ctrls">${backBtn}${fwdBtn ? `<span style="flex:1"></span>${fwdBtn}` : ''}</div>
  `;
}

function vphSnrHTML(i) {
  const cards = [
    // 0: Arrival
    `<div class="snr-g"><span class="n-marcus">Marcus</span> is getting started</div>
     <div class="snr-q">Say hello and get settled.</div>
     <div class="snr-ctx">This is your fourth session together. You know each other a bit now — let that show when you greet everyone.</div>
     <button class="snr-btn" id="snr-btn" onclick="snrReady()">Ready to begin</button>`,
    // 1: Video
    `<div class="snr-g"><span class="n-marcus">Marcus</span> is sharing his screen</div>
     <div class="snr-q">Watch the Sesame video together.</div>
     <div class="snr-ctx">No need to say anything while it plays. After the video, Marcus will ask what everyone noticed. Jot down anything that sticks with you.</div>
     <textarea class="snr-note" placeholder="Something that surprised you or stayed with you..."></textarea>`,
    // 2: Share & Connect
    `<div class="snr-g"><span class="n-marcus">Marcus</span> is asking everyone to share</div>
     <div class="snr-q">Tell us about a time you had to keep trying.</div>
     <div class="snr-ctx">Think of something that took patience. How did it feel while you were in it? How did it feel when it finally worked?</div>
     <textarea class="snr-note" id="snr-note" placeholder="Jot something down to help you remember... (optional)"></textarea>
     <button class="snr-btn" id="snr-btn" onclick="snrReady()">Ready to share</button>`,
    // 3: Activity
    `<div class="snr-g">Activity time with <span class="n-marcus">Marcus</span> & <span class="n-liam">Liam</span></div>
     <div class="snr-q">Try the balance game together! 🦶</div>
     <div class="snr-ctx">Stand on one foot with your finger on your nose. See how many tries before you can hold it for 5 seconds. It's encouraged — expected, even — to wobble.</div>
     <button class="snr-btn" id="snr-btn" onclick="snrReady()">Done with the game</button>`,
    // 4: Closing
    `<div class="snr-g">Time to close the session</div>
     <div class="snr-q">One word that captures how today felt.</div>
     <div class="snr-ctx"><span class="n-marcus">Marcus</span> will go around. Just say your word out loud when it's your turn — no need to explain it.</div>
     <textarea class="snr-note" placeholder="Your word... (e.g. hopeful, surprised, warm)"></textarea>
     <button class="snr-btn" id="snr-btn" onclick="snrReady()">I said my word ✓</button>`
  ];
  return cards[i];
}

function vphChildHTML(i) {
  const panels = [
    // 0: Arrival
    `<div class="ch-title">You're on! 👋</div>
     <div class="ch-sub"><span class="n-dorothy">Dorothy</span> and <span class="n-marcus">Marcus</span> can see and hear you.</div>
     <div class="ch-card">
       <div class="ch-prompt-lbl">Say hello!</div>
       <div class="ch-prompt-q">Wave to Dorothy and Marcus! 👋</div>
       <div class="ch-reactions" id="ch-reactions">
         <button class="ch-react" onclick="react(this,'👋')">👋</button>
         <button class="ch-react" onclick="react(this,'😄')">😄</button>
         <button class="ch-react" onclick="react(this,'🤩')">🤩</button>
         <button class="ch-react" onclick="react(this,'😊')">😊</button>
       </div>
     </div>`,
    // 1: Video
    `<div class="ch-title">Watch time! 🎬</div>
     <div class="ch-sub"><span class="n-marcus">Marcus</span> is playing a Sesame Street video!</div>
     <div class="ch-card">
       <div class="ch-prompt-lbl">Look at Marcus's screen</div>
       <div class="ch-prompt-q">What do you notice? 👀</div>
       <div class="ch-reactions" id="ch-reactions">
         <button class="ch-react" onclick="react(this,'👀')">👀</button>
         <button class="ch-react" onclick="react(this,'😮')">😮</button>
         <button class="ch-react" onclick="react(this,'😂')">😂</button>
         <button class="ch-react" onclick="react(this,'🎵')">🎵</button>
       </div>
     </div>`,
    // 2: Share & Connect
    `<div class="ch-title">You're on! 👋</div>
     <div class="ch-sub"><span class="n-dorothy">Dorothy</span> and <span class="n-marcus">Marcus</span> can see and hear you.</div>
     <div class="ch-card">
       <div class="ch-prompt-lbl"><span class="n-marcus">Marcus</span> is asking:</div>
       <div class="ch-prompt-q">"What's something you're working really hard on?"</div>
       <div class="ch-reactions" id="ch-reactions">
         <button class="ch-react" onclick="react(this,'😄')">😄</button>
         <button class="ch-react" onclick="react(this,'🤔')">🤔</button>
         <button class="ch-react" onclick="react(this,'👍')">👍</button>
         <button class="ch-react" onclick="react(this,'🙋')">🙋</button>
       </div>
     </div>
     <button class="ch-share-btn" id="ch-share-btn" onclick="childReady()">I'm done talking ✓</button>`,
    // 3: Activity
    `<div class="ch-title">Game time! 🦶</div>
     <div class="ch-sub">Can you balance on one foot?</div>
     <div class="ch-card">
       <div class="ch-prompt-lbl">Try the balance challenge!</div>
       <div class="ch-prompt-q">One foot + finger on nose. How long can you hold it? 🤪</div>
       <div class="ch-reactions" id="ch-reactions">
         <button class="ch-react" onclick="react(this,'🦶')">🦶</button>
         <button class="ch-react" onclick="react(this,'😤')">😤</button>
         <button class="ch-react" onclick="react(this,'🎉')">🎉</button>
         <button class="ch-react" onclick="react(this,'😂')">😂</button>
       </div>
     </div>
     <button class="ch-share-btn" id="ch-share-btn" onclick="childReady()">I did it! ✓</button>`,
    // 4: Closing
    `<div class="ch-title">Great session! 🌟</div>
     <div class="ch-sub">Say goodbye to <span class="n-dorothy">Dorothy</span> and <span class="n-marcus">Marcus</span>!</div>
     <div class="ch-card">
       <div class="ch-prompt-lbl">How do you feel right now?</div>
       <div class="ch-prompt-q">Pick one!</div>
       <div class="ch-reactions" id="ch-reactions">
         <button class="ch-react" onclick="react(this,'😄')">😄 Happy</button>
         <button class="ch-react" onclick="react(this,'🥹')">🥹 Proud</button>
         <button class="ch-react" onclick="react(this,'😊')">😊 Good</button>
         <button class="ch-react" onclick="react(this,'🤩')">🤩 Amazing</button>
       </div>
     </div>
     <button class="ch-share-btn" id="ch-share-btn" onclick="childReady()">Goodbye! 👋</button>`
  ];
  return panels[i];
}


// ── INIT — start on Watch Together so the video is immediately visible ──
ph(1);
vph(2);


// ── TRIAD DETAIL MODAL ──

const TRIADS = [
  {
    id: 'A',
    colorRgb: '91,187,111',
    members: [
      { name: 'Dorothy', emoji: '👩‍🦳', age: 68, bg: '#E8F5EB', cls: 'n-dorothy' },
      { name: 'Marcus',  emoji: '🧑',   age: 16, bg: '#FCEAEE', cls: 'n-marcus'  },
      { name: 'Liam',    emoji: '👦',   age:  6, bg: '#FEF3E2', cls: 'n-liam'    },
    ],
    status: 'Active',
    statusCls: 'bg-a',
    next: 'Session 4 · Today',
    sessions: [
      { num: 1, theme: "Maya's Name Song",      state: 'done'     },
      { num: 2, theme: "B Is for Book",          state: 'done'     },
      { num: 3, theme: "The Waiting Game",       state: 'done'     },
      { num: 4, theme: "F Is for Friends",       state: 'current'  },
      { num: 5, theme: "The Power of Yet",       state: 'upcoming' },
      { num: 6, theme: "Put Down the Duckie",    state: 'upcoming' },
      { num: 7, theme: "Try a Little Kindness",  state: 'upcoming' },
      { num: 8, theme: "Proud of You",           state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 100, color: '#F5C518' },
      { label: 'Reflection depth',        pct: 82,  color: '#65E97B' },
      { label: 'Teen confidence arc',     pct: 78,  color: '#C778E8' },
      { label: 'Cross-gen participation', pct: 96,  color: '#FF9F6B' },
    ],
    signal: {
      warn: false,
      icon: '💡',
      text: "Facilitation scaffolding has been automatically reduced for Session 4 — this triad's dynamic is mature enough for open prompts. Marcus is advancing phases faster each session, a strong sign of growing confidence.",
    },
    reflections: [
      { author: 'Marcus',  cls: 'n-marcus',  quote: "I didn't expect Dorothy to have a story like that... it made me think differently about what hard actually means." },
      { author: 'Dorothy', cls: 'n-dorothy', quote: "Watching Marcus pause for Liam and not rush to fill the silence shows real patience. He's learning something I couldn't have taught him directly." },
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
      { num: 1, theme: "Maya's Name Song",      state: 'done'     },
      { num: 2, theme: "B Is for Book",          state: 'done'     },
      { num: 3, theme: "The Waiting Game",       state: 'done'     },
      { num: 4, theme: "F Is for Friends",       state: 'done'     },
      { num: 5, theme: "The Power of Yet",       state: 'done'     },
      { num: 6, theme: "Put Down the Duckie",    state: 'current'  },
      { num: 7, theme: "Try a Little Kindness",  state: 'upcoming' },
      { num: 8, theme: "Proud of You",           state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 100, color: '#F5C518' },
      { label: 'Reflection depth',        pct: 91,  color: '#65E97B' },
      { label: 'Teen confidence arc',     pct: 88,  color: '#C778E8' },
      { label: 'Cross-gen participation', pct: 95,  color: '#FF9F6B' },
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
    colorRgb: '64,191,255',
    members: [
      { name: 'Ruth',  emoji: '👵', age: 70, bg: '#FFF3E0' },
      { name: 'James', emoji: '🧒', age: 15, bg: '#E8F5EB' },
      { name: 'Eli',   emoji: '👦', age:  5, bg: '#E8F0FB' },
    ],
    status: 'Check in',
    statusCls: 'bg-p',
    next: '12 days since last session',
    sessions: [
      { num: 1, theme: "Maya's Name Song",      state: 'done'     },
      { num: 2, theme: "B Is for Book",          state: 'done'     },
      { num: 3, theme: "The Waiting Game",       state: 'paused'   },
      { num: 4, theme: "F Is for Friends",       state: 'upcoming' },
      { num: 5, theme: "The Power of Yet",       state: 'upcoming' },
      { num: 6, theme: "Put Down the Duckie",    state: 'upcoming' },
      { num: 7, theme: "Try a Little Kindness",  state: 'upcoming' },
      { num: 8, theme: "Proud of You",           state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 62, color: '#F5C518' },
      { label: 'Reflection depth',        pct: 55, color: '#65E97B' },
      { label: 'Teen confidence arc',     pct: 49, color: '#C778E8' },
      { label: 'Cross-gen participation', pct: 71, color: '#FF9F6B' },
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
      { num: 1, theme: "Maya's Name Song",      state: 'current'  },
      { num: 2, theme: "B Is for Book",          state: 'upcoming' },
      { num: 3, theme: "The Waiting Game",       state: 'upcoming' },
      { num: 4, theme: "F Is for Friends",       state: 'upcoming' },
      { num: 5, theme: "The Power of Yet",       state: 'upcoming' },
      { num: 6, theme: "Put Down the Duckie",    state: 'upcoming' },
      { num: 7, theme: "Try a Little Kindness",  state: 'upcoming' },
      { num: 8, theme: "Proud of You",           state: 'upcoming' },
    ],
    health: [
      { label: 'Session consistency',     pct: 0, color: '#F5C518' },
      { label: 'Reflection depth',        pct: 0, color: '#65E97B' },
      { label: 'Teen confidence arc',     pct: 0, color: '#C778E8' },
      { label: 'Cross-gen participation', pct: 0, color: '#FF9F6B' },
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
      ? `style="background:#5BBB6F;color:#fff"`
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

function clickComplete(e, fnName) {
  const btn = e.currentTarget;
  if (btn.classList.contains('loading')) return;
  const original = btn.textContent;
  btn.classList.add('loading');
  btn.textContent = '· · ·';
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.textContent = original;
    window[fnName]();
  }, 700);
}

function endReflection() {
  const screen  = document.getElementById('end-screen');
  const wordsEl = document.getElementById('end-words');
  const savedEl = document.getElementById('end-saved');

  // Collect Marcus & Dorothy's one-word ritual inputs from reflection view
  const wiInputs = document.querySelectorAll('#s-reflection .wi');
  const people = [
    { name: 'Marcus',  cls: 'n-marcus'  },
    { name: 'Dorothy', cls: 'n-dorothy' },
  ];

  if (wordsEl) {
    const filled = Array.from(wiInputs)
      .map((inp, i) => ({ val: inp.value.trim(), ...people[i] }))
      .filter(w => w.val);

    wordsEl.innerHTML = filled.length
      ? `<div class="ew-lbl">Your words from today</div>` +
        `<div class="ew-chips">` +
        filled.map(w =>
          `<div class="ew-chip"><span class="${w.cls}">${w.name}</span> · <em>${w.val}</em></div>`
        ).join('') + `</div>`
      : '';
  }

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

/* ── ADMIN SECTION NAV ── */
function admNav(sec) {
  document.querySelectorAll('.adm-sb .sb-it[data-sec]').forEach(el => {
    el.classList.toggle('on', el.dataset.sec === sec);
  });
  document.querySelectorAll('.adm-sec').forEach(el => el.classList.remove('on'));
  const target = document.getElementById('adm-sec-' + sec);
  if (target) {
    target.classList.add('on');
    if (sec === 'kits' && !target.dataset.rendered) {
      renderKits();
      target.dataset.rendered = '1';
    }
  }
}

/* ── SESSION KITS DATA ── */
const KITS = [
  {
    num: 1, title: "Maya's Name Song", color: "var(--sun)",
    summary: "Maya Angelou, Elmo, Carlo, and Lexi proudly sing about their names.",
    bigIdea: "It's good to be proud of who you are, where you come from, and what you can do.",
    emotions: ["Pride", "Confidence"],
    triads: [{id:"A",state:"done"},{id:"B",state:"done"},{id:"C",state:"done"},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Talk about this first session's Big Idea — how best to welcome the child into your triad.","Watch the video before the session.","Discuss: How will you explore this material with the child?","Look over the suggestions below. Choose the ones you want to use."] },
      { label:"Together Time", time:"20 min", items:["Greet your child by name, say your own name, and say you hope to become friends.","Write down your name, spelling it out. Ask the child to write theirs.","Play the 'Getting to Know You Game' — favorite color, favorite game.","Introduce the video: 'Today we'll see Maya, Elmo, and two kids sing about their names.'"] },
      { label:"After the Video", time:"", items:["Sing together: 'My name is ___, it's a fine name.'","Share the name of someone in your family. Ask the child the same.","Write the first letter of that person's name together.","Close: 'I had fun with you today.' Draw a smiley face together."] },
      { label:"Reflection", time:"20 min", items:["What went well? What might you do differently next time?","Did anything surprise you? Do you think the child learned something?","What did you learn the child is proud of? What are each of you proud of?"] }
    ],
    forNextTime: "The next session's video is about books. Come with the name of one of your favorite books."
  },
  {
    num: 2, title: "B Is for Book", color: "var(--sky)",
    summary: "Pharrell Williams, Elmo, and Cookie Monster sing about the power and wonder of books.",
    bigIdea: "Reading is fun and opens a window to explore the world.",
    emotions: ["Joy", "Curiosity", "Playfulness"],
    triads: [{id:"A",state:"done"},{id:"B",state:"done"},{id:"C",state:"here"},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video before the session.","Talk about your favorite book. What did you love about it? Is reading fun for you?","Look over the suggestions below. Choose the ones you want to use."] },
      { label:"Together Time", time:"20 min", items:["Greet your child and express how happy you are to be together again.","Talk about a story you love. Ask your child to tell you a story they really like.","Introduce the video: 'We're going to watch how Elmo and Cookie explore with books.'"] },
      { label:"After the Video", time:"", items:["Tell a story about a trip you took. Ask the child, 'Have you ever taken a trip?'","Imagine the three of you are going on a trip together. Tell and write a story about it. 'Look! We've written a story!'","Say goodbye: 'Goodbye, storyteller!' Remind them you'll be together again soon."] },
      { label:"Reflection", time:"20 min", items:["What went well? What could be done differently?","Did anything surprise you? What did the child learn?","What did you learn about the child — and each other? Continue talking about books you love."] }
    ],
    forNextTime: "The next video is about waiting. Come with a story of something you had to wait for — and how it felt."
  },
  {
    num: 3, title: "The Waiting Game", color: "var(--berry)",
    summary: "Cookie Monster plays a game where he has to wait before getting a treat.",
    bigIdea: "Sometimes it is hard to wait for things that we want right away.",
    emotions: ["Frustration", "Resilience"],
    triads: [{id:"A",state:"done"},{id:"B",state:"done"},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video before the session.","Share memories of a time when it was hard to wait for something. How did it feel?","Is there anything you'd like to use from the suggestions below?"] },
      { label:"Together Time", time:"20 min", items:["Greet your child and express how happy you are to be together.","Share a time when you had to wait for something. Discuss how it was hard.","Tell the child: 'Today's video is about waiting. Let's see what Cookie Monster has to wait for!'"] },
      { label:"After the Video", time:"", items:["Recall something you had to wait for. Ask the senior to share. Then ask the child the same.","Play the 'Games I Like' game — share a game you like. Ask the child to draw a picture of them playing theirs.","Say goodbye and remind the child you'll be together again soon."] },
      { label:"Reflection", time:"20 min", items:["What went well? What might you do differently?","Did anything surprise you? What did you learn about the child — and each other?","Continue sharing stories of what is hard for you to wait for."] }
    ],
    forNextTime: "The next video is about friendship. Come with a story about how you made a friend — or something special about one."
  },
  {
    num: 4, title: "F Is for Friends", color: "var(--grass)",
    summary: "A live-action video of friends laughing, dancing, and playing with words that begin with 'F'.",
    bigIdea: "A friend is someone you like being with in happy and sad times.",
    emotions: ["Happiness", "Sadness", "Love"],
    triads: [{id:"A",state:"here"},{id:"B",state:"done"},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video before the session.","Talk to each other about one of your good friends. Describe them and what you like to do together.","Look over the suggestions below. Choose the ones you want to use."] },
      { label:"Together Time", time:"20 min", items:["Share your story about what you like to do with a friend. Invite the child to tell a story too.","Introduce the video: 'Today we're watching a Sesame video about what friends do together.'","Ask: 'Can we be friends even if we are not the same age?'"] },
      { label:"After the Video", time:"", items:["'In the video, I saw the children doing ___. What did you see them doing?'","Talk about how you feel when you're with your friends. Ask the child the same.","Play the 'Words That Begin with F Game' — how many words can you come up with together?"] },
      { label:"Reflection", time:"20 min", items:["Did the child have a good friend? Did they enjoy the word game?","What went well? Is there anything you might do differently?","Ask each other: 'Do you have other friends my age?'"] }
    ],
    forNextTime: "The next session is about patience when learning something new. Come with a story about the first time you tried to learn something."
  },
  {
    num: 5, title: "The Power of Yet", color: "var(--plum)",
    summary: "Janelle Monae sings about how important it is to keep trying when learning to do something.",
    bigIdea: "It takes time and practice to learn new things.",
    emotions: ["Patience", "Mastery", "Frustration"],
    triads: [{id:"A",state:""},{id:"B",state:"done"},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video. Share something that was hard for you to learn. How did you master it?","How will you present the idea of trying over and over to your preschooler?","Is there anything you would like to use from the suggestions below?"] },
      { label:"Together Time", time:"20 min", items:["Greet your child and express how happy you are to be together.","Share your story about when you had to keep trying. Draw a picture of yourself as you tell it.","Introduce the video: 'It's about how sometimes everyone has to keep trying until you learn.'"] },
      { label:"After the Video", time:"", items:["Talk about how you feel when you can't get something right.","Ask: 'How do you think Elmo, Cookie, and Grover felt when they couldn't get something right?'","Play the 'Stand on One Foot' game — all three try together. See how many times it takes to hold it for 5 seconds.","Say goodbye and remind the child you'll be together again soon."] },
      { label:"Reflection", time:"20 min", items:["What went well? Is there anything you might do differently?","Did you learn something new about your child and each other?","Continue talking about something hard to master — or a new challenge you want to take on."] }
    ],
    forNextTime: "The next video is about letting go of something you love. Come with a story of something each of you found difficult to let go of."
  },
  {
    num: 6, title: "Put Down the Duckie", color: "var(--sky)",
    summary: "Hoots the Owl asks Ernie to put down his duckie so he can learn to play the saxophone.",
    bigIdea: "Letting go of something you like is hard — especially when challenged to do something new.",
    emotions: ["Sadness", "Discomfort", "Courage"],
    triads: [{id:"A",state:""},{id:"B",state:"here"},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video. Talk about something you found hard to let go of.","How will you present this idea of letting go to your child?","Look over the suggestions below. Choose the ones you want to use."] },
      { label:"Together Time", time:"20 min", items:["Greet your child and express how happy you are to be together.","Share a story about your favorite toy. Draw a picture of it. Have the child do the same.","Introduce the video: 'We're going to watch what Ernie has a hard time putting down.'"] },
      { label:"After the Video", time:"", items:["Talk about a time it was hard to let a friend play with something you loved.","Ask: 'Why do you think Ernie had a hard time putting down his duckie?'","Play the 'Guess What I Am Feeling' game — draw a face showing what it looks like when you have to let go of something you love.","Let the child know next week is the last session. 'We will have a party to celebrate!'"] },
      { label:"Reflection", time:"20 min", items:["What went well? Is there anything you might do differently?","Do you think the child learned something new about letting go?","Did you learn something new about your child and each other today?"] }
    ],
    forNextTime: "The next session is the last one. Come with a thank-you card expressing how you feel about each other and the program."
  },
  {
    num: 7, title: "Try a Little Kindness", color: "var(--berry)",
    summary: "Tory Kelly sings about kindness to Elmo, Big Bird, Grover, Abby, Cookie Monster, and all of us.",
    bigIdea: "Kindness is a gift that brings happiness and connection to others and oneself.",
    emotions: ["Tenderness", "Happiness", "Love"],
    triads: [{id:"A",state:""},{id:"B",state:""},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Watch the video. Talk about how it made you feel. Share an act of kindness that moved you.","Discuss: How will you present the power of kindness to your young child?","Look over the suggestions below. Choose the ones you want to use."] },
      { label:"Together Time", time:"20 min", items:["Share a story about when someone was kind to you. Draw what your face looked like. Show how it made you feel.","Introduce the video: 'Today we're watching a Sesame video about kindness.'"] },
      { label:"After the Video", time:"", items:["Talk about a time you were kind to a friend and how it made you feel.","Ask: 'How were the children and the Sesame friends being kind to each other?'","Play the 'How My Heart Feels' game — draw your happy heart together.","Talk about the fun you had together in 3G."] },
      { label:"Reflection", time:"20 min", items:["What went well? Share your thank-you cards with each other.","How do you feel now that this is your last 3G session with each other and the young child?"] }
    ],
    forNextTime: "Before you leave, discuss: How will you try to stay in contact with one another?"
  },
  {
    num: 8, title: "Proud of You", color: "var(--sun)",
    summary: "A special final session — no new video, just the three of you. Celebrate the journey you built together.",
    bigIdea: "Being truly known by someone — seen across time — is one of the most powerful things there is.",
    emotions: ["Gratitude", "Pride", "Joy", "Hope"],
    triads: [{id:"A",state:""},{id:"B",state:""},{id:"C",state:""},{id:"D",state:""}],
    phases: [
      { label:"Prep", time:"20 min", items:["Come ready to share your favorite moment from across all 8 sessions.","Bring something — a drawing, a word, an object — that reminds you of your time together.","Think about what changed in you over the course of this program."] },
      { label:"Together Time", time:"20 min", items:["Go around: share your favorite memory from the whole program. Be specific.","Write each other a note: 'What I'll remember about you is...'","Read the notes aloud together."] },
      { label:"After the Video", time:"", items:["No video this session — the triad is the story.","Each person shares: 'When I think about what we did together, I feel ___.'","Take a photo or draw a picture of the three of you together to keep."] },
      { label:"Reflection", time:"20 min", items:["What surprised you about each other over these 8 sessions?","What do you want to carry forward?","What do you want the others to know before you part?"] }
    ],
    forNextTime: "This is not goodbye — it's see you around. Find one real way to stay connected."
  }
];

function renderKits() {
  const container = document.getElementById('adm-sec-kits');
  const stateLabel = { done: 'Completed', here: 'Here now', '': '' };
  container.innerHTML = `
    <div class="kit-header">
      <div class="kit-header-t">Session Kits</div>
      <div class="kit-header-s">8 sessions · The full curriculum arc, from names to kindness. Each kit adapts to where a triad is in the program.</div>
    </div>
    <div class="kit-grid">
      ${KITS.map((k, i) => `
        <div class="kit-card" onclick="openKitModal(${i})" style="--kc:${k.color}">
          <div class="kc-num">0${k.num}</div>
          <div class="kc-body">
            <div class="kc-title">${k.title}</div>
            <div class="kc-idea">${k.bigIdea}</div>
            <div class="kc-emotions">
              ${k.emotions.map(e => `<span class="kc-em">${e}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openKitModal(idx) {
  const k = KITS[idx];
  const phaseHTML = k.phases.map(p => `
    <div class="kph">
      <div class="kph-hd">
        <div class="kph-label">${p.label}</div>
        ${p.time ? `<div class="kph-time">${p.time}</div>` : ''}
      </div>
      <ul class="kph-list">
        ${p.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const triadStatus = k.triads.filter(t => t.state === 'here').map(t => `Triad ${t.id}`).join(', ');
  const completedTriads = k.triads.filter(t => t.state === 'done').map(t => `Triad ${t.id}`).join(', ');

  document.getElementById('kcm-body').innerHTML = `
    <div class="kcm-hd">
      <div class="kcm-eyebrow" style="color:${k.color}">Session ${k.num}</div>
      <div class="kcm-title">${k.title}</div>
      <div class="kcm-summary">${k.summary}</div>
    </div>
    <div class="kcm-meta">
      <div class="kcm-bigidea">
        <div class="kcm-bi-lbl">Big Idea</div>
        <div class="kcm-bi-t">${k.bigIdea}</div>
      </div>
      <div class="kcm-right-meta">
        <div class="kcm-emotions">
          ${k.emotions.map(e => `<span class="kcm-em" style="border-color:${k.color};color:${k.color}">${e}</span>`).join('')}
        </div>
        ${triadStatus ? `<div class="kcm-status kcm-status--here">● ${triadStatus} in this session now</div>` : ''}
        ${completedTriads ? `<div class="kcm-status kcm-status--done">✓ Completed by ${completedTriads}</div>` : ''}
      </div>
    </div>
    <div class="kcm-phases">${phaseHTML}</div>
    <div class="kcm-fnt">
      <div class="kcm-fnt-lbl">For Next Time</div>
      <div class="kcm-fnt-t">${k.forNextTime}</div>
    </div>
  `;

  const bg = document.getElementById('kcm-bg');
  bg.classList.add('on');
  document.addEventListener('keydown', kcmEscListener);
}

function closeKitModal() {
  document.getElementById('kcm-bg').classList.remove('on');
  document.removeEventListener('keydown', kcmEscListener);
}

function kcmBgClick(e) {
  if (e.target === document.getElementById('kcm-bg')) closeKitModal();
}

function kcmEscListener(e) {
  if (e.key === 'Escape') closeKitModal();
}

function launchConfetti() {
  const screen = document.getElementById('end-screen');
  const colors = [
    '#40BFFF', '#40BFFF',          // sun (more frequent — warmest)
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
