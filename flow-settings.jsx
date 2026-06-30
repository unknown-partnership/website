// Settings architecture — 3 frames per direction.
// 1) Top-level category list (entered via Hold L from monitor)
// 2) Drilled-in into Display category
// 3) Adjusting a row (live preview / chooser)

// Mirrors src/app/display.cpp CATEGORIES — 7 entries, with the synthetic
// trailing Exit row that duplicates Hold-L as a clickable target.
const SET_CATEGORIES = [
  { icon: 'monitor',          label: 'Display' },
  { icon: 'speaker',          label: 'Audio' },
  { icon: 'gamepad-2',        label: 'Receiver' },
  { icon: 'plane',            label: 'Vehicle' },
  { icon: 'radio-tower',      label: 'RFD Util', danger: true },
  { icon: 'info',             label: 'About' },
  { icon: 'corner-down-left', label: 'Exit' },
];

// Mirrors DISPLAY_ROWS in firmware: { SR_CYCLE, SR_BRIGHTNESS, SR_SLEEP }.
const DISPLAY_ROWS = [
  { icon: 'rotate-cw', label: 'Cycle',      value: '4s' },
  { icon: 'sun',       label: 'Brightness', value: '75%' },
  { icon: 'moon',      label: 'Sleep',      value: '30s' },
];

// =========================================================================
// Direction 1 — Hint-Bar Conservative
// =========================================================================

const SetD1 = [
  { cap: 'Settings · top', el: () => (
    <Screen>
      <Header link={4} page="SETTINGS" uptime="01:24" arm />
      <MenuRow y={10} icon="monitor" label="Display" chevron />
      <MenuRow y={21} icon="speaker" label="Audio" chevron selected />
      <MenuRow y={32} icon="gamepad-2" label="Receiver" chevron />
      <MenuRow y={43} icon="radio-tower" label="RFD Util" chevron danger />
      <HintBar l="cursor" r="open" hl="exit" />
    </Screen>
  )},
  { cap: 'Display · rows', el: () => (
    <Screen>
      <Header link={4} page="DISPLAY" uptime="01:24" arm />
      <MenuRow y={10} icon="rotate-cw" label="Cycle" value="4s" />
      <MenuRow y={21} icon="sun" label="Brightness" value="75%" selected />
      <MenuRow y={32} icon="moon" label="Sleep" value="30s" />
      <MenuRow y={43} icon="corner-down-left" label="Exit" />
      <HintBar l="cursor" r="adjust" hl="back" />
    </Screen>
  )},
  { cap: 'Adjust cycle', el: () => (
    <Screen>
      <Header link={4} page="CYCLE" uptime="01:24" arm />
      <T x={3} y={13} size={6}>page dwell time</T>
      <Big x={2} y={17} size={28}>4</Big>
      <T x={28} y={28} size={7}>s</T>
      <T x={50} y={20} size={6}>2 · 3 · [4] · 5 · 8</T>
      <T x={50} y={28} size={6}>off (0)</T>
      <Bar x={3} y={40} w={122} h={3} v={0.4} />
      <T x={3} y={46} size={6}>writes to flash on change</T>
      <HintBar l="−" r="+" hl="back" />
    </Screen>
  )},
];

// =========================================================================
// Direction 2 — Always-On Hints (compact rows, fixed hint bar)
// =========================================================================

const SetD2 = [
  { cap: 'Settings · top', el: () => (
    <Screen>
      <D2Header page="SETTINGS 2/7" arm />
      <Row2 y={9}  icon="monitor" label="Display" />
      <Row2 y={17} icon="speaker" label="Audio" selected />
      <Row2 y={25} icon="gamepad-2" label="Receiver" />
      <Row2 y={33} icon="plane" label="Vehicle" />
      <Row2 y={41} icon="radio-tower" label="RFD Util" danger />
      <D2HintBar l="cursor" r="open" hl="exit" hr="—" />
    </Screen>
  )},
  { cap: 'Display · rows', el: () => (
    <Screen>
      <D2Header page="DISPLAY 1/3" arm />
      <Row2 y={9}  icon="rotate-cw" label="Cycle" value="4s" />
      <Row2 y={17} icon="sun" label="Brightness" value="75%" selected />
      <Row2 y={25} icon="moon" label="Sleep" value="30s" />
      <Row2 y={33} icon="corner-down-left" label="Exit" />
      <D2HintBar l="cursor" r="adjust" hl="back" hr="reset" />
    </Screen>
  )},
  { cap: 'Adjust cycle', el: () => (
    <Screen>
      <D2Header page="CYCLE" arm />
      <T x={3} y={10} size={6}>page dwell · 4 sec</T>
      <Big x={2} y={14} size={24}>4s</Big>
      <T x={36} y={20} size={6}>2 · 3 · [4] · 5 · 8 · 0</T>
      <Bar x={3} y={34} w={122} h={3} v={0.4} />
      <T x={3} y={42} size={6}>saved · flash</T>
      <D2HintBar l="−" r="+" hl="back" hr="default" />
    </Screen>
  )},
];

// Row helper specific to D2 (8px rows — tighter)
const Row2 = ({ y, icon, label, value, selected = false, danger = false }) => (
  <div style={{
    position: 'absolute', left: 0, top: y, width: 128, height: 8,
    background: selected ? '#e6efff' : 'transparent',
    color: selected ? '#050403' : '#e6efff',
    display: 'flex', alignItems: 'center', padding: '0 2px',
    fontFamily: 'Silkscreen, monospace', fontSize: 6, lineHeight: '7px',
  }}>
    {selected && <span style={{ marginRight: 1, fontWeight: 700 }}>▸</span>}
    {icon && <span style={{ marginRight: 2, display: 'flex' }}>
      <Icon name={icon} size={7} stroke={2.4} style={{ color: selected ? '#050403' : '#e6efff' }} />
    </span>}
    <span style={{ flex: 1 }}>{label}</span>
    {danger && <Icon name="lock" size={6} stroke={2.4} style={{ marginRight: 2, color: selected ? '#050403' : '#e6efff' }} />}
    {value && <span style={{ opacity: selected ? 1 : .9 }}>{value}</span>}
  </div>
);

// =========================================================================
// Direction 3 — Glyph-Forward (icon-led 12px rows)
// =========================================================================

const GRow = ({ y, icon, label, value, selected = false, danger = false }) => (
  <div style={{
    position: 'absolute', left: 0, top: y, width: 128, height: 12,
    background: selected ? '#e6efff' : 'transparent',
    color: selected ? '#050403' : '#e6efff',
    display: 'flex', alignItems: 'center', padding: '0 3px',
  }}>
    <span style={{ marginRight: 4, display: 'flex' }}>
      <Icon name={icon} size={10} stroke={2.2} style={{ color: selected ? '#050403' : '#e6efff' }} />
    </span>
    <span style={{ flex: 1, fontFamily: 'Silkscreen, monospace', fontSize: 7 }}>{label}</span>
    {danger && <Icon name="lock" size={8} stroke={2.4} style={{ marginRight: 2, color: selected ? '#050403' : '#e6efff' }} />}
    {value && <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 7 }}>{value}</span>}
  </div>
);

const SetD3 = [
  { cap: 'Settings · top', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <GRow y={10} icon="monitor" label="display" />
      <GRow y={22} icon="speaker" label="audio" selected />
      <GRow y={34} icon="gamepad-2" label="receiver" />
      <GRow y={46} icon="radio-tower" label="RFD util" danger />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Display · rows', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <GRow y={10} icon="rotate-cw" label="cycle" value="4s" />
      <GRow y={22} icon="sun" label="bright" value="75%" selected />
      <GRow y={34} icon="moon" label="sleep" value="30s" />
      <GRow y={46} icon="corner-down-left" label="exit" />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Adjust cycle', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 4, top: 14 }}>
        <Icon name="rotate-cw" size={20} stroke={2} />
      </div>
      <Big x={30} y={12} size={30}>4s</Big>
      <T x={80} y={20} size={6}>cycle dwell</T>
      <T x={80} y={28} size={6}>2 3 [4] 5 8</T>
      <Bar x={3} y={42} w={122} h={3} v={0.4} />
      <D3HintBar l="minus" r="plus" hl="corner-down-left" />
    </Screen>
  )},
];

// =========================================================================
// Direction 4 — Mode Banner
// =========================================================================

const SetD4 = [
  { cap: 'Settings · top', el: () => (
    <Screen>
      <ModeBanner label="SETTINGS" icon="sliders-horizontal" link={4} arm />
      <Row4 y={11} icon="monitor" label="Display" />
      <Row4 y={20} icon="speaker" label="Audio" selected />
      <Row4 y={29} icon="gamepad-2" label="Receiver" />
      <Row4 y={38} icon="plane" label="Vehicle" />
      <Row4 y={47} icon="radio-tower" label="RFD Util" danger />
      <HintBar y={56} l="cursor" r="open" hl="exit" />
    </Screen>
  )},
  { cap: 'Display · rows', el: () => (
    <Screen>
      <ModeBanner label="SETTINGS" sub="· DISPLAY" icon="monitor" link={4} arm />
      <Row4 y={11} icon="rotate-cw" label="Cycle" value="4s" />
      <Row4 y={20} icon="sun" label="Brightness" value="75%" selected />
      <Row4 y={29} icon="moon" label="Sleep" value="30s" />
      <Row4 y={38} icon="corner-down-left" label="Exit" />
      <HintBar y={56} l="cursor" r="adjust" hl="back" />
    </Screen>
  )},
  { cap: 'Adjust cycle', el: () => (
    <Screen>
      <ModeBanner label="SETTINGS" sub="· CYCLE" icon="rotate-cw" link={4} arm />
      <T x={3} y={14} size={6}>page dwell</T>
      <Big x={2} y={19} size={28}>4</Big>
      <T x={28} y={30} size={7}>s</T>
      <T x={50} y={22} size={6}>2 · 3 · [4] · 5 · 8</T>
      <Bar x={3} y={44} w={122} h={3} v={0.4} />
      <HintBar y={56} l="−" r="+" hl="back" />
    </Screen>
  )},
];

const Row4 = ({ y, icon, label, value, selected = false, danger = false }) => (
  <div style={{
    position: 'absolute', left: 0, top: y, width: 128, height: 9,
    background: selected ? '#e6efff' : 'transparent',
    color: selected ? '#050403' : '#e6efff',
    display: 'flex', alignItems: 'center', padding: '0 3px',
  }}>
    {selected && <span style={{ marginRight: 1, fontWeight: 700, fontFamily: 'Silkscreen, monospace', fontSize: 7 }}>▸</span>}
    <span style={{ marginRight: 3, display: 'flex' }}>
      <Icon name={icon} size={8} stroke={2.4} style={{ color: selected ? '#050403' : '#e6efff' }} />
    </span>
    <span style={{ flex: 1, fontFamily: 'Silkscreen, monospace', fontSize: 7 }}>{label}</span>
    {danger && <Icon name="lock" size={7} stroke={2.4} style={{ marginRight: 2, color: selected ? '#050403' : '#e6efff' }} />}
    {value && <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 7 }}>{value}</span>}
  </div>
);

// =========================================================================
// Direction 5 — Card Stack (one setting per card)
// =========================================================================

const SetD5 = [
  { cap: 'Settings stack', el: () => (
    <Screen>
      <D5Crumb n={1} of={7} name="DISPLAY" arm />
      <div style={{ position: 'absolute', left: 8, top: 12 }}>
        <Icon name="monitor" size={20} stroke={2} />
      </div>
      <T x={32} y={14} size={6}>category</T>
      <T x={32} y={22} size={11} bold>DISPLAY</T>
      <T x={32} y={34} size={6}>3 settings</T>
      <T x={32} y={42} size={6}>cycle · bright · sleep</T>
      <HintBar l="prev" r="open" hl="exit" />
    </Screen>
  )},
  { cap: 'Card · Cycle', el: () => (
    <Screen>
      <D5Crumb n={1} of={3} name="CYCLE" arm />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="rotate-cw" size={16} stroke={2} />
      </div>
      <Big x={28} y={11} size={32}>4s</Big>
      <T x={68} y={18} size={6}>page dwell</T>
      <T x={68} y={26} size={6}>2 3 [4] 5 8 off</T>
      <Bar x={3} y={40} w={122} h={3} v={0.4} />
      <T x={3} y={46} size={6}>auto-saves to flash</T>
      <HintBar l="−" r="+" hl="exit" hr="default" />
    </Screen>
  )},
  { cap: 'Card · Brightness', el: () => (
    <Screen>
      <D5Crumb n={2} of={3} name="BRIGHTNESS" arm />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="sun" size={16} stroke={2} />
      </div>
      <Big x={28} y={11} size={32}>75%</Big>
      <T x={3} y={36} size={6}>OLED contrast 0..255</T>
      <Bar x={3} y={42} w={122} h={3} v={0.75} />
      <T x={3} y={48} size={6}>writes immediately</T>
      <HintBar l="−" r="+" hl="exit" hr="default" />
    </Screen>
  )},
];

// =========================================================================
// Direction 6 — Dashboard (settings stays mostly list; tiles for category)
// =========================================================================

const SetD6 = [
  { cap: 'Settings · tiles', el: () => (
    <Screen>
      <D6Header page="SETTINGS" />
      <Tile x={3}  y={11} w={38} h={18} icon="monitor"   label="display" value="" />
      <Tile x={45} y={11} w={38} h={18} icon="speaker"   label="audio"   value="" />
      <Tile x={87} y={11} w={38} h={18} icon="gamepad-2" label="RX"      value="" />
      <Tile x={3}  y={32} w={38} h={20} icon="plane"       label="vehicle" value="" />
      <Tile x={45} y={32} w={38} h={20} icon="radio-tower" label="RFD"     value="" />
      <Tile x={87} y={32} w={38} h={20} icon="info"        label="about"   value="" />
      {/* selection marquee on Display */}
      <Box x={2} y={10} w={40} h={20} />
      <HintBar l="cursor" r="open" hl="exit" />
    </Screen>
  )},
  { cap: 'Display · tiles', el: () => (
    <Screen>
      <D6Header page="DISPLAY" />
      <Tile x={3}  y={11} w={59} h={20} icon="rotate-cw" label="CYCLE" value="4s" sub="2..8 / off" />
      <Tile x={66} y={11} w={58} h={20} icon="sun" label="BRIGHT" value="75%" sub="0..100" bar={0.75} />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="moon" label="SLEEP" value="30s" sub="off / 10..120" />
      <Tile x={66} y={33} w={58} h={20} icon="corner-down-left" label="EXIT" value="" sub="back to menu" />
      <Box x={2} y={32} w={61} h={21} />
      <HintBar l="cursor" r="adjust" hl="back" />
    </Screen>
  )},
  { cap: 'Adjust brightness', el: () => (
    <Screen>
      <D6Header page="BRIGHTNESS" />
      <div style={{ position: 'absolute', left: 8, top: 14 }}>
        <Icon name="sun" size={20} stroke={2} />
      </div>
      <Big x={36} y={12} size={32}>75</Big>
      <T x={66} y={22} size={6}>%</T>
      <Bar x={3} y={40} w={122} h={4} v={0.75} />
      <T x={3} y={48} size={6}>writes immediately</T>
      <HintBar l="−" r="+" hl="back" />
    </Screen>
  )},
];

const SETS = { 1: SetD1, 2: SetD2, 3: SetD3, 4: SetD4, 5: SetD5, 6: SetD6 };

const SettingsStrip = ({ dir, k = 2.4 }) => {
  const frames = SETS[dir] || [];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, padding: '4px 0 0' }}>
      {frames.map((f, i) => {
        const C = f.el;
        return (
          <div key={i}>
            <Scaled k={k}><C /></Scaled>
            <Caption n={i + 1}>{f.cap}</Caption>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { SettingsStrip, SETS });
