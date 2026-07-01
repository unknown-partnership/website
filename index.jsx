// Product page — preserves the OLED + paper aesthetic of the UX redesign
// canvas but pitches the box as a finished product. All marketing
// visuals (hero emulator, monitor grid, tools section) are real UI
// rendered straight from the OLED primitives in c2-screen.jsx.

const Eyebrow = ({ n, children }) => (
  <div className="pp-eyebrow">
    {n && <span className="pp-eyebrow-n">{n}</span>}
    <span>{children}</span>
  </div>
);

// Screen card used by the Tools section. CSS-variable scaling instead
// of the Scaled component so the layout box matches the painted size
// — the old Scaled component left its container at the native 176 px
// while the visual painted out to 176 × k, which overflowed the
// viewport on a single-column mobile layout. The scale itself lives
// in CSS (--tc-k on .pp-screencard-screen) so media queries can shrink
// it on narrow viewports; an inline style here would beat the queries
// on specificity and leave the screens stuck at the desktop size.
const ScreenCard = ({ cap, n, children }) => (
  <div className="pp-screencard">
    <div className="pp-screencard-screen">
      {children}
    </div>
    {cap && (
      <div className="frame-caption">
        {n != null && <span className="num">{n}</span>}
        {cap}
      </div>
    )}
  </div>
);

// Three Tools-section screens, inlined so we don't depend on the flow
// module's internals being on window. Each one paints a real device
// screen the operator sees during the matching workflow:
//   • ToolBoundScreen   — the success card the pairing wizard ends on
//   • ToolRfdParamsScreen — a slice of the 26-row RFD Util scrolling list
//   • ToolElrsFlashScreen — the USB↔ELRS bridge during firmware passthru

const ToolBoundScreen = () => (
  <Screen>
    <div style={{ position: 'absolute', left: 52, top: 8 }}>
      <Icon name="circle-check" size={24} stroke={2} />
    </div>
    <T x={0} y={36} w={128} align="center" size={11} bold>Bound!</T>
    <T x={0} y={48} w={128} align="center" size={7}>2418 frames</T>
    <T x={0} y={57} w={128} align="center" size={6}>Returning...</T>
  </Screen>
);

const ToolRfdParamsScreen = () => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3}   y={2} size={7} inv bold>RFD UTIL</T>
      <T x={106} y={2} size={6} inv>3/26</T>
    </Inv>
    <MenuRow y={11} icon="hash"  label="NetID"  value="25" />
    <MenuRow y={22} icon="radio" label="AirSpd" value="64" />
    <MenuRow y={33} icon="zap"   label="TxPwr"  value="20" selected />
    <MenuRow y={44} icon="wifi"  label="ECC"    value="on" />
  </Screen>
);

// Monitor-ring "all six pages at once" tile. The content area is cut
// into six parallelogram cells by five diagonal SVG dividers (slope is
// `SLANT` over the 54 px content height). Each cell holds the page's
// glyph and 3-letter label — same icons the live page-strip uses up top
// of every monitor screen, so the visual reads as the whole ring laid
// flat. Mirrors PAGE_GLYPH[6] in src/app/ui_kit.cpp:16.
const ToolMonitorPagesScreen = () => {
  const PAGES = [
    { icon: 'radio',     label: 'RAD' },
    { icon: 'map',       label: 'MSN' },
    { icon: 'plane',     label: 'VEH' },
    { icon: 'joystick',  label: 'STK' },
    { icon: 'satellite', label: 'GPS' },
    { icon: 'gauge',     label: 'HUD' },
  ];
  const W = 128, H_HDR = 10, H_CONTENT = 54;
  const COLS = 6;
  const CELL_W = W / COLS;
  const SLANT = 12;
  return (
    <Screen>
      <Inv x={0} y={0} w={W} h={H_HDR}>
        <T x={3}  y={2} size={7} inv bold>TELEMETRY</T>
        <T x={62} y={2} size={6} inv>· 6 pages</T>
      </Inv>
      <svg
        width={W} height={H_CONTENT}
        style={{ position: 'absolute', left: 0, top: H_HDR, pointerEvents: 'none' }}
      >
        {[1, 2, 3, 4, 5].map(i => {
          // +4 nudges every divider rightward so each glyph sits more
          // squarely inside its cell instead of grazing the left edge.
          const xt = i * CELL_W + 6;
          return (
            <line key={i}
              x1={xt} y1={0}
              x2={xt - SLANT} y2={H_CONTENT}
              stroke="#e6efff" strokeWidth={1}
              shapeRendering="crispEdges" />
          );
        })}
      </svg>
      {PAGES.map((p, i) => {
        // Visual centers inside each parallelogram. The icon sits in
        // the upper half (less horizontal shift); the label sits in the
        // lower half (more shift). Offsets were hand-tuned against the
        // SLANT so the glyph + label both feel centered in their cell.
        const iconX  = Math.round(i * CELL_W + 7);
        const labelX = Math.round(i * CELL_W + 3);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: iconX, top: 18 }}>
              <Icon name={p.icon} size={10} stroke={2.2} />
            </div>
            <T x={labelX} y={40} size={6}>{p.label}</T>
          </React.Fragment>
        );
      })}
    </Screen>
  );
};

const Logo = () => (
  <div className="pp-logo">
    <span className="pp-logo-mark">
      <Icon name="radio-tower" size={18} stroke={2.2} />
    </span>
    <span className="pp-logo-text">MissionWeaver <em>GCS</em></span>
  </div>
);

const Nav = ({ showCta = true }) => (
  <header className="pp-nav">
    <Logo />
    <nav className="pp-nav-links">
      <a href="#monitor">Monitor</a>
      <a href="#tools">Tools</a>
      <a href="#specs">Specs</a>
      <a href="docs.html">Guide</a>
      {/* Cart icon + count. On mobile it stays hidden until the hero CTA has
          scrolled out of view (App watches it via IntersectionObserver) — but
          CartButton overrides that and shows itself once the cart is non-empty
          so a shopper can always reopen it. `collapsed` = hero CTA still in
          view; the @media rule in styles.css applies is-hidden-mobile. */}
      <CartButton collapsed={!showCta} />
    </nav>
  </header>
);

const Hero = ({ heroCtaRef }) => (
  <section className="pp-hero">
    <div className="pp-hero-text">
      <Eyebrow>RFD C2 · v1.0</Eyebrow>
      <h1 className="pp-h1">
        <span className="pp-h1-line1">At last.</span>
        <span className="pp-h1-line2">The ground station<br/>has been figured out.</span>
      </h1>
      <p className="pp-lede">
        A radio, a screen, two buttons. Six-pages tell you everything
        your aircraft wants to tell you, so you can reach for the laptop only when you want to.
      </p>
      <div className="pp-cta">
        <BuyButton innerRef={heroCtaRef} className="pp-btn pp-btn-primary">Buy Now</BuyButton>
      </div>
      <div className="pp-hero-meta">
        <span><b>RFD900X</b> 40km (25+ miles) Range</span>
        <span>·</span>
        <span><b>ELRS</b> 2.4 GHz control</span>
        <span>·</span>
        <span><b>USB-C</b></span>
      </div>
    </div>
    <div className="pp-hero-screen">
      <div className="pp-hero-screen-inner">
        <Emulator />
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// Emulator — click L / R to walk the monitor ring, press and hold either
// button to jump to its overlay. Mirrors the device's two-button gesture
// model (click <500 ms, hold ≥600 ms) so the page sells the actual UX
// rather than describing it.
// ─────────────────────────────────────────────────────────────

// Six monitor pages, mirroring the firmware enum in display.cpp:44-51.
// Position was folded into GPS (sats + fix + HDOP + lat/lon all on one
// page); Mission was added as a separate slot for waypoint navigation,
// while Vehicle is back to covering battery / mode / arm duration.
const EMU_PAGES = ['Radio', 'Mission', 'Vehicle', 'Controller', 'GPS', 'HUD'];
const EMU_HOLD_MS = 600;

const useHold = (onClick, onHold, holdMs = EMU_HOLD_MS) => {
  const timer = React.useRef(null);
  const fired = React.useRef(false);

  const begin = (e) => {
    e.preventDefault();
    fired.current = false;
    timer.current = setTimeout(() => { fired.current = true; onHold && onHold(); }, holdMs);
  };
  const end = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!fired.current) onClick && onClick();
  };
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    fired.current = true;
  };
  return {
    onPointerDown: begin,
    onPointerUp: end,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  };
};

// ─────────────────────────────────────────────────────────────
// Overlay screens & menu data. The Emulator runs a tiny state machine
// (stack of mode names + a single cursor for the top mode); these are
// the views and transitions it walks through. Click L cycles cursor
// forward, click R selects / advances, hold L pops one level, hold R
// jumps back to the monitor ring. Mirrors what the firmware ships.
// ─────────────────────────────────────────────────────────────

// MENU_ITEMS[mode] — rows shown in a list overlay (icon, label, value).
// Mirrors the firmware's category/row layout (src/app/display.cpp CATEGORIES
// and SR_LABELS). Each editable row has `key` + `cycle`: clicking R cycles
// the row's value through its preset list and the change persists across the
// session, the same way the firmware cycles SR_* values on R-click. Rows
// without `cycle` use MENU_TRANS for navigation/action transitions instead.
// NetID is the one special case — it opens the dedicated numeric editor
// (rfd_edit) because firmware uses the tap-streak ×10/×100 accelerator there.
const MENU_ITEMS = {
  actions:      [
    { icon: 'gamepad-2',        label: 'Pair RC' },
    { icon: 'zap',              label: 'ELRS flash', danger: true },
    { icon: 'power',            label: 'Reboot',     danger: true },
    { icon: 'corner-down-left', label: 'Close' },
  ],
  settings:     [
    { icon: 'monitor',            label: 'Display' },
    { icon: 'speaker',            label: 'Audio' },
    { icon: 'gamepad-2',          label: 'Receiver' },
    { icon: 'plane',              label: 'Vehicle' },
    { icon: 'radio-tower',        label: 'RFD Util', danger: true },
    { icon: 'info',               label: 'About' },
    { icon: 'corner-down-left',   label: 'Exit' },
  ],
  set_display:  [
    { label: 'Cycle',      key: 'cycle',      cycle: ['off', '2s', '3s', '4s', '5s', '8s'] },
    { label: 'Brightness', key: 'brightness', cycle: ['25%', '50%', '75%', '100%'] },
    { label: 'Sleep',      key: 'sleep',      cycle: ['off', '30s', '60s', '120s', '300s'] },
    { icon: 'corner-down-left', label: 'Back' },
  ],
  set_audio:    [
    { label: 'Buzzer', key: 'buzzer', cycle: ['off', 'on'] },
    { label: 'Volume', key: 'volume', cycle: ['0%', '25%', '50%', '75%', '100%'] },
    { icon: 'corner-down-left', label: 'Back' },
  ],
  set_receiver: [
    { label: 'RC src',  key: 'rc_src',  cycle: ['int', 'ext'] },
    { label: 'Sticks',  key: 'sticks',  cycle: ['M1', 'M2', 'M3', 'M4'] },
    { label: 'RC type', key: 'rc_type', cycle: ['ELRS'] },
    { icon: 'gamepad-2', label: 'Bind' },
    { label: 'Reboot RC' },
    { icon: 'zap', label: 'ELRS flash', danger: true },
    { icon: 'corner-down-left', label: 'Back' },
  ],
  set_vehicle:  [
    { label: 'Cells', key: 'cells', cycle: ['1S', '2S', '3S', '4S', '5S', '6S'] },
    { icon: 'corner-down-left', label: 'Back' },
  ],
  // Mirrors RFD_CFG_PARAMS[] in src/app/rfd_cfg.cpp (22 SiK params, in S#
  // order) followed by the four action rows from RADIO_ROWS[]. Bool/enum
  // params cycle through their firmware preset list; numeric params (NetID,
  // TxPwr, MinFq, MaxFq, NumChans, DutyCyc, LBT_RSSI, MaxWin) cycle through
  // a short set of representative steps so the demo can edit them with R-
  // clicks too — NetID alone gets the dedicated tap-streak numeric editor.
  rfd_params:   [
    { label: 'SerSpd',    key: 'rfd_serspd',  cycle: ['1', '2', '4', '8', '9', '19', '38', '57', '115'] },
    { label: 'AirSpd',    key: 'rfd_airspd',  cycle: ['2', '4', '8', '16', '32', '64', '128', '192', '250'] },
    { label: 'NetID',     key: 'rfd_netid' },     // opens numeric editor
    { label: 'TxPwr',     key: 'rfd_txpwr',   cycle: ['1', '5', '10', '15', '17', '20', '24', '27', '30'] },
    { label: 'ECC',       key: 'rfd_ecc',     cycle: ['off', 'on'] },
    { label: 'MAVLink',   key: 'rfd_mavlnk',  cycle: ['raw', 'frame', 'low-lat'] },
    { label: 'OppRsnd',   key: 'rfd_opprsnd', cycle: ['off', 'on'] },
    { label: 'MinFq',     key: 'rfd_minfq',   cycle: ['902000', '915000', '917000', '928000'] },
    { label: 'MaxFq',     key: 'rfd_maxfq',   cycle: ['915000', '920000', '928000'] },
    { label: 'NumChans',  key: 'rfd_numch',   cycle: ['5', '10', '20', '30', '50'] },
    { label: 'DutyCyc',   key: 'rfd_dutycyc', cycle: ['25', '50', '75', '100'] },
    { label: 'LBT_RSSI',  key: 'rfd_lbtrssi', cycle: ['0', '25', '50', '100', '220'] },
    { label: 'Manchstr',  key: 'rfd_manch',   cycle: ['off', 'on'] },
    { label: 'RTSCTS',    key: 'rfd_rtscts',  cycle: ['off', 'on'] },
    { label: 'MaxWin',    key: 'rfd_maxwin',  cycle: ['33', '66', '99', '131'] },
    { label: 'CIN',       key: 'rfd_cin',     cycle: ['off', 'on'] },
    { label: 'COUT',      key: 'rfd_cout',    cycle: ['off', 'on'] },
    { label: 'AUXIN',     key: 'rfd_auxin',   cycle: ['off', 'on'] },
    { label: 'AUX/SBOUT', key: 'rfd_sbout',   cycle: ['off', 'on'] },
    { label: 'STAT/SBIN', key: 'rfd_sbin',    cycle: ['off', 'on'] },
    { label: '3V3',       key: 'rfd_3v3',     cycle: ['off', 'on'] },
    { label: 'FreqBnd',   key: 'rfd_freqbnd', cycle: ['433', '868', '915'] },
    { icon: 'save',        label: 'Apply' },
    { icon: 'broadcast',   label: 'Apply rem', danger: true },
    { icon: 'rotate-cw',   label: 'Re-read' },
    { icon: 'refresh-ccw', label: 'Reset def', danger: true },
    { icon: 'corner-down-left', label: 'Back' },
  ],
};

// Initial value for every settable key. The Emulator hoists this into a
// useState bucket so R-clicks on a setting row cycle it through the row's
// preset list and the change sticks for the session.
// Buzzer defaults to OFF — the audible page-tone vocabulary plays only
// when the user explicitly opts in via Settings → Audio → Buzzer = on,
// matching how a noisy device greets a quiet office.
const INITIAL_SETTINGS = {
  cycle: '4s', brightness: '75%', sleep: '30s',
  buzzer: 'off', volume: '50%',
  rc_src: 'int', sticks: 'M2', rc_type: 'ELRS',
  cells: '4S',
  rfd_serspd: '57', rfd_airspd: '64', rfd_txpwr: '20', rfd_ecc: 'on',
  rfd_mavlnk: 'raw', rfd_opprsnd: 'off', rfd_minfq: '915000',
  rfd_maxfq: '928000', rfd_numch: '20', rfd_dutycyc: '100',
  rfd_lbtrssi: '0', rfd_manch: 'off', rfd_rtscts: 'off', rfd_maxwin: '131',
  rfd_cin: 'off', rfd_cout: 'off', rfd_auxin: 'off',
  rfd_sbout: 'off', rfd_sbin: 'off', rfd_3v3: 'off', rfd_freqbnd: '915',
};

// Buzzer vocabulary — every entry is the exact (frequency Hz, duration ms)
// sequence the firmware queues in src/app/buzzer.cpp. The magnetic CMT
// buzzer's resonant peak sits ~2.7 kHz; clicks/chirps live around there,
// the low chirp leg drops to 1.5 kHz, and the warn tone is a 250 ms 1.2
// kHz beep. We re-emit the same shape through Web Audio so the page
// sounds like the device does.
const TONE_VOCAB = {
  click:      [[2700,  25]],
  chirp_up:   [[1500,  30], [0, 15], [2700, 50]],
  chirp_down: [[2700,  30], [0, 15], [1500, 50]],
  double:     [[2700,  25], [0, 30], [2700, 25]],
  warn:       [[1200, 250]],
};

// Maps the user-facing Volume setting to an actual gain. Browser tabs can
// be very loud, so even "100%" sits well below 1.0 — the audible spread
// across the cycle still feels like 25/50/75/100 by ear.
const TONE_VOL = { '0%': 0, '25%': 0.04, '50%': 0.08, '75%': 0.12, '100%': 0.18 };

// useBuzzer — lazy AudioContext + square-wave oscillators per segment.
// Returns a stable callable per tone. Gated on `enabled` (buzzer setting)
// so flipping to "off" silences immediately mid-sequence by closing the
// context. The first tone after a user gesture resumes a suspended ctx
// (Chrome/Safari require this).
const useBuzzer = (enabled, volumeKey) => {
  const ctxRef = React.useRef(null);
  // Wrap settings deps in refs so the returned callbacks stay stable —
  // useHold captures them once and we don't want every settings change to
  // re-bind pointer handlers.
  const enabledRef = React.useRef(enabled);
  const volRef     = React.useRef(volumeKey);
  React.useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  React.useEffect(() => { volRef.current = volumeKey; }, [volumeKey]);

  React.useEffect(() => () => {
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null; }
  }, []);

  const play = React.useCallback((segs) => {
    if (!enabledRef.current) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    let ctx = ctxRef.current;
    if (!ctx) { ctx = new Ctor(); ctxRef.current = ctx; }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const vol = TONE_VOL[volRef.current] ?? 0.08;
    let t = ctx.currentTime + 0.005;     // tiny epsilon so start() doesn't trip
    for (const [freq, durMs] of segs) {
      const durSec = durMs / 1000;
      if (freq > 0 && vol > 0) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';            // magnetic buzzer is PWM-driven
        osc.frequency.value = freq;
        // Short attack/release envelope (~3 ms) so each segment doesn't
        // open with a click transient — keeps the 25 ms blip readable.
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol, t + Math.min(0.003, durSec / 3));
        gain.gain.setValueAtTime(vol, t + Math.max(0, durSec - 0.003));
        gain.gain.linearRampToValueAtTime(0, t + durSec);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + durSec + 0.01);
      }
      t += durSec;
    }
  }, []);

  return React.useMemo(() => ({
    click:     () => play(TONE_VOCAB.click),
    chirpUp:   () => play(TONE_VOCAB.chirp_up),
    chirpDown: () => play(TONE_VOCAB.chirp_down),
    double:    () => play(TONE_VOCAB.double),
    warn:      () => play(TONE_VOCAB.warn),
  }), [play]);
};

// MENU_TRANS[mode][cursor] — what to do when R is pressed on a row that
// has no `cycle` (the cycling rows handle R themselves). String pushes the
// named mode; __pop / __home / __noop are sentinels.
const MENU_TRANS = {
  actions:      ['pair_prompt', '__noop', 'reboot', '__pop'],
  settings:     ['set_display', 'set_audio', 'set_receiver', 'set_vehicle', 'rfd_gate', 'about', '__home'],
  set_display:  [null, null, null, '__pop'],
  set_audio:    [null, null, '__pop'],
  set_receiver: [null, null, null, 'pair_prompt', '__noop', '__noop', '__pop'],
  set_vehicle:  [null, '__pop'],
  // 22 params + 4 actions + Back. NetID (idx 2) opens the numeric editor;
  // the cycling param rows are `null` here so the cycle handler runs; the
  // four trailing action rows trigger their flows and Back pops.
  rfd_params:   [
    null, null, 'rfd_edit', null, null, null, null,
    null, null, null, null, null, null, null,
    null, null, null, null, null, null, null,
    null,
    '__noop', 'rfd_gate', '__noop', '__noop',
    '__pop',
  ],
};

const MENU_TITLES = {
  actions:      { title: 'ACTIONS',   sub: '· L+R OVL' },
  settings:     { title: 'SETTINGS' },
  set_display:  { title: 'DISPLAY' },
  set_audio:    { title: 'AUDIO' },
  set_receiver: { title: 'RECEIVER' },
  set_vehicle:  { title: 'VEHICLE' },
  rfd_params:   { title: 'RFD UTIL' },
};

// Generic menu list view — 4 visible rows, window slides as cursor moves.
// Resolves each row's displayed value from `settings` if the row has a key,
// so cycling a row via R updates the screen immediately.
const ScreenMenu = ({ mode, cursor, settings }) => {
  const items  = MENU_ITEMS[mode];
  const titles = MENU_TITLES[mode] || {};
  const VISIBLE = 4;
  let top = Math.max(0, cursor - Math.floor((VISIBLE - 1) / 2));
  top = Math.min(top, Math.max(0, items.length - VISIBLE));
  const visible = items.slice(top, top + VISIBLE);
  const valueOf = (it) => (it.key && settings && settings[it.key] != null
    ? settings[it.key] : it.value);
  return (
    <Screen>
      <Inv x={0} y={0} w={128} h={10}>
        <T x={3}   y={2} size={7} inv bold>{titles.title}</T>
        {titles.sub && <T x={62} y={2} size={6} inv>{titles.sub}</T>}
        <T x={106} y={2} size={6} inv>{cursor + 1}/{items.length}</T>
      </Inv>
      {visible.map((it, i) => (
        <MenuRow key={top + i} y={11 + i * 11}
          icon={it.icon} label={it.label} value={valueOf(it)}
          danger={it.danger}
          selected={top + i === cursor} />
      ))}
      <HintBar y={55} l="next" r="OK" hl="back" />
    </Screen>
  );
};

const ScreenRfdGate = () => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3} y={2} size={7} inv bold>RFD UTIL</T>
    </Inv>
    <div style={{ position: 'absolute', left: 56, top: 14 }}>
      <Icon name="shield-alert" size={20} stroke={2} />
    </div>
    <T x={0} y={36} w={128} align="center" size={6}>MAVLink link will drop.</T>
    <T x={0} y={44} w={128} align="center" size={6}>Continue?</T>
    <HintBar y={55} l="No" r="Yes" hl="back" />
  </Screen>
);

const ScreenRfdEdit = ({ value }) => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3} y={2} size={7} inv bold>RFD · NET ID</T>
    </Inv>
    <T x={3} y={14} size={6}>edit · 16-bit</T>
    <Big x={2} y={20} size={26}>0x{value.toString(16).toUpperCase().padStart(4, '0')}</Big>
    <T x={3} y={42} size={6}>local ✓ · over-air ▸</T>
    <HintBar y={55} l="−1" r="+1" hl="back" hr="apply" />
  </Screen>
);

// Strings mirror src/app/display.cpp render path for s_settings_level 7 / 8.
// The box drives the receiver-side bind ritual itself (rc_bind_frsky /
// rc_bind_elrs power-cycle the RX with its bind line asserted) — every
// instruction the operator sees is for what to do on the *controller*.
const ScreenPairPrompt = ({ cursor }) => (
  <Screen>
    <T x={0} y={14} w={128} align="center" size={7} bold>Pair RC receiver?</T>
    <Box x={8}  y={28} w={48} h={20} filled={cursor === 0}>
      <T x={0} y={6} w={48} align="center" size={8} bold inv={cursor === 0}>No</T>
    </Box>
    <Box x={72} y={28} w={48} h={20} filled={cursor === 1}>
      <T x={0} y={6} w={48} align="center" size={8} bold inv={cursor === 1}>Yes</T>
    </Box>
    <HintBar y={55} l="next" r="OK" hl="back" />
  </Screen>
);

// FrSky step 1/3 — drawStr block at display.cpp:1244-1249.
const ScreenPairFrsky1 = () => (
  <Screen>
    <T x={0} y={14} size={7}>On controller:</T>
    <T x={0} y={26} size={7}>1. Click [Register]</T>
    <T x={0} y={34} size={7}>2. Press [Enter]</T>
    <T x={0} y={48} size={7}>R: Continue</T>
  </Screen>
);

// FrSky step 2/3 — drawStr block at display.cpp:1251-1264. The 3 s
// anti-mash lockout swaps the bottom "R: Continue" for "Wait Ns..." while
// the operator should still be hearing the receiver chirp; once the
// window elapses the Continue prompt reappears.
const ScreenPairFrsky2 = ({ lockoutRemainSec }) => (
  <Screen>
    <T x={0} y={14} size={7}>On controller:</T>
    <T x={0} y={22} size={7}>Scroll to Receiver1,</T>
    <T x={0} y={30} size={7}>click [Bind].</T>
    <T x={0} y={38} size={7}>Should be chirping.</T>
    {lockoutRemainSec > 0
      ? <T x={0} y={48} size={7}>Wait {lockoutRemainSec}s...</T>
      : <T x={0} y={48} size={7}>R: Continue</T>}
  </Screen>
);

// ELRS instruct — drawStr block at display.cpp:1266-1272. The single
// instruction page; ELRS bind is just a power-cycle counter so there's
// no multi-step wizard.
const ScreenPairElrsInstruct = () => (
  <Screen>
    <T x={0} y={14} size={7}>On controller:</T>
    <T x={0} y={26} size={7}>1. Press [SYS] button</T>
    <T x={0} y={34} size={7}>2. Load ExpressLRS</T>
    <T x={0} y={42} size={7}>3. Click [Bind]</T>
    <T x={0} y={54} size={7}>R: Continue</T>
  </Screen>
);

// Binding ritual running — drawStr block at display.cpp:1274-1283.
// Centered "*Please Wait*" while the firmware drives rc_bind_frsky /
// rc_bind_elrs (blocking power-cycle of the receiver).
const ScreenPairBinding = () => (
  <Screen>
    <T x={0} y={28} w={128} align="center" size={9} bold>*Please Wait*</T>
  </Screen>
);

// WAIT_SBUS, FrSky branch — drawStr block at display.cpp:1298-1303.
// Includes the "Select the module" prompt that FrSky-mode shows.
const ScreenPairListenFrsky = ({ frames }) => (
  <Screen>
    <T x={0} y={14} size={7}>On controller:</T>
    <T x={0} y={26} size={7}>Select the module</T>
    <T x={0} y={42} size={7}>Listening for Controls</T>
    <T x={0} y={52} size={7}>{frames} frames</T>
  </Screen>
);

// WAIT_SBUS, ELRS branch — drawStr block at display.cpp:1304-1308.
// ELRS receivers come back on the wire by themselves once they catch
// the transmitter, so no "select the module" prompt.
const ScreenPairListenElrs = ({ frames }) => (
  <Screen>
    <T x={0} y={20} size={7}>Listening for Controls</T>
    <T x={0} y={32} size={7}>{frames} frames</T>
  </Screen>
);

// Success — drawStr block at display.cpp:1288-1297. "Bound!" in 6x10,
// frame count below in 5x7, then "Returning..." at the bottom while the
// firmware drops the operator back on the sticks page.
const ScreenPairBound = ({ frames }) => (
  <Screen>
    <T x={0} y={28} w={128} align="center" size={11} bold>Bound!</T>
    <T x={0} y={42} w={128} align="center" size={7}>{frames} frames</T>
    <T x={0} y={54} size={7}>Returning...</T>
  </Screen>
);

const ScreenPassthrough = () => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3}  y={2} size={7} inv bold>PASSTHRU</T>
      <T x={66} y={2} size={6} inv>· USB → RFD</T>
    </Inv>
    <div style={{ position: 'absolute', left: 14, top: 20 }}>
      <Icon name="usb" size={20} stroke={2} />
    </div>
    <div style={{ position: 'absolute', left: 46, top: 22 }}>
      <Icon name="arrow-right-left" size={16} stroke={2.4} />
    </div>
    <div style={{ position: 'absolute', left: 70, top: 20 }}>
      <Icon name="radio-tower" size={20} stroke={2} />
    </div>
    <T x={96} y={24} size={7} bold>RFD</T>
    <T x={96} y={32} size={6}>57600</T>
    <HintBar y={55} hl="exit" />
  </Screen>
);

const ScreenReboot = () => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3} y={2} size={7} inv bold>REBOOTING</T>
    </Inv>
    <div style={{ position: 'absolute', left: 54, top: 18 }}>
      <Icon name="power" size={24} stroke={2} />
    </div>
    <T x={0} y={46} w={128} align="center" size={6}>back in a second…</T>
    <HintBar y={55} hl="cancel" />
  </Screen>
);

const ScreenAbout = () => (
  <Screen>
    <Inv x={0} y={0} w={128} h={10}>
      <T x={3} y={2} size={7} inv bold>ABOUT</T>
    </Inv>
    <T x={3} y={14} size={6}>MissionWeaver GCS</T>
    <T x={3} y={22} size={6}>RFD C2 · v1.0</T>
    <T x={3} y={34} size={6}>ATSAMD21</T>
    <T x={3} y={42} size={6}>FW 1.0.0</T>
    <HintBar y={55} hl="back" />
  </Screen>
);

// ─────────────────────────────────────────────────────────────
// Flight sim — one source of truth driving every live page. The
// aircraft is loitering: heading slowly rotates, position circles,
// attitude banks into the turn, battery drains. Two ticks: a 100 ms
// smooth tick for continuous animation, and a slower ~900 ms jitter
// tick for things that should *snap* rather than glide (link % and
// satellite count — a constant sin() reads as too clean).
// ─────────────────────────────────────────────────────────────
const useFlightSim = () => {
  const t0 = React.useRef(Date.now());
  const [now, setNow] = React.useState(Date.now());
  const [jit, setJit] = React.useState({ link: 0, sat: 0 });

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    const id = setInterval(() => setJit({
      link: Math.round((Math.random() - 0.5) * 4),
      sat:  Math.round((Math.random() - 0.5) * 3),
    }), 900);
    return () => clearInterval(id);
  }, []);

  const t = (now - t0.current) / 1000;

  // Loiter: 4°/s heading drift, ~80 m radius orbit.
  const heading = Math.round((((274 + t * 4) % 360) + 360) % 360);
  const phase = t * 0.07;
  const lat = 37.42456 + Math.sin(phase) * 0.0008;
  const lon = -122.09740 + Math.cos(phase) * 0.0008;

  const vsRaw = Math.sin(t * 0.6) * 0.4;

  return {
    // Radio link strength (%) — jitters around 81 with a slow sin trend.
    linkPct: Math.max(72, Math.min(92, 81 + jit.link + Math.round(Math.sin(t * 0.4) * 2))),

    // Battery (%) — slowly draining over the visit.
    battPct: Math.max(8, 78 - t * 0.04),

    // Sticks — autopilot-trimmed loiter (mostly centered with tiny
    // oscillation, slight right bank on the aileron).
    stickL: {
      dx:  Math.sin(t * 0.25) * 0.06,
      dy:  Math.sin(t * 0.20) * 0.05,
    },
    stickR: {
      dx:  0.20 + Math.sin(t * 0.45) * 0.18,
      dy: -0.10 + Math.sin(t * 0.35 + 1) * 0.14,
    },

    // GPS
    sats: Math.max(9, Math.min(14, 12 + jit.sat)),
    heading,

    // HUD — banking into the turn, alt/spd oscillating.
    pitch: -3 + Math.sin(t * 0.30) * 1.5,
    roll:  12 + Math.sin(t * 0.40) * 3,
    alt:   Math.round(142 + Math.sin(t * 0.35) * 4),
    spd:   Math.round(14 + Math.sin(t * 0.50) * 2),
    vs:    vsRaw.toFixed(1),
    vsPos: vsRaw >= 0,

    // Position — folded into the GPS page now (display.cpp:48).
    lat, lon,
    homeDist: Math.round(78 + Math.sin(t * 0.3) * 8),
    bearing: ((heading + 180) % 360),

    // Mission — current waypoint of total, distance to next, bearing to
    // it. Advance one waypoint every ~12 s so the demo visibly ticks.
    wpTotal: 12,
    wpCur:   1 + (Math.floor(t / 12) % 12),
    wpDist:  Math.round(240 + Math.sin(t * 0.5) * 80),
    wpBrg:   (Math.round(heading + 22) + 360) % 360,
  };
};

// ─────────────────────────────────────────────────────────────
// D3 chrome — copied from flow-monitor.jsx since the originals aren't
// exposed on window. (Strip header, hint bar, stick crosshair box,
// pitch/roll horizon.)
// ─────────────────────────────────────────────────────────────
// Page-strip glyphs, in PAGE_* order from display.cpp + ui_kit.cpp:16.
// `map` for Mission (flight plan reads better than a single-waypoint
// pin); `plane` keeps the vehicle slot; `joystick` and `gauge` are the
// firmware's deliberate picks over the older `gamepad-2` / `compass`.
const LIVE_STRIP_ICONS = ['radio', 'map', 'plane', 'joystick', 'satellite', 'gauge'];

const LivePageStrip = ({ active = 0 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 9 }}>
    {LIVE_STRIP_ICONS.map((n, i) => {
      const x = 4 + i * 20;
      // The active cell uses `.c2-inv`, which paints a white background
      // and (via the `.c2-inv svg` rule in styles.css) overrides the
      // global `.c2-screen svg { color: #e6efff }` so the icon strokes
      // render dark — i.e. the glyph appears inverted, matching the
      // XOR-box highlight in firmware (ui_kit.cpp:ui_page_strip).
      const isActive = i === active;
      return (
        <div key={i}
          className={isActive ? 'c2-inv' : ''}
          style={{
            position: 'absolute', left: x, top: 1, width: 9, height: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Icon name={n} size={7} stroke={2.4} />
        </div>
      );
    })}
    <SignalBars x={120} y={2} bars={4} />
    <HR y={9} />
  </div>
);

const LiveHintBar = () => (
  <div style={{
    position: 'absolute', left: 0, top: 54, width: 128, height: 10,
    background: '#050403', borderTop: '1px solid rgba(230,239,255,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <span style={{ background: '#e6efff', color: '#050403', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, fontWeight: 700 }}>L</span>
      <Icon name="chevron-left" size={7} stroke={2.4} />
      <span style={{ boxShadow: 'inset 0 0 0 1px #e6efff', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, color: '#e6efff' }}>L</span>
      <Icon name="menu" size={7} stroke={2.4} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Icon name="sliders-horizontal" size={7} stroke={2.4} />
      <span style={{ boxShadow: 'inset 0 0 0 1px #e6efff', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, color: '#e6efff' }}>R</span>
      <Icon name="chevron-right" size={7} stroke={2.4} />
      <span style={{ background: '#e6efff', color: '#050403', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, fontWeight: 700 }}>R</span>
    </div>
  </div>
);

const LiveStickBox = ({ x, y, size = 22, dx = 0, dy = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, boxShadow: 'inset 0 0 0 1px #e6efff' }}>
    <div style={{ position: 'absolute', left: 0, top: size / 2, width: size, height: 1, background: 'rgba(230,239,255,.35)' }} />
    <div style={{ position: 'absolute', left: size / 2, top: 0, width: 1, height: size, background: 'rgba(230,239,255,.35)' }} />
    <div style={{
      position: 'absolute',
      left: size / 2 + dx * (size / 2 - 2) - 1,
      top:  size / 2 + dy * (size / 2 - 2) - 1,
      width: 3, height: 3, background: '#e6efff',
    }} />
  </div>
);

const LiveHorizon = ({ x, y, w, h, pitch = 0, roll = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxShadow: 'inset 0 0 0 1px #e6efff', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', left: -w * 0.4, top: h * 0.5 + pitch * 0.4 - 4, width: w * 1.8, height: 8,
      background: '#e6efff',
      transform: `rotate(${roll}deg)`, transformOrigin: 'center',
    }} />
    <div style={{ position: 'absolute', left: w / 2 - 3, top: h / 2 - 1, width: 7, height: 1, background: '#e6efff' }} />
    <div style={{ position: 'absolute', left: w / 2 - 1, top: h / 2 - 3, width: 1, height: 3, background: '#e6efff' }} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// Live monitor pages — read from useFlightSim() and update on every
// tick. Layouts mirror D3 (Glyph-Forward) so the marketing visual is
// the same UI the box ships with.
// ─────────────────────────────────────────────────────────────
const LiveRadio = ({ sim }) => (
  <Screen>
    <LivePageStrip active={0} />
    <ScreenIcon x={6} y={16} name="radio-tower" size={24} stroke={2} />
    <Big x={36} y={11} size={26}>{sim.linkPct}</Big>
    <T x={60} y={20} size={7}>%</T>
    <T x={60} y={28} size={5}>SIGNAL</T>
    <Bar x={36} y={36} w={84} h={4} v={sim.linkPct / 100} />
    <T x={36} y={44} size={6}>NET 25 · 915 MHz</T>
    <LiveHintBar />
  </Screen>
);

// Mission page — firmware's PAGE_MISSION (display.cpp:46): current
// waypoint out of total, distance to next, target bearing. Uses the
// `map` glyph (flight plan reads better than a single-waypoint pin).
const LiveMission = ({ sim }) => (
  <Screen>
    <LivePageStrip active={1} />
    <ScreenIcon x={6} y={16} name="map" size={24} stroke={2} />
    <Big x={36} y={11} size={26}>{sim.wpCur}/{sim.wpTotal}</Big>
    <T x={82} y={22} size={7}>WP</T>
    <T x={82} y={29} size={5}>NEXT</T>
    <T x={36} y={36} size={6}>DIST {sim.wpDist}m</T>
    <T x={36} y={44} size={6}>BRG {String(sim.wpBrg).padStart(3, '0')}°</T>
    <LiveHintBar />
  </Screen>
);

// Vehicle page — firmware's PAGE_VEHICLE (display.cpp:47): battery %,
// voltage, flight mode, arm duration. Plane glyph in the page strip.
const LiveVehicle = ({ sim }) => (
  <Screen>
    <LivePageStrip active={2} />
    <ScreenIcon x={6} y={16} name="plane" size={24} stroke={2} />
    <Big x={36} y={11} size={26}>{Math.floor(sim.battPct)}</Big>
    <T x={82} y={22} size={7}>%</T>
    <T x={82} y={29} size={5}>BATT</T>
    <Bar x={36} y={36} w={84} h={4} v={sim.battPct / 100} />
    <T x={36} y={44} size={6} bold>LOITER</T>
    <ArmBadge x={70} y={44} label="ARMED" />
    <LiveHintBar />
  </Screen>
);

const LiveController = ({ sim }) => (
  <Screen>
    <LivePageStrip active={3} />
    <LiveStickBox x={20} y={16} size={28} dx={sim.stickL.dx} dy={sim.stickL.dy} />
    <LiveStickBox x={80} y={16} size={28} dx={sim.stickR.dx} dy={sim.stickR.dy} />
    <T x={3}  y={46} size={6}>MODE 2</T>
    <T x={82} y={46} w={42} size={6} align="right">link ok</T>
    <LiveHintBar />
  </Screen>
);

// GPS page — firmware folds the old Position page into this one
// (display.cpp:49 "merged: sats + fix + HDOP + lat/lon"). Three rows
// of tight text since lat/lon eats the most width.
const LiveGPS = ({ sim }) => {
  const latAbs = Math.abs(sim.lat).toFixed(5);
  const lonAbs = Math.abs(sim.lon).toFixed(4);
  return (
    <Screen>
      <LivePageStrip active={4} />
      <ScreenIcon x={6} y={16} name="satellite" size={20} stroke={2} />
      <Big x={32} y={11} size={22}>{sim.sats}</Big>
      <T x={62} y={20} size={6}>sats · 3D</T>
      <T x={32} y={28} size={6}>HDOP 0.9</T>
      <T x={3}  y={38} size={6}>{latAbs}{sim.lat >= 0 ? 'N' : 'S'}  {lonAbs}{sim.lon >= 0 ? 'E' : 'W'}</T>
      <T x={3}  y={46} size={6}>HOME {sim.homeDist}m · BRG {String(sim.bearing).padStart(3, '0')}°</T>
      <LiveHintBar />
    </Screen>
  );
};

const LiveHUD = ({ sim }) => (
  <Screen>
    <LivePageStrip active={5} />
    <LiveHorizon x={4} y={12} w={64} h={40} pitch={sim.pitch} roll={sim.roll} />
    <T x={72} y={14} size={6}>ALT</T>
    <Big x={72} y={18} size={14}>{sim.alt}</Big>
    <T x={72} y={32} size={6}>HDG {sim.heading}°</T>
    <T x={72} y={40} size={6}>SPD {sim.spd}</T>
    <T x={72} y={46} size={6}>VS {sim.vsPos ? '+' : ''}{sim.vs}</T>
    <LiveHintBar />
  </Screen>
);

const LIVE_PAGES = {
  Radio: LiveRadio,
  Mission: LiveMission,
  Vehicle: LiveVehicle,
  Controller: LiveController,
  GPS: LiveGPS,
  HUD: LiveHUD,
};

// One sim drives every live page on the page (hero emulator + monitor
// grid). Sharing via context keeps the heading on GPS and HUD in
// lockstep, and avoids running the 10 Hz tick twice.
const SimContext = React.createContext(null);
const SimProvider = ({ children }) => {
  const sim = useFlightSim();
  return <SimContext.Provider value={sim}>{children}</SimContext.Provider>;
};
const useSim = () => React.useContext(SimContext);

// IntersectionObserver hook. `once: true` (default) latches true the first
// time the element enters view — good for one-shot reveals. `once: false`
// tracks continuously so the caller can drive an "in focus" carousel
// state on mobile, where exactly one card should be at full opacity at
// a time as the user scrolls.
const useInView = ({ rootMargin = '0px', threshold = 0, once = true } = {}) => {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);
  return [ref, inView];
};

const Emulator = () => {
  const [page, setPage] = React.useState(0);
  // Mode stack — bottom is always 'monitor'; push for overlays / sub-
  // screens, pop on hold L. Top of stack is the screen on display.
  const [stack, setStack] = React.useState(['monitor']);
  const mode = stack[stack.length - 1];
  // One cursor used by whichever screen is on top. Reset on every
  // transition so each level starts fresh.
  const [cursor, setCursor] = React.useState(0);
  // RFD NET ID, edited in rfd_edit. Persists across visits.
  const [netId, setNetId] = React.useState(0x19A4);
  // Every cycle-able setting lives here; R-click on a setting row finds
  // the row's `key` and advances `settings[key]` to the next value in its
  // `cycle` list. NetID is special-cased because the firmware uses the
  // tap-streak numeric editor for it.
  const [settings, setSettings] = React.useState(INITIAL_SETTINGS);
  const cycleSetting = (key, cycle) => setSettings((s) => {
    const i = cycle.indexOf(s[key]);
    return { ...s, [key]: cycle[(i + 1) % cycle.length] };
  });
  // Audio. Mirrors the firmware vocabulary: every Click = click; every
  // Hold-enter (open settings / quick-jump / arm) = chirp-up; every
  // Hold-exit (back-out / disarm / save) = chirp-down. Buzzer obeys the
  // live Audio→Buzzer / Audio→Volume settings.
  const buzzer = useBuzzer(settings.buzzer === 'on', settings.volume);
  const sim = useSim();

  const push    = (m) => { setStack(s => [...s, m]); setCursor(0); };
  const pop     = () => { setStack(s => (s.length > 1 ? s.slice(0, -1) : s)); setCursor(0); };
  const home    = () => { setStack(['monitor']); setCursor(0); };
  // Swap the screen on top of the stack without growing it — used when
  // the wizard auto-advances through transient steps (binding →
  // listening → bound) so a Hold-L from inside the wizard cancels back
  // to monitor instead of unwinding the wizard step-by-step.
  const replace = (m) => { setStack(s => [...s.slice(0, -1), m]); setCursor(0); };

  // Pairing wizard transient state.
  //   stepEnterMs — when the current wizard step started; used for the
  //                 FrSky-step-2 3 s anti-mash lockout (mirrors the
  //                 PAIR_LOCKOUT_MS check in display.cpp:1921).
  //   frameCount  — frames-since-bind counter shown on the Listening /
  //                 Bound screens. The firmware reads it from g_sbus;
  //                 here we count up on a 100 ms tick to simulate
  //                 SBUS coming back on the wire.
  const [stepEnterMs, setStepEnterMs] = React.useState(0);
  const [frameCount,  setFrameCount]  = React.useState(0);
  // Force a re-render every 200 ms while a wizard step has a live
  // countdown — otherwise the "Wait Ns..." text would stay frozen on
  // its initial value until the next click.
  const [, forceTick] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    if (mode !== 'pair_frsky2') return;
    const t = setInterval(forceTick, 200);
    return () => clearInterval(t);
  }, [mode]);
  const PAIR_LOCKOUT_MS = 3000;
  const lockoutRemainSec = mode === 'pair_frsky2'
    ? Math.max(0, Math.ceil((PAIR_LOCKOUT_MS - (Date.now() - stepEnterMs)) / 1000))
    : 0;

  // Auto-advance for the steps the firmware drives on a timer / SBUS
  // arrival, not a button. mode → [next-mode, delay-ms]. next-mode of
  // null means "back to monitor" (what the firmware does after Bound!).
  // The Listening leg also ticks frames upward so the counter on screen
  // moves until success — the firmware reads frames from g_sbus.frames
  // over the same window.
  React.useEffect(() => {
    const TIMERS = {
      pair_binding_frsky_in:  ['pair_frsky1',        900],
      pair_binding_elrs_in:   ['pair_elrs_instruct', 1500],
      pair_binding_frsky_out: ['pair_listen_frsky',  700],
      pair_listen_frsky:      ['pair_bound',         2200],
      pair_listen_elrs:       ['pair_bound',         1800],
      pair_bound:             [null,                 1800],
    };
    const entry = TIMERS[mode];
    if (!entry) return;
    const [next, ms] = entry;
    if (mode === 'pair_listen_frsky' || mode === 'pair_listen_elrs') {
      setFrameCount(0);
      const tick = setInterval(() => setFrameCount((n) => n + 50), 100);
      const t = setTimeout(() => { clearInterval(tick); replace(next); }, ms);
      return () => { clearInterval(tick); clearTimeout(t); };
    }
    const t = setTimeout(() => (next ? replace(next) : home()), ms);
    return () => clearTimeout(t);
  }, [mode]);

  // Stamp the entry time whenever a wizard step that the operator can
  // press R from changes — used by the FRSKY_2 lockout window above.
  React.useEffect(() => {
    if (mode === 'pair_frsky2' || mode === 'pair_frsky1' || mode === 'pair_elrs_instruct') {
      setStepEnterMs(Date.now());
    }
  }, [mode]);

  const ringPrev = () => setPage((p) => (p + EMU_PAGES.length - 1) % EMU_PAGES.length);
  const ringNext = () => setPage((p) => (p + 1) % EMU_PAGES.length);

  // Click L: in monitor, walks the ring; in a menu, cycles the cursor
  // forward (matches the firmware: L = "next row"). In ad-hoc screens
  // (pair prompt, rfd edit, etc.) it does whatever that screen needs.
  // Every click emits buzzer_click() — same as display.cpp does on every
  // BUTTON_EVT_CLICK in monitor and inside settings.
  const clickL = () => {
    buzzer.click();
    switch (mode) {
      case 'monitor':     return ringPrev();
      case 'pair_prompt': return setCursor((c) => (c + 1) % 2);
      case 'pair_frsky1':
      case 'pair_frsky2':
      case 'pair_elrs_instruct':
      case 'pair_binding_frsky_in':
      case 'pair_binding_elrs_in':
      case 'pair_binding_frsky_out':
      case 'pair_listen_frsky':
      case 'pair_listen_elrs':  return home();     // cancel — bind_cancel()
      case 'pair_bound':        return home();
      case 'rfd_gate':    return pop();            // No
      case 'rfd_edit':    return setNetId((v) => (v - 1) & 0xFFFF);
      case 'passthrough':
      case 'reboot':
      case 'about':       return;
      default: {
        const items = MENU_ITEMS[mode];
        if (items) setCursor((c) => (c + 1) % items.length);
      }
    }
  };

  // Click R: in monitor, next page; in a menu, run the cursor's
  // transition. Ad-hoc screens advance their wizard / commit.
  const clickR = () => {
    buzzer.click();
    switch (mode) {
      case 'monitor':     return ringNext();
      case 'pair_prompt': {
        // "No" returns home; "Yes" enters open_pair_dialog(). Firmware
        // shows BINDING briefly while rc_bind_frsky / rc_bind_elrs runs
        // (a blocking power-cycle of the receiver), then transitions to
        // the controller-side wizard. We mirror that with a short
        // BINDING screen whose hand-off depends on the live RC type.
        if (cursor !== 1) return home();
        return push(settings.rc_type === 'ELRS'
                    ? 'pair_binding_elrs_in'
                    : 'pair_binding_frsky_in');
      }
      // FrSky step 1/3 — R simply advances to step 2.
      case 'pair_frsky1': return push('pair_frsky2');
      // FrSky step 2/3 — R is locked out for 3 s after entering the step
      // (matches PAIR_LOCKOUT_MS in display.cpp). Mashing R during the
      // window plays the warn tone instead of advancing. Past the
      // window, R kicks off the rc_restart leg: BINDING again, then
      // listening for SBUS.
      case 'pair_frsky2': {
        if (Date.now() - stepEnterMs < PAIR_LOCKOUT_MS) {
          buzzer.warn();
          return;
        }
        return push('pair_binding_frsky_out');
      }
      // ELRS instruct — R drops straight into listening; the receiver
      // is already in bind mode from the dialog-entry power cycles.
      case 'pair_elrs_instruct': return push('pair_listen_elrs');
      // BINDING / Listening / Bound auto-advance via the effect above;
      // R clicks inside those steps are silently absorbed in firmware
      // (display.cpp:1937 "BINDING / WAIT_SBUS R clicks are silently
      // absorbed").
      case 'pair_binding_frsky_in':
      case 'pair_binding_elrs_in':
      case 'pair_binding_frsky_out':
      case 'pair_listen_frsky':
      case 'pair_listen_elrs':
      case 'pair_bound':  return;
      case 'rfd_gate':    return push('rfd_params'); // Yes
      case 'rfd_edit':    return setNetId((v) => (v + 1) & 0xFFFF);
      case 'passthrough':
      case 'reboot':
      case 'about':       return;
      default: {
        // If the focused row is a cycle-able setting, advance its value
        // in-place instead of taking a menu transition. This makes every
        // setting feel like the real device — R cycles, just as it does
        // on the box.
        const item = MENU_ITEMS[mode] && MENU_ITEMS[mode][cursor];
        if (item && item.key && item.cycle) return cycleSetting(item.key, item.cycle);
        const trans = MENU_TRANS[mode];
        if (!trans) return;
        const next = trans[cursor];
        if (next == null || next === '__noop') return;
        if (next === '__pop')  return pop();
        if (next === '__home') return home();
        return push(next);
      }
    }
  };

  // Hold L: open the full Settings menu from monitor, otherwise pop one
  // level (firmware: HOLD_START on BTN_LEFT sets s_in_settings = true).
  // Entering settings = chirp-up; backing out = chirp-down, matching
  // display.cpp's buzzer_chirp_up/down at the same edges.
  const holdL = () => {
    if (mode === 'monitor') { buzzer.chirpUp(); push('settings'); }
    else                    { buzzer.chirpDown(); pop(); }
  };
  // Hold R: quick-jump from a monitor page straight to the category most
  // relevant to that page — Radio→RFD gate, Sticks→Receiver, every other
  // page→Vehicle (mirrors page_to_quick_cat in display.cpp:433-440).
  // Page order: Radio, Mission, Vehicle, Controller, GPS, HUD. From
  // inside a menu, jump straight back to monitor (deep-stack escape
  // hatch). Quick-jump = chirp-up; escape-to-home = chirp-down.
  const holdR = () => {
    if (mode !== 'monitor') { buzzer.chirpDown(); return home(); }
    const quickJump = ['rfd_gate', 'set_vehicle', 'set_vehicle',
                       'set_receiver', 'set_vehicle', 'set_vehicle'][page];
    if (quickJump) { buzzer.chirpUp(); push(quickJump); }
  };

  const lProps = useHold(clickL, holdL);
  const rProps = useHold(clickR, holdR);

  // Keyboard shortcuts: ← / → for click L / R, Esc to exit overlays.
  // Hold-via-keyboard is intentionally not wired — auto-repeating arrow
  // keys would treat a single sustained press as a click stream, which
  // breaks the click/hold distinction the device relies on.
  React.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft')       { e.preventDefault(); clickL(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); clickR(); }
      else if (e.key === 'Escape' && mode !== 'monitor') home();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, cursor]);

  let screen;
  if (mode === 'monitor') {
    const Live = LIVE_PAGES[EMU_PAGES[page]];
    screen = <Live sim={sim} />;
  } else if (MENU_ITEMS[mode]) {
    screen = <ScreenMenu mode={mode} cursor={cursor} settings={settings} />;
  } else if (mode === 'rfd_gate')    screen = <ScreenRfdGate />;
  else if (mode === 'rfd_edit')      screen = <ScreenRfdEdit value={netId} />;
  else if (mode === 'pair_prompt')          screen = <ScreenPairPrompt cursor={cursor} />;
  else if (mode === 'pair_binding_frsky_in'
        || mode === 'pair_binding_elrs_in'
        || mode === 'pair_binding_frsky_out') screen = <ScreenPairBinding />;
  else if (mode === 'pair_frsky1')          screen = <ScreenPairFrsky1 />;
  else if (mode === 'pair_frsky2')          screen = <ScreenPairFrsky2 lockoutRemainSec={lockoutRemainSec} />;
  else if (mode === 'pair_elrs_instruct')   screen = <ScreenPairElrsInstruct />;
  else if (mode === 'pair_listen_frsky')    screen = <ScreenPairListenFrsky frames={frameCount} />;
  else if (mode === 'pair_listen_elrs')     screen = <ScreenPairListenElrs frames={frameCount} />;
  else if (mode === 'pair_bound')           screen = <ScreenPairBound frames={frameCount} />;
  else if (mode === 'passthrough')   screen = <ScreenPassthrough />;
  else if (mode === 'reboot')        screen = <ScreenReboot />;
  else if (mode === 'about')         screen = <ScreenAbout />;

  return (
    <div className="pp-emu">
      <div className="pp-emu-screen">
        {screen}
        {/* Per-page click zones. Each hit-box covers exactly one icon in
            the D3 page-strip. Native icon grid: x = 4 + i*20, y = 1,
            9 × 7. The icons paint *inside* the c2-stage, which has
            18 px of stage padding + 6 px of bezel padding = 24 px of
            inset on each side, so the on-screen coordinates of an icon
            are ((24 + 4 + i*20) * k, (24 + 1) * k). Only rendered in
            monitor mode — the overlays don't show the page-strip, so
            there's nothing to click. */}
        {mode === 'monitor' && (
          <div className="pp-emu-screen-tabs" role="tablist" aria-label="Pages">
            {EMU_PAGES.map((p, j) => {
              const nativeX = 24 + 4 + j * 20;
              const nativeY = 24 + 1;
              return (
                <button type="button" key={p} title={p} role="tab"
                  aria-selected={j === page}
                  className={`pp-emu-screen-tab${j === page ? ' is-active' : ''}`}
                  style={{
                    left:   `calc(${nativeX}px * var(--hero-k, 3))`,
                    top:    `calc(${nativeY}px * var(--hero-k, 3))`,
                    width:  `calc(9px * var(--hero-k, 3))`,
                    height: `calc(7px * var(--hero-k, 3))`,
                  }}
                  onClick={() => setPage(j)}
                  aria-label={p} />
              );
            })}
          </div>
        )}
      </div>
      <div className="pp-emu-controls">
        <button type="button" className="pp-emu-btn" {...lProps}
          aria-label="L · click for previous, hold for settings">
          <span className="pp-emu-btn-key">L</span>
          <span className="pp-emu-btn-sub">hold · settings</span>
        </button>
        <button type="button" className="pp-emu-btn" {...rProps}
          aria-label="R · click for next, hold to quick-jump to the page's category">
          <span className="pp-emu-btn-key">R</span>
          <span className="pp-emu-btn-sub">hold · jump</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Monitor section — 3 × 2 grid on desktop with hover-revealed
// explainers, single column on mobile with each card fading up as
// it enters the viewport (Apple-style scroll storytelling).
// ─────────────────────────────────────────────────────────────
const MONITOR_PAGES = [
  { id: 'Radio',      cap: 'RADIO',
    desc: 'Link strength, network ID, frequency.' },
  { id: 'Mission',    cap: 'MISSION',
    desc: 'Current waypoint of total, distance to the next, bearing to target.' },
  { id: 'Vehicle',    cap: 'VEHICLE',
    desc: 'Battery, voltage, flight mode, arm duration.' },
  { id: 'Controller', cap: 'STICKS',
    desc: 'Live stick positions and receiver health.' },
  { id: 'GPS',        cap: 'GPS',
    desc: 'Satellite count, fix quality, HDOP, lat/lon, distance from home, bearing.' },
  { id: 'HUD',        cap: 'HUD',
    desc: 'Attitude horizon, altitude, heading, speed, vertical rate.' },
];

const MonitorCard = ({ page, n }) => {
  const sim = useSim();
  // Focus band: the middle ~30% of the viewport. A card is "in focus"
  // while it crosses that band. Desktop ignores the class (cards are
  // always full opacity); on mobile the class drives the carousel
  // dim/lift effect.
  const [ref, focus] = useInView({
    rootMargin: '-35% 0px -35% 0px',
    threshold: 0,
    once: false,
  });
  const Live = LIVE_PAGES[page.id];
  return (
    <article ref={ref} className={`pp-mon-card${focus ? ' is-focus' : ''}`}>
      <div className="pp-mon-card-screen">
        <Live sim={sim} />
      </div>
      <div className="pp-mon-card-meta">
        <div className="frame-caption">
          <span className="num">{n}</span>
          {page.cap}
        </div>
        <div className="pp-mon-card-desc">{page.desc}</div>
      </div>
    </article>
  );
};

const MonitorSection = () => (
  <section className="pp-section" id="monitor">
    <div className="pp-section-head">
      <Eyebrow n="01">Monitor</Eyebrow>
      <h2 className="pp-h2">Six pages. Two buttons.</h2>
      <p className="pp-sub">
        <span className="pp-sub-desktop">Hover each screen to see what it does.</span>
        <span className="pp-sub-mobile">Scroll to see what each screen does.</span>
      </p>
    </div>
    <div className="pp-mon-grid">
      {MONITOR_PAGES.map((p, i) => <MonitorCard key={p.id} page={p} n={i + 1} />)}
    </div>
  </section>
);

const ToolsSection = () => (
  <section className="pp-section pp-section-dark" id="tools">
    <div className="pp-section-head">
      <Eyebrow n="02">Tools</Eyebrow>
      <h2 className="pp-h2">Everything you used to need a laptop for.</h2>
      <p className="pp-sub pp-sub-dark">
        Jobs that used to mean opening MissionPlanner, three hands, 
        and a YouTube tutorial. All of them happen on the MissionWeaver now.
      </p>
    </div>
    <div className="pp-tools">
      <div className="pp-tool">
        <ScreenCard><ToolRfdParamsScreen /></ScreenCard>
        <h3 className="pp-tool-h">RFDTools? No thanks.</h3>
        <p className="pp-tool-p">
          As lovely as it is booting up Windows 2K era software to configure SiK Parameters in 100 degrees,
          we thought we'd reinvent the wheel. All parameters you'd want to touch are configurable on-device, and yes, they'll sync to remote.
        </p>
      </div>
      <div className="pp-tool">
        <ScreenCard><ToolBoundScreen /></ScreenCard>
        <h3 className="pp-tool-h">Bind your receiver. Easy.</h3>
        <p className="pp-tool-p">
          Why waste your time trying to remember the button sequence to pair your controller?
          The MissionWeaver puts the receiver into bind mode automattically,
          then walks you through what to press on the controller. 
        </p>
      </div>
      <div className="pp-tool">
        <ScreenCard><ToolMonitorPagesScreen /></ScreenCard>
        <h3 className="pp-tool-h">Everything your aircraft is telling you.</h3>
        <p className="pp-tool-p">
          Exactly what you care about, when you care about it. No MissionPlanner Required.
          Enable auto-cycle for hands-free monitoring.
        </p>
      </div>
    </div>
  </section>
);

const PrincipleRow = ({ kbd, title, body }) => (
  <div className="pp-principle">
    <div className="pp-principle-kbd">
      {kbd.map((k, i) => (
        <React.Fragment key={i}>
          <span className={`btn-chip ${k.hold ? 'outline' : ''}`}>{k.label}</span>
          {i < kbd.length - 1 && <span className="pp-principle-plus">+</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="pp-principle-text">
      <div className="pp-principle-title">{title}</div>
      <div className="pp-principle-body">{body}</div>
    </div>
  </div>
);

const PrinciplesSection = () => (
  <section className="pp-section" id="principles">
    <div className="pp-section-head">
      <Eyebrow n="03">Rules</Eyebrow>
      <h2 className="pp-h2">Two buttons. Three gestures. That’s the whole interface.</h2>
      <p className="pp-sub">
        No menus you can get lost in. No combos you have to remember.
      </p>
    </div>
    <div className="pp-principles">
      <PrincipleRow
        kbd={[{ label: 'L' }]}
        title="Click left"
        body="Previous page, next setting, cancel."
      />
      <PrincipleRow
        kbd={[{ label: 'R' }]}
        title="Click right"
        body="Next page, confirm."
      />
      <PrincipleRow
        kbd={[{ label: 'L', hold: true }]}
        title="Hold left"
        body="Open Settings Menu, Exit."
      />
      <PrincipleRow
        kbd={[{ label: 'R', hold: true }]}
        title="Hold right"
        body="Quick-jump to setting for the page you’re on."
      />
      <PrincipleRow
        kbd={[{ label: 'L', hold: true }, { label: 'R', hold: true }]}
        title="Hold both"
        body="Actions overlay — Pair RC · Arm / Disarm · Reboot"
      />
    </div>
  </section>
);

const Spec = ({ k, v }) => (
  <div className="pp-spec">
    <div className="pp-spec-k">{k}</div>
    <div className="pp-spec-v">{v}</div>
  </div>
);

const SpecsSection = () => (
  <section className="pp-section pp-section-specs" id="specs">
    <div className="pp-section-head">
      <Eyebrow n="04">Specs</Eyebrow>
      <h2 className="pp-h2">Everything's included.</h2>
    </div>
    <div className="pp-specs">
      <div className="pp-specs-col">
        <Spec k="Radio" v="RFD900x · 915 MHz · 1 W" />
        <Spec k="Range" v="40 km LOS" />
        <Spec k="Antenna" v="2× SMA" />
        <Spec k="Receiver" v="ELRS 2.4 GHz · External SBUS" />
      </div>
      <div className="pp-specs-col">
        <Spec k="Display" v="128 × 64 OLED · monochrome" />
        <Spec k="Input" v="2 buttons · click + hold" />
        <Spec k="Compute" v="ATSAMD21" />
        <Spec k="Refresh" v="100 Hz" />
      </div>
      <div className="pp-specs-col">
        <Spec k="Power" v="USB-C" />
        <Spec k="Bridge" v="RFD AT · ELRS flash" />
        <Spec k="Firmware" v="Completely offline · No Subscriptions" />
        <Spec k="Weight" v="312 g · 122 × 78 × 28 mm" />
      </div>
    </div>
    <p className="pp-specs-note">
      Ships with a 2.4 GHz ELRS receiver installed. FrSky ACCESS and ACCST D16
      variants are available on request; <a href="mailto:contact@missionweaver.io">get in touch</a> to order one.
    </p>
  </section>
);

const Order = () => (
  <section className="pp-section pp-order" id="order">
    <div className="pp-order-inner">
      <Eyebrow>Available Now</Eyebrow>
      <h2 className="pp-h2 pp-h2-xl">
        Put the laptop down.<br/>
        <span className="pp-faint">Pick it up only when you want to.</span>
      </h2>
      <div className="pp-cta">
        <a href="docs.html" className="pp-btn pp-btn-ghost pp-btn-xl">Read the docs →</a>
      </div>
      <div className="pp-fine">
        Love it or your money back. Ships working right out the box. No subscription needed.
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="pp-footer">
    <div className="pp-footer-row">
      <div className="pp-footer-links">
        <a href="docs.html">Docs</a>
        <a href="mailto:contact@missionweaver.io">Email</a>
      </div>
    </div>
    <div className="pp-footer-fine">
      Designed in the USA · MAVLink is a trademark of Lorenz Meier. RFD is a trademark of RFDesign Pty Ltd.
    </div>
  </footer>
);

const App = () => {
  // Track whether the hero's Buy Now is still on screen. `once: false`
  // so the flag toggles back true if the user scrolls up — the nav
  // CTA hides again so we never show two CTAs side by side on mobile.
  // rootMargin shrinks the observer's root by the fixed navbar's height
  // at the top, so the hero CTA counts as "out of view" the moment it
  // slides under the navbar (not when it would normally clear the raw
  // viewport edge — that's where the navbar is now covering it).
  const [heroCtaRef, heroCtaInView] = useInView({
    threshold: 0,
    once: false,
    rootMargin: '-74px 0px 0px 0px',
  });
  return (
    <ShopProvider>
      <SimProvider>
        <div className="pp">
          <Nav showCta={!heroCtaInView} />
          <Hero heroCtaRef={heroCtaRef} />
          <MonitorSection />
          <ToolsSection />
          <PrinciplesSection />
          <SpecsSection />
          <Order />
          <Footer />
          <CartDrawer />
        </div>
      </SimProvider>
    </ShopProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
