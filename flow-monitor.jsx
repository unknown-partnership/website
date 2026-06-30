// Monitor ring — 6 home pages, one strip per direction.
// Pages: Radio, Vehicle, Controller (sticks), GPS, HUD, Position
// Click L = prev page, Click R = next page, Hold L = exit to actions overlay,
// Hold R = jump to the settings category that matches the active page.

// ---------- Shared bits used across multiple directions -------------------

const StickBox = ({ x, y, size = 22, dx = 0.0, dy = 0.0, label }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, boxShadow: 'inset 0 0 0 1px #e6efff' }}>
    {/* crosshair */}
    <div style={{ position: 'absolute', left: 0, top: size / 2, width: size, height: 1, background: 'rgba(230,239,255,.35)' }} />
    <div style={{ position: 'absolute', left: size / 2, top: 0, width: 1, height: size, background: 'rgba(230,239,255,.35)' }} />
    <div style={{
      position: 'absolute',
      left: size / 2 + dx * (size / 2 - 2) - 1,
      top: size / 2 + dy * (size / 2 - 2) - 1,
      width: 3, height: 3, background: '#e6efff',
    }} />
    {label && <div style={{ position: 'absolute', left: 0, top: size + 1, width: size, textAlign: 'center', fontFamily: 'Silkscreen, monospace', fontSize: 6, color: '#e6efff' }}>{label}</div>}
  </div>
);

const Horizon = ({ x, y, w, h, pitch = -8, roll = 12 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxShadow: 'inset 0 0 0 1px #e6efff', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', left: -w * 0.4, top: h * 0.5 + pitch * 0.4 - 4, width: w * 1.8, height: 8,
      background: '#e6efff',
      transform: `rotate(${roll}deg)`, transformOrigin: 'center',
    }} />
    {/* center pip */}
    <div style={{ position: 'absolute', left: w / 2 - 3, top: h / 2 - 1, width: 7, height: 1, background: '#e6efff' }} />
    <div style={{ position: 'absolute', left: w / 2 - 1, top: h / 2 - 3, width: 1, height: 3, background: '#e6efff' }} />
  </div>
);

// Tiny 4-step gauge bar (sat count, etc.)
const Pips = ({ x, y, n = 12, max = 12 }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} style={{ width: 2, height: 5, background: i < n ? '#e6efff' : 'transparent', boxShadow: i < n ? 'none' : 'inset 0 0 0 1px rgba(230,239,255,.35)' }} />
    ))}
  </div>
);

// =========================================================================
// DIRECTION 1 — Hint-Bar Conservative
// =========================================================================

const D1 = {
  Radio: () => (
    <Screen>
      <Header link={4} page="RADIO" uptime="01:24" arm />
      <T x={3} y={13} size={6}>RSSI</T>
      <Big x={2} y={18} size={26}>−58</Big>
      <T x={42} y={22} size={6}>dBm</T>
      <T x={42} y={30} size={6}>noise −104</T>
      <T x={3} y={40} size={6}>NET 25 · 915.000</T>
      <Bar x={3} y={47} w={122} h={4} v={0.74} />
      <HintBar l="prev" r="next" hl="menu" hr="RFD" />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <Header link={4} page="VEHICLE" uptime="01:24" arm />
      <T x={3} y={13} size={6}>MODE</T>
      <T x={3} y={20} size={8} bold>STABILIZE</T>
      <T x={3} y={31} size={6}>BATT</T>
      <Big x={2} y={36} size={20}>14.8</Big>
      <T x={36} y={42} size={6}>v</T>
      <T x={48} y={36} size={6}>72%</T>
      <Bar x={48} y={43} w={32} h={3} v={0.72} />
      <T x={86} y={31} size={6}>ARM</T>
      <T x={86} y={38} size={7} bold>3m 12s</T>
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <Header link={4} page="STICKS" uptime="01:24" arm />
      <T x={3} y={13} size={6}>MODE 2 · FrSky</T>
      <StickBox x={14} y={22} size={26} dx={-0.6} dy={0.0} label="thr / rud" />
      <StickBox x={88} y={22} size={26} dx={0.25} dy={-0.4} label="ail / ele" />
      <T x={56} y={26} size={6}>L  R</T>
      <T x={56} y={34} size={7} bold>OK</T>
      <HintBar l="prev" r="next" hl="menu" hr="RX" />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <Header link={4} page="GPS" uptime="01:24" arm />
      <T x={3} y={13} size={6}>FIX</T>
      <T x={3} y={20} size={8} bold>3D</T>
      <T x={3} y={33} size={6}>SATS</T>
      <Big x={2} y={38} size={20}>12</Big>
      <T x={32} y={33} size={6}>HDOP</T>
      <T x={32} y={40} size={8} bold>0.9</T>
      <T x={66} y={13} size={6}>SAT BARS</T>
      <Pips x={66} y={22} n={9} max={12} />
      <T x={66} y={33} size={6}>HEAD</T>
      <T x={66} y={40} size={8} bold>274°</T>
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <Header link={4} page="HUD" uptime="01:24" arm />
      <Horizon x={36} y={12} w={56} h={32} pitch={-4} roll={9} />
      <T x={3} y={14} size={6}>ALT</T>
      <T x={3} y={20} size={8} bold>142</T>
      <T x={3} y={27} size={6}>m</T>
      <T x={3} y={36} size={6}>SPD</T>
      <T x={3} y={42} size={8} bold>14</T>
      <T x={97} y={14} size={6}>HDG</T>
      <T x={97} y={20} size={8} bold>274</T>
      <T x={97} y={36} size={6}>VS</T>
      <T x={97} y={42} size={8} bold>+0.6</T>
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <Header link={4} page="POSITION" uptime="01:24" arm />
      <T x={3} y={13} size={6}>LAT</T>
      <T x={3} y={20} size={8} bold>37.42456N</T>
      <T x={3} y={29} size={6}>LON</T>
      <T x={3} y={36} size={8} bold>-122.0974W</T>
      <T x={3} y={45} size={6}>ALT 142m · HM 213m</T>
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
};

// =========================================================================
// DIRECTION 2 — Always-On Hints
// Header collapses to 7px, hint bar grows to 9px and is permanent.
// =========================================================================

const D2Header = ({ page, arm = false, link = 4 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 7 }}>
    <SignalBars x={1} y={1} bars={link} />
    <T x={0} y={0.5} w={128} align="center" size={6}>{page}</T>
    {arm && <div className="c2-inv" style={{
      position: 'absolute', right: 1, top: 0, height: 7, padding: '0 2px',
      fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px', fontWeight: 700,
    }}>ARM</div>}
    <HR y={7} />
  </div>
);

const D2HintBar = ({ l, r, hl, hr }) => (
  <div style={{
    position: 'absolute', left: 0, top: 54, width: 128, height: 10,
    background: '#050403', borderTop: '1px solid rgba(230,239,255,.6)',
    display: 'flex',
  }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2px', borderRight: '1px solid rgba(230,239,255,.3)' }}>
      <D2HRow dir="L" hold={false} label={l} />
      {hl && <D2HRow dir="L" hold label={hl} />}
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2px', alignItems: 'flex-end' }}>
      <D2HRow dir="R" hold={false} label={r} right />
      {hr && <D2HRow dir="R" hold label={hr} right />}
    </div>
  </div>
);

const D2HRow = ({ dir, hold, label, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 2,
    fontFamily: 'Silkscreen, monospace', fontSize: 5, lineHeight: '5px',
    color: '#e6efff',
    flexDirection: right ? 'row-reverse' : 'row',
  }}>
    <span style={{
      background: hold ? 'transparent' : '#e6efff',
      color: hold ? '#e6efff' : '#050403',
      boxShadow: hold ? 'inset 0 0 0 1px #e6efff' : 'none',
      padding: '0 1px', fontWeight: 700,
    }}>{dir}</span>
    <span>{label}</span>
  </div>
);

const D2Hints = { l: 'prev', r: 'next', hl: 'menu', hr: 'jump' };

const D2 = {
  Radio: () => (
    <Screen>
      <D2Header page="RADIO 1/6" arm />
      <T x={3} y={11} size={6}>RSSI</T>
      <Big x={2} y={15} size={24}>−58</Big>
      <T x={40} y={20} size={6}>dBm</T>
      <T x={40} y={28} size={6}>noise −104</T>
      <T x={3} y={38} size={6}>NET 25 · 915.000 MHz</T>
      <Bar x={3} y={45} w={122} h={4} v={0.74} />
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <D2Header page="VEHICLE 2/6" arm />
      <T x={3} y={11} size={6}>STABILIZE · ARMED 3m12s</T>
      <Big x={2} y={18} size={22}>14.8</Big>
      <T x={38} y={26} size={6}>v</T>
      <T x={50} y={20} size={6}>72%</T>
      <Bar x={50} y={26} w={70} h={3} v={0.72} />
      <T x={3} y={36} size={6}>I 12.4A · 38W · 21°C</T>
      <T x={3} y={44} size={6}>EKF ok · vibe ok</T>
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <D2Header page="STICKS 3/6" arm />
      <T x={3} y={10} size={6}>MODE 2 · FrSky · 8ch</T>
      <StickBox x={20} y={18} size={28} dx={-0.6} dy={0.0} />
      <StickBox x={82} y={18} size={28} dx={0.25} dy={-0.4} />
      <T x={20} y={48} w={28} size={5} align="center">thr/rud</T>
      <T x={82} y={48} w={28} size={5} align="center">ail/ele</T>
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <D2Header page="GPS 4/6" arm />
      <T x={3} y={11} size={6}>FIX 3D · 12 sats · HDOP 0.9</T>
      <Pips x={3} y={20} n={9} max={12} />
      <T x={32} y={20} size={6}>9 strong</T>
      <T x={3} y={30} size={6}>HEAD 274° · alt 142m</T>
      <T x={3} y={38} size={6}>HOME 213m bearing 098°</T>
      <T x={3} y={46} size={6}>last GPS 0.2s ago</T>
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <D2Header page="HUD 5/6" arm />
      <Horizon x={36} y={10} w={56} h={36} pitch={-4} roll={9} />
      <T x={3} y={13} size={6}>ALT</T>
      <T x={3} y={19} size={8} bold>142</T>
      <T x={3} y={31} size={6}>SPD</T>
      <T x={3} y={37} size={8} bold>14</T>
      <T x={97} y={13} size={6}>HDG</T>
      <T x={97} y={19} size={8} bold>274</T>
      <T x={97} y={31} size={6}>VS</T>
      <T x={97} y={37} size={8} bold>+0.6</T>
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <D2Header page="POSITION 6/6" arm />
      <T x={3} y={11} size={6}>LAT 37.42456N</T>
      <T x={3} y={19} size={6}>LON -122.09740W</T>
      <T x={3} y={27} size={6}>ALT 142m  HOME 213m</T>
      <T x={3} y={35} size={6}>DIST 412m  BRG 098°</T>
      <T x={3} y={45} size={6}>SAT 12  FIX 3D  EPH 1.4</T>
      <D2HintBar {...D2Hints} />
    </Screen>
  ),
};

// =========================================================================
// DIRECTION 3 — Glyph-Forward
// 8px top icon-strip = monitor pages (current page inverted).
// Body = hero icon + big numeric. Hint bar uses icons.
// =========================================================================

const D3PageStrip = ({ active = 0 }) => {
  const icons = ['radio', 'plane', 'gamepad-2', 'satellite', 'compass', 'map-pin'];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 9 }}>
      {icons.map((n, i) => {
        const x = 4 + i * 20;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: 1, width: 9, height: 7,
            background: i === active ? '#e6efff' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: i === active ? '#050403' : '#e6efff',
          }}>
            <Icon name={n} size={7} stroke={2.4} />
          </div>
        );
      })}
      <SignalBars x={120} y={2} bars={4} />
      <HR y={9} />
    </div>
  );
};

const D3HintBar = ({ l = 'chevron-left', r = 'chevron-right', hl = 'menu', hr = 'sliders-horizontal' }) => (
  <div style={{
    position: 'absolute', left: 0, top: 54, width: 128, height: 10,
    background: '#050403', borderTop: '1px solid rgba(230,239,255,.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <span style={{ background: '#e6efff', color: '#050403', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, fontWeight: 700 }}>L</span>
      <Icon name={l} size={7} stroke={2.4} />
      <span style={{ boxShadow: 'inset 0 0 0 1px #e6efff', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, color: '#e6efff' }}>{'L'}</span>
      <Icon name={hl} size={7} stroke={2.4} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Icon name={hr} size={7} stroke={2.4} />
      <span style={{ boxShadow: 'inset 0 0 0 1px #e6efff', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, color: '#e6efff' }}>{'R'}</span>
      <Icon name={r} size={7} stroke={2.4} />
      <span style={{ background: '#e6efff', color: '#050403', padding: '0 1px', fontFamily: 'Silkscreen, monospace', fontSize: 5, fontWeight: 700 }}>R</span>
    </div>
  </div>
);

const D3 = {
  Radio: () => (
    <Screen>
      <D3PageStrip active={0} />
      <ScreenIcon x={6} y={16} name="radio-tower" size={24} stroke={2} />
      <Big x={36} y={12} size={28}>−58</Big>
      <T x={36} y={36} size={6}>dBm · NET 25</T>
      <T x={36} y={44} size={6}>915.000 MHz</T>
      <Bar x={96} y={18} w={28} h={3} v={0.74} />
      <D3HintBar />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <D3PageStrip active={1} />
      <ScreenIcon x={6} y={16} name="plane" size={24} stroke={2} />
      <Big x={36} y={12} size={26}>14.8v</Big>
      <Bar x={36} y={36} w={84} h={4} v={0.72} />
      <T x={36} y={44} size={6}>72% · STABILIZE</T>
      <D3HintBar />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <D3PageStrip active={2} />
      <StickBox x={20} y={16} size={28} dx={-0.6} dy={0.0} />
      <StickBox x={80} y={16} size={28} dx={0.25} dy={-0.4} />
      <T x={3} y={46} size={6}>MODE 2</T>
      <T x={3} y={52} size={6}>FrSky · 8ch</T>
      <T x={82} y={46} w={42} size={6} align="right">link ok</T>
      <D3HintBar />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <D3PageStrip active={3} />
      <ScreenIcon x={6} y={16} name="satellite" size={24} stroke={2} />
      <Big x={36} y={12} size={26}>12</Big>
      <T x={62} y={20} size={6}>sats · 3D</T>
      <T x={36} y={34} size={6}>HDOP 0.9</T>
      <T x={36} y={42} size={6}>HEAD 274°</T>
      <D3HintBar />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <D3PageStrip active={4} />
      <Horizon x={4} y={12} w={64} h={40} pitch={-4} roll={9} />
      <T x={72} y={14} size={6}>ALT</T>
      <Big x={72} y={18} size={16}>142</Big>
      <T x={72} y={32} size={6}>HDG 274</T>
      <T x={72} y={40} size={6}>SPD 14</T>
      <D3HintBar />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <D3PageStrip active={5} />
      <ScreenIcon x={6} y={16} name="map-pin" size={24} stroke={2} />
      <T x={36} y={13} size={6}>37.42456N</T>
      <T x={36} y={20} size={6}>-122.0974W</T>
      <T x={36} y={32} size={6}>HOME 213m</T>
      <T x={36} y={40} size={6}>BRG 098°</T>
      <D3HintBar />
    </Screen>
  ),
};

// =========================================================================
// DIRECTION 4 — Mode Banner
// 10px inverted top: MONITOR · <PAGE>. Hint bar 8px auto-hide.
// =========================================================================

const D4Banner = ({ mode = 'MONITOR', sub = 'RADIO', link = 4, arm = false, pass = false, icon }) => (
  <ModeBanner label={mode} sub={`· ${sub}`} icon={icon} link={link} arm={arm} />
);

const D4HintBar = (props) => <HintBar y={56} {...props} />;

const D4 = {
  Radio: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="RADIO" icon="radio-tower" arm />
      <T x={3} y={14} size={6}>RSSI</T>
      <Big x={2} y={19} size={26}>−58</Big>
      <T x={44} y={24} size={6}>dBm</T>
      <T x={44} y={32} size={6}>noise −104</T>
      <T x={3} y={42} size={6}>NET 25 · 915.000</T>
      <Bar x={3} y={49} w={122} h={4} v={0.74} />
      <D4HintBar l="prev" r="next" hl="menu" hr="RFD" />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="VEHICLE" icon="plane" arm />
      <T x={3} y={14} size={6}>STABILIZE</T>
      <Big x={2} y={20} size={24}>14.8</Big>
      <T x={42} y={26} size={6}>v · 72%</T>
      <Bar x={42} y={32} w={76} h={4} v={0.72} />
      <T x={3} y={42} size={6}>I 12.4A  W 38</T>
      <T x={3} y={49} size={6}>ARM 3m12s · EKF ok</T>
      <D4HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="STICKS" icon="gamepad-2" arm />
      <T x={3} y={14} size={6}>MODE 2 · FrSky</T>
      <StickBox x={20} y={22} size={26} dx={-0.6} dy={0.0} />
      <StickBox x={82} y={22} size={26} dx={0.25} dy={-0.4} />
      <T x={56} y={28} size={6}>L  R</T>
      <T x={56} y={36} size={6} bold>OK</T>
      <D4HintBar l="prev" r="next" hl="menu" hr="RX" />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="GPS" icon="satellite" arm />
      <T x={3} y={14} size={6}>3D · 12 sats · 0.9</T>
      <Pips x={3} y={22} n={9} max={12} />
      <T x={3} y={32} size={6}>HEAD 274°  ALT 142m</T>
      <T x={3} y={40} size={6}>HOME 213m  BRG 098°</T>
      <T x={3} y={48} size={6}>EPH 1.4m  EPV 2.1m</T>
      <D4HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="HUD" icon="compass" arm />
      <Horizon x={36} y={13} w={56} h={32} pitch={-4} roll={9} />
      <T x={3} y={15} size={6}>ALT</T>
      <T x={3} y={21} size={8} bold>142</T>
      <T x={3} y={36} size={6}>SPD</T>
      <T x={3} y={42} size={8} bold>14</T>
      <T x={97} y={15} size={6}>HDG</T>
      <T x={97} y={21} size={8} bold>274</T>
      <T x={97} y={36} size={6}>VS</T>
      <T x={97} y={42} size={8} bold>+0.6</T>
      <D4HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <D4Banner mode="MONITOR" sub="POSITION" icon="map-pin" arm />
      <T x={3} y={14} size={6}>LAT 37.42456N</T>
      <T x={3} y={22} size={6}>LON -122.09740W</T>
      <T x={3} y={32} size={6}>ALT 142m  HOME 213m</T>
      <T x={3} y={40} size={6}>DIST 412m  BRG 098°</T>
      <T x={3} y={48} size={6}>SAT 12  EPH 1.4m</T>
      <D4HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
};

// =========================================================================
// DIRECTION 5 — Card Stack
// Breadcrumb 7px on top: "1/6 · RADIO" with link/arm chips.
// One big value per card, supporting metrics smaller below. 9px hint bar.
// =========================================================================

const D5Crumb = ({ n, of, name, arm = false, link = 4 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 8 }}>
    <SignalBars x={1} y={2} bars={link} />
    <T x={0} y={1} w={128} align="center" size={7}>
      <span style={{ opacity: .6 }}>{n}/{of} ·</span> {name}
    </T>
    {arm && <div className="c2-inv" style={{
      position: 'absolute', right: 1, top: 0, height: 7, padding: '0 2px',
      fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px', fontWeight: 700,
    }}>ARM</div>}
    <HR y={8} dashed />
  </div>
);

const D5 = {
  Radio: () => (
    <Screen>
      <D5Crumb n={1} of={6} name="RADIO" arm />
      <T x={3} y={13} size={6}>SIGNAL</T>
      <Big x={2} y={18} size={30}>−58</Big>
      <T x={50} y={28} size={7}>dBm</T>
      <T x={3} y={40} size={6}>NET 25  ·  915.000 MHz  ·  TX 20</T>
      <Bar x={3} y={47} w={122} h={4} v={0.74} />
      <HintBar l="prev" r="next" hl="exit" hr="RFD" />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <D5Crumb n={2} of={6} name="VEHICLE" arm />
      <T x={3} y={13} size={6}>BATTERY</T>
      <Big x={2} y={17} size={30}>14.8</Big>
      <T x={48} y={28} size={7}>v</T>
      <T x={62} y={17} size={6}>72%</T>
      <Bar x={62} y={24} w={60} h={4} v={0.72} />
      <T x={3} y={40} size={6}>STABILIZE · ARM 3m12s · 21°C</T>
      <T x={3} y={48} size={6}>I 12.4A · 38W · EKF ok</T>
      <HintBar l="prev" r="next" hl="exit" hr="VEH" />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <D5Crumb n={3} of={6} name="STICKS" arm />
      <T x={3} y={13} size={6}>MODE 2 · FrSky · OK</T>
      <StickBox x={20} y={20} size={28} dx={-0.6} dy={0.0} />
      <StickBox x={82} y={20} size={28} dx={0.25} dy={-0.4} />
      <T x={20} y={50} w={28} size={5} align="center">thr/rud</T>
      <T x={82} y={50} w={28} size={5} align="center">ail/ele</T>
      <HintBar l="prev" r="next" hl="exit" hr="RX" />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <D5Crumb n={4} of={6} name="GPS" arm />
      <T x={3} y={13} size={6}>SATELLITES</T>
      <Big x={2} y={17} size={30}>12</Big>
      <T x={36} y={28} size={7}>3D fix</T>
      <Pips x={62} y={20} n={9} max={12} />
      <T x={3} y={40} size={6}>HDOP 0.9 · EPH 1.4m · HEAD 274°</T>
      <T x={3} y={48} size={6}>HOME 213m BRG 098°</T>
      <HintBar l="prev" r="next" hl="exit" hr="VEH" />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <D5Crumb n={5} of={6} name="HUD" arm />
      <Horizon x={28} y={11} w={72} h={36} pitch={-4} roll={9} />
      <T x={3} y={14} size={6}>ALT</T>
      <T x={3} y={20} size={9} bold>142</T>
      <T x={3} y={32} size={6}>SPD</T>
      <T x={3} y={38} size={9} bold>14</T>
      <T x={101} y={14} size={6}>HDG</T>
      <T x={101} y={20} size={9} bold>274</T>
      <T x={101} y={32} size={6}>VS</T>
      <T x={101} y={38} size={9} bold>+.6</T>
      <HintBar l="prev" r="next" hl="exit" hr="VEH" />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <D5Crumb n={6} of={6} name="POSITION" arm />
      <T x={3} y={13} size={6}>HOME DIST</T>
      <Big x={2} y={17} size={30}>413</Big>
      <T x={62} y={28} size={7}>m</T>
      <T x={3} y={40} size={6}>BRG 098° · 37.42456N</T>
      <T x={3} y={48} size={6}>-122.09740W · ALT 142m</T>
      <HintBar l="prev" r="next" hl="exit" hr="VEH" />
    </Screen>
  ),
};

// =========================================================================
// DIRECTION 6 — Dashboard Tile
// Radio home becomes 2×2 tile dashboard. Other pages adopt tile look too.
// =========================================================================

const D6Header = ({ page, link = 4, arm = false }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 8 }}>
    <SignalBars x={1} y={2} bars={link} />
    <T x={0} y={1} w={128} align="center" size={7}>{page}</T>
    {arm && <div className="c2-inv" style={{
      position: 'absolute', right: 1, top: 0, height: 7, padding: '0 2px',
      fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px', fontWeight: 700,
    }}>ARM</div>}
    <HR y={8} />
  </div>
);

const Tile = ({ x, y, w, h, icon, label, value, sub, bar }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    color: '#e6efff',
  }}>
    <div style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'Silkscreen, monospace', fontSize: 5, lineHeight: '5px', opacity: .8, display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon && <Icon name={icon} size={6} stroke={2.4} />}
      <span>{label}</span>
    </div>
    <div style={{ position: 'absolute', left: 0, top: 7, fontFamily: 'VT323, monospace', fontSize: 16, lineHeight: '16px', letterSpacing: -1 }}>
      {value}
    </div>
    {sub && (
      <div style={{ position: 'absolute', left: 0, top: 23, fontFamily: 'Silkscreen, monospace', fontSize: 5, lineHeight: '5px', opacity: .85 }}>
        {sub}
      </div>
    )}
    {bar != null && (
      <div style={{ position: 'absolute', left: 0, top: h - 3, width: w - 2, height: 2, boxShadow: 'inset 0 0 0 1px #e6efff' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: bar * (w - 2), height: 2, background: '#e6efff' }} />
      </div>
    )}
  </div>
);

const D6 = {
  Radio: () => (
    <Screen>
      <D6Header page="DASHBOARD" arm />
      {/* 2x2 grid */}
      <Tile x={3}  y={11} w={59} h={20} icon="radio-tower" label="RSSI" value="−58" sub="dBm  N−104" bar={0.74} />
      <Tile x={66} y={11} w={58} h={20} icon="hash"        label="NET 25 · 915.0" value="ok" sub="TX 20 · BAND 915" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="battery"     label="BATT" value="14.8v" sub="72%  STABILIZE" bar={0.72} />
      <Tile x={66} y={33} w={58} h={20} icon="satellite"   label="GPS" value="12 · 3D" sub="HDOP 0.9 · 274°" />
      <HintBar l="prev" r="next" hl="menu" hr="RFD" />
    </Screen>
  ),
  Vehicle: () => (
    <Screen>
      <D6Header page="VEHICLE" arm />
      <Tile x={3}  y={11} w={59} h={20} icon="zap"      label="BATT" value="14.8v" sub="72%  21°C" bar={0.72} />
      <Tile x={66} y={11} w={58} h={20} icon="plane"    label="MODE" value="STAB" sub="ARM 3m12s" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="gauge"    label="POWER" value="38w" sub="I 12.4A  EKF ok" />
      <Tile x={66} y={33} w={58} h={20} icon="compass"  label="HEAD" value="274°" sub="vibe ok" />
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Controller: () => (
    <Screen>
      <D6Header page="STICKS" arm />
      <T x={3} y={12} size={6}>MODE 2 · FrSky · 8ch · OK</T>
      <StickBox x={20} y={20} size={28} dx={-0.6} dy={0.0} />
      <StickBox x={82} y={20} size={28} dx={0.25} dy={-0.4} />
      <T x={20} y={50} w={28} size={5} align="center">thr/rud</T>
      <T x={82} y={50} w={28} size={5} align="center">ail/ele</T>
      <HintBar l="prev" r="next" hl="menu" hr="RX" />
    </Screen>
  ),
  GPS: () => (
    <Screen>
      <D6Header page="GPS" arm />
      <Tile x={3}  y={11} w={59} h={20} icon="satellite" label="SATS" value="12" sub="3D · HDOP 0.9" />
      <Tile x={66} y={11} w={58} h={20} icon="navigation" label="HEAD" value="274°" sub="alt 142m" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="map-pin"  label="HOME" value="213m" sub="BRG 098°" />
      <Tile x={66} y={33} w={58} h={20} icon="target"   label="EPH" value="1.4m" sub="EPV 2.1m" />
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  HUD: () => (
    <Screen>
      <D6Header page="HUD" arm />
      <Horizon x={3} y={11} w={62} h={42} pitch={-4} roll={9} />
      <Tile x={68} y={11} w={56} h={11} icon="mountain" label="ALT" value="142m" />
      <HR y={22} x={66} w={62} />
      <Tile x={68} y={24} w={56} h={11} icon="navigation" label="HDG" value="274°" />
      <HR y={35} x={66} w={62} />
      <Tile x={68} y={37} w={56} h={11} icon="gauge" label="SPD/VS" value="14 +.6" />
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
  Position: () => (
    <Screen>
      <D6Header page="POSITION" arm />
      <Tile x={3}  y={11} w={59} h={20} icon="map-pin" label="LAT" value="37.42456" sub="N" />
      <Tile x={66} y={11} w={58} h={20} icon="map-pin" label="LON" value="-122.097" sub="W" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="mountain" label="ALT" value="142m" sub="HOME 213m" />
      <Tile x={66} y={33} w={58} h={20} icon="target"   label="DIST" value="412m" sub="BRG 098°" />
      <HintBar l="prev" r="next" hl="menu" hr="VEH" />
    </Screen>
  ),
};

// ---------- Strip layouts -------------------------------------------------

const DIR_MAP = { 1: D1, 2: D2, 3: D3, 4: D4, 5: D5, 6: D6 };
const PAGE_ORDER = ['Radio', 'Vehicle', 'Controller', 'GPS', 'HUD', 'Position'];

const MonitorStrip = ({ dir, k = 2.4 }) => {
  const D = DIR_MAP[dir];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, padding: '4px 0 0' }}>
      {PAGE_ORDER.map((p, i) => {
        const C = D[p];
        return (
          <div key={p}>
            <Scaled k={k}>{C ? <C /> : null}</Scaled>
            <Caption n={i + 1}>{p.toUpperCase()}</Caption>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { MonitorStrip, DIR_MAP, PAGE_ORDER });
