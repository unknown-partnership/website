// Core primitives for the 128×64 OLED. Every component speaks in display px.
// Render at 1x into .c2-screen, then the page chrome scales it up.

// ---------- Screen wrapper -----------------------------------------------

const Screen = ({ children, style }) => (
  <div className="c2-stage">
    <div className="c2-bezel">
      <div className="c2-screen" style={style}>
        {children}
      </div>
    </div>
  </div>
);

// Scale a Screen for legibility. Wrap one Screen with <Scaled k={4}>.
const Scaled = ({ k = 4, children, style }) => (
  <div className="c2-scale" style={{ ...style }}>
    <div style={{ transform: `scale(${k})`, transformOrigin: 'top left' }}>
      {children}
    </div>
  </div>
);

// ---------- Layout helpers ------------------------------------------------

const Abs = ({ x = 0, y = 0, w, h, style, children, className = '' }) => (
  <div
    className={className}
    style={{
      position: 'absolute',
      left: x, top: y,
      width: w, height: h,
      ...style,
    }}
  >
    {children}
  </div>
);

const HR = ({ y, x = 0, w = 128, strong = false, dashed = false, style }) => (
  <div style={{
    position: 'absolute',
    left: x, top: y, width: w, height: 1,
    background: dashed
      ? 'repeating-linear-gradient(to right, #e6efff 0 1px, transparent 1px 2px)'
      : '#e6efff',
    opacity: strong ? 1 : 0.6,
    ...style,
  }} />
);

const VR = ({ x, y = 0, h = 64, strong = false, style }) => (
  <div style={{
    position: 'absolute',
    left: x, top: y, width: 1, height: h,
    background: '#e6efff',
    opacity: strong ? 1 : 0.6,
    ...style,
  }} />
);

const Box = ({ x, y, w, h, filled = false, style, children }) => (
  <div style={{
    position: 'absolute',
    left: x, top: y, width: w, height: h,
    boxShadow: 'inset 0 0 0 1px #e6efff',
    background: filled ? '#e6efff' : 'transparent',
    color: filled ? '#050403' : '#e6efff',
    ...style,
  }}>
    {children}
  </div>
);

const Inv = ({ x, y, w, h, children, style, pad = 0 }) => (
  <div className="c2-inv" style={{
    position: 'absolute',
    left: x, top: y, width: w, height: h,
    padding: pad,
    ...style,
  }}>
    {children}
  </div>
);

// ---------- Text helpers (Silkscreen pixel font) --------------------------

const T = ({ x = 0, y = 0, w, children, style, size = 8, inv = false, bold = false, align }) => (
  <div style={{
    position: 'absolute',
    left: x, top: y, width: w,
    fontFamily: 'Silkscreen, monospace',
    fontSize: size, lineHeight: `${size}px`,
    color: inv ? '#050403' : '#e6efff',
    fontWeight: bold ? 700 : 400,
    textAlign: align,
    letterSpacing: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }}>
    {children}
  </div>
);

// Larger numeric readout (for HUD-style values). Uses VT323 since it stays
// crisp at larger sizes and reads as "embedded LCD".
const Big = ({ x = 0, y = 0, w, children, style, size = 22, inv = false, align = 'left' }) => (
  <div style={{
    position: 'absolute',
    left: x, top: y, width: w,
    fontFamily: 'VT323, monospace',
    fontSize: size, lineHeight: `${size}px`,
    color: inv ? '#050403' : '#e6efff',
    letterSpacing: -1,
    textAlign: align,
    whiteSpace: 'nowrap',
    overflow: 'visible',
    ...style,
  }}>
    {children}
  </div>
);

// ---------- Common chrome -------------------------------------------------

// Standard header — 9px tall. Link state on left, page title centered (opt),
// arm/pass badge on right. Variants per direction will sub this out.
const Header = ({ link = 4, page = 'RADIO', count, arm = false, pass = false, uptime, mode }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 9 }}>
    {/* link bars */}
    <SignalBars x={1} y={2} bars={link} />
    {uptime && <T x={16} y={1.5} size={6}>{uptime}</T>}
    {page && (
      <T x={0} y={1.5} w={128} align="center" size={7}>{page}{count ? `  ${count}` : ''}</T>
    )}
    {arm && <ArmBadge x={108} y={0.5} label="ARM" />}
    {pass && !arm && <ArmBadge x={102} y={0.5} label="PASS" />}
    {mode && <ModeChip x={mode.x ?? 96} y={0.5} label={mode.label} />}
    <HR y={9} />
  </div>
);

const SignalBars = ({ x = 0, y = 0, bars = 4 }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'flex-end', gap: 1, height: 5 }}>
    {[2, 3, 4, 5].map((h, i) => (
      <div key={i} style={{
        width: 1, height: h,
        background: '#e6efff',
        opacity: i < bars ? 1 : 0.25,
      }} />
    ))}
  </div>
);

const ArmBadge = ({ x = 110, y = 0, label = 'ARM' }) => (
  <div className="c2-inv" style={{
    position: 'absolute',
    left: x, top: y,
    height: 8,
    padding: '0 2px',
    fontFamily: 'Silkscreen, monospace',
    fontSize: 6, lineHeight: '8px',
    fontWeight: 700,
    letterSpacing: 0,
  }}>{label}</div>
);

const ModeChip = ({ x, y, label }) => (
  <div className="c2-inv" style={{
    position: 'absolute',
    left: x, top: y,
    height: 8,
    padding: '0 2px',
    fontFamily: 'Silkscreen, monospace',
    fontSize: 6, lineHeight: '8px',
    fontWeight: 700,
  }}>{label}</div>
);

// Top-strip mode banner (Direction 4) — full-width inverted 10px row.
const ModeBanner = ({ label, sub, icon, link = 4, arm = false }) => (
  <Inv x={0} y={0} w={128} h={10} pad={0}>
    <div style={{ position: 'relative', width: 128, height: 10 }}>
      {icon && (
        <div style={{ position: 'absolute', left: 2, top: 1 }}>
          <Icon name={icon} size={8} stroke={2.4} />
        </div>
      )}
      <div style={{
        position: 'absolute', left: icon ? 12 : 3, top: 1,
        fontFamily: 'Silkscreen, monospace', fontSize: 7, lineHeight: '8px', fontWeight: 700,
        color: '#050403',
      }}>{label}{sub ? <span style={{ opacity: .65, marginLeft: 4 }}>{sub}</span> : null}</div>
      <div style={{
        position: 'absolute', right: 2, top: 1,
        fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '8px',
        color: '#050403',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {arm && <span style={{ fontWeight: 700 }}>ARM</span>}
        <SignalBarsInv bars={link} />
      </div>
    </div>
  </Inv>
);

const SignalBarsInv = ({ bars = 4 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1, height: 5, marginLeft: 2 }}>
    {[2, 3, 4, 5].map((h, i) => (
      <div key={i} style={{
        width: 1, height: h,
        background: '#050403',
        opacity: i < bars ? 1 : 0.3,
      }} />
    ))}
  </div>
);

// ---------- Hint bar ------------------------------------------------------

// Standard 9px hint bar (bottom). Two slots per side: click + (optional) hold.
// Pass short labels (2-4 chars ideal). Order on screen: [L][hl] ... [hr][R].
const HintBar = ({ l, r, hl, hr, y = 55, iconL, iconR, icons = false }) => (
  <div style={{
    position: 'absolute', left: 0, top: y, width: 128, height: 9,
    background: '#050403',
    borderTop: '1px solid rgba(230,239,255,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {l != null && <HintChip dir="L" label={l} icon={iconL} useIcon={icons} />}
      {hl != null && <HintChip dir="L" label={hl} hold useIcon={icons} />}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {hr != null && <HintChip dir="R" label={hr} hold rightAligned useIcon={icons} />}
      {r != null && <HintChip dir="R" label={r} icon={iconR} rightAligned useIcon={icons} />}
    </div>
  </div>
);

const HintChip = ({ dir, label, hold = false, icon, useIcon = false, rightAligned = false }) => {
  const badge = (
    <span style={{
      background: hold ? 'transparent' : '#e6efff',
      color: hold ? '#e6efff' : '#050403',
      boxShadow: hold ? 'inset 0 0 0 1px #e6efff' : 'none',
      padding: '0 1px', borderRadius: 1,
      fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px',
      fontWeight: 700,
    }}>{dir}</span>
  );
  const text = (
    <span style={{
      fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px',
      color: '#e6efff',
      display: 'inline-flex', alignItems: 'center', gap: 1,
    }}>
      {useIcon && icon ? <Icon name={icon} size={7} stroke={2.4} /> : label}
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {rightAligned ? <>{text}{badge}</> : <>{badge}{text}</>}
    </span>
  );
};

// ---------- Bars, progress, sparks ---------------------------------------

const Bar = ({ x, y, w, h = 4, v = 0.5, label, ticks = false }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
    <div style={{
      position: 'absolute', inset: 0,
      boxShadow: 'inset 0 0 0 1px #e6efff',
    }} />
    <div style={{
      position: 'absolute', left: 1, top: 1,
      width: Math.max(0, Math.min(1, v)) * (w - 2),
      height: h - 2,
      background: '#e6efff',
    }} />
  </div>
);

const Pip = ({ x, y, on = true, size = 2 }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: size, height: size,
    background: on ? '#e6efff' : 'transparent',
    boxShadow: on ? 'none' : 'inset 0 0 0 1px rgba(230,239,255,.5)',
  }} />
);

// dotted/segmented border around a region (used for "this is selected" w/o invert)
const Marquee = ({ x, y, w, h }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    background:
      'linear-gradient(to right, #e6efff 0, #e6efff 2px, transparent 2px) top left/4px 1px repeat-x,' +
      'linear-gradient(to right, #e6efff 0, #e6efff 2px, transparent 2px) bottom left/4px 1px repeat-x,' +
      'linear-gradient(to bottom, #e6efff 0, #e6efff 2px, transparent 2px) top left/1px 4px repeat-y,' +
      'linear-gradient(to bottom, #e6efff 0, #e6efff 2px, transparent 2px) top right/1px 4px repeat-y',
    backgroundColor: 'transparent',
  }} />
);

// Filled progress bar w/ optional percentage / spinner role
const Progress = ({ x, y, w = 80, h = 6, v = 0.4 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxShadow: 'inset 0 0 0 1px #e6efff' }}>
    <div style={{ position: 'absolute', left: 1, top: 1, height: h - 2, width: v * (w - 2), background: '#e6efff' }} />
  </div>
);

// ---------- Icons placed inside the screen --------------------------------

const ScreenIcon = ({ x, y, name, size = 16, stroke = 2, inv = false }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    color: inv ? '#050403' : '#e6efff',
  }}>
    <Icon name={name} size={size} stroke={stroke} />
  </div>
);

// ---------- Side rail (Direction 3) ---------------------------------------

// 6px-wide left rail with N tick marks; active one inverted block.
const SideRail = ({ count = 6, active = 0, w = 6, h = 64, hideTop = 9, hideBottom = 0 }) => {
  const usable = h - hideTop - hideBottom;
  const step = usable / count;
  return (
    <div style={{ position: 'absolute', left: 0, top: hideTop, width: w, height: usable }}>
      <VR x={w - 1} y={0} h={usable} strong={false} />
      {Array.from({ length: count }).map((_, i) => {
        const y = i * step + (step - 7) / 2;
        return i === active ? (
          <div key={i} className="c2-inv" style={{
            position: 'absolute', left: 0, top: y, width: w - 1, height: 7,
            fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px',
            textAlign: 'center', fontWeight: 700,
          }}>{i + 1}</div>
        ) : (
          <T key={i} x={0} y={y + 0.5} w={w - 1} align="center" size={6}>{i + 1}</T>
        );
      })}
    </div>
  );
};

// ---------- Menu row (used in settings list flows) ------------------------

const MenuRow = ({ x = 0, y, w = 128, label, value, icon, selected = false, chevron = false, danger = false, ext = false }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: 11,
    background: selected ? '#e6efff' : 'transparent',
    color: selected ? '#050403' : '#e6efff',
    display: 'flex', alignItems: 'center', padding: '0 3px',
    fontFamily: 'Silkscreen, monospace', fontSize: 7,
  }}>
    {selected && <span style={{ marginRight: 2, fontWeight: 700 }}>▸</span>}
    {icon && (
      <span style={{ marginRight: 3, display: 'flex' }}>
        <Icon name={icon} size={9} stroke={2.2} style={{ color: selected ? '#050403' : '#e6efff' }} />
      </span>
    )}
    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip' }}>{label}</span>
    {ext && <span style={{ opacity: .6, marginRight: 2 }}>ext</span>}
    {value && <span style={{ opacity: selected ? 1 : .9 }}>{value}</span>}
    {danger && <Icon name="lock" size={8} stroke={2.4} style={{ marginLeft: 3, color: selected ? '#050403' : '#e6efff' }} />}
    {chevron && <span style={{ marginLeft: 2 }}>›</span>}
  </div>
);

// ---------- Page-strip caption (outside the screen) ----------------------

const Caption = ({ n, children }) => (
  <div className="frame-caption">
    {n != null && <span className="num">{n}</span>}
    {children}
  </div>
);

const Strip = ({ children, captions }) => (
  <div className="frame-strip">
    {React.Children.toArray(children).map((c, i, arr) => (
      <React.Fragment key={i}>
        <div>
          {c}
          {captions && captions[i] && <Caption n={i + 1}>{captions[i]}</Caption>}
        </div>
        {i < arr.length - 1 && (
          <div className="frame-arrow">
            <Icon name="arrow-right" size={14} stroke={1.8} style={{ color: 'rgba(40,30,20,.4)' }} />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ---------- Direction header (used inside each artboard) -----------------

const DirHead = ({ n, title, subtitle, rule }) => (
  <div className="dir-head">
    <div className="num">Direction {n}</div>
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
    {rule && <div className="rule">{rule}</div>}
  </div>
);

Object.assign(window, {
  Screen, Scaled,
  Abs, HR, VR, Box, Inv,
  T, Big,
  Header, SignalBars, SignalBarsInv, ArmBadge, ModeChip, ModeBanner,
  HintBar, HintChip,
  Bar, Pip, Marquee, Progress,
  ScreenIcon, SideRail,
  MenuRow, Caption, Strip, DirHead,
});
