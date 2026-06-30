// RC bind wizard — 4 frames per direction.
// 1) Pair prompt (No / Yes) — triggered by Hold L+R or Receiver menu
// 2) FrSky step 2 of 3 (bind ritual)
// 3) ELRS instructions (alternative path)
// 4) Listening → Bound!

// =========================================================================
// D1 — Conservative
// =========================================================================

const BindD1 = [
  { cap: 'Pair prompt', el: () => (
    <Screen>
      <Header link={4} page="PAIR RC" uptime="01:24" />
      <div style={{ position: 'absolute', left: 6, top: 14 }}>
        <Icon name="gamepad-2" size={14} stroke={2.2} />
      </div>
      <T x={24} y={15} size={7}>begin RX pairing?</T>
      <T x={24} y={24} size={6}>FrSky · 3-step ritual</T>
      <T x={24} y={31} size={6}>or ELRS · power cycle</T>
      <HR y={42} />
      <MenuRow y={43} icon="x" label="No"  selected />
      <HintBar l="No" r="Yes" hl="back" />
    </Screen>
  )},
  { cap: 'FrSky · step 2/3', el: () => (
    <Screen>
      <Header link={4} page="FrSky 2/3" uptime="01:24" />
      <T x={3} y={13} size={6} bold>HOLD bind on radio</T>
      <T x={3} y={21} size={6}>then power module</T>
      <T x={3} y={29} size={6}>led should flash</T>
      <Progress x={3} y={36} w={122} v={0.66} />
      <T x={3} y={45} size={6}>3 s lockout · waiting</T>
      <HintBar hl="cancel" />
    </Screen>
  )},
  { cap: 'ELRS · alt path', el: () => (
    <Screen>
      <Header link={4} page="ELRS BIND" uptime="01:24" />
      <T x={3} y={13} size={6}>power-cycle RX 3×</T>
      <T x={3} y={21} size={6}>last cycle = bind mode</T>
      <T x={3} y={29} size={6}>led: slow → fast blink</T>
      <Progress x={3} y={36} w={122} v={0.4} />
      <T x={3} y={45} size={6}>cycle 2 of 3 · 2.1 s</T>
      <HintBar hl="cancel" />
    </Screen>
  )},
  { cap: 'Bound!', el: () => (
    <Screen>
      <Header link={4} page="BOUND" uptime="01:24" />
      <div style={{ position: 'absolute', left: 56, top: 14 }}>
        <Icon name="circle-check" size={16} stroke={2.2} />
      </div>
      <T x={0} y={34} w={128} align="center" size={8} bold>BOUND!</T>
      <T x={0} y={44} w={128} align="center" size={6}>FrSky · 8ch · ch7 trigger</T>
      <HintBar r="open sticks" hl="back" />
    </Screen>
  )},
];

// =========================================================================
// D2 — Always-On Hints
// =========================================================================

const BindD2 = [
  { cap: 'Pair prompt', el: () => (
    <Screen>
      <D2Header page="PAIR RC?" />
      <T x={3} y={11} size={6}>begin pairing wizard?</T>
      <T x={3} y={19} size={6}>FrSky 3-step / ELRS 3× pwr</T>
      <Row2 y={28} icon="x" label="No"  selected />
      <Row2 y={36} icon="check" label="Yes · FrSky" />
      <Row2 y={44} icon="check" label="Yes · ELRS" />
      <D2HintBar l="cursor" r="ok" hl="cancel" hr="—" />
    </Screen>
  )},
  { cap: 'FrSky · step 2/3', el: () => (
    <Screen>
      <D2Header page="FrSky · 2/3" />
      <T x={3} y={11} size={6} bold>HOLD bind on TX</T>
      <T x={3} y={19} size={6}>then power module</T>
      <Progress x={3} y={28} w={122} v={0.66} />
      <T x={3} y={36} size={6}>3 s anti-mash · 2.1 s</T>
      <T x={3} y={44} size={6}>led: fast green</T>
      <D2HintBar l="—" r="—" hl="cancel" hr="skip" />
    </Screen>
  )},
  { cap: 'ELRS path', el: () => (
    <Screen>
      <D2Header page="ELRS · 2/3 cycles" />
      <T x={3} y={11} size={6}>3× power-cycle the RX</T>
      <Progress x={3} y={20} w={122} v={0.4} />
      <div style={{ position: 'absolute', left: 3, top: 28 }}>
        <Icon name="circle-check" size={6} stroke={2.4} />
      </div>
      <T x={11} y={28} size={6}>cycle 1 ok</T>
      <div style={{ position: 'absolute', left: 3, top: 36 }}>
        <Icon name="loader" size={6} stroke={2.4} />
      </div>
      <T x={11} y={36} size={6}>cycle 2 in progress</T>
      <T x={3} y={44} size={6}>last cycle = bind mode</T>
      <D2HintBar l="—" r="—" hl="cancel" hr="—" />
    </Screen>
  )},
  { cap: 'Bound!', el: () => (
    <Screen>
      <D2Header page="BOUND" />
      <div style={{ position: 'absolute', left: 8, top: 12 }}>
        <Icon name="circle-check" size={20} stroke={2.2} />
      </div>
      <T x={36} y={14} size={8} bold>BOUND!</T>
      <T x={36} y={24} size={6}>FrSky · 8ch</T>
      <T x={36} y={32} size={6}>ch7 trigger ok</T>
      <T x={36} y={40} size={6}>opening sticks…</T>
      <D2HintBar l="—" r="ok" hl="back" hr="—" />
    </Screen>
  )},
];

// =========================================================================
// D3 — Glyph-Forward
// =========================================================================

const BindD3 = [
  { cap: 'Pair prompt', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="gamepad-2" size={24} stroke={2} />
      </div>
      <T x={36} y={13} size={8} bold>PAIR RX?</T>
      <T x={36} y={24} size={6}>FrSky / ELRS</T>
      <Bar x={36} y={34} w={86} h={4} v={0.5} />
      <T x={36} y={42} size={6}>L = no · R = yes</T>
      <D3HintBar l="x" r="check" hl="x" />
    </Screen>
  )},
  { cap: 'FrSky · ritual', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <T x={0} y={14} w={128} align="center" size={7} bold>FrSky 2/3</T>
      <div style={{ position: 'absolute', left: 14, top: 24 }}>
        <Icon name="play" size={14} stroke={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 36, top: 24 }}>
        <Icon name="power" size={14} stroke={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 58, top: 24 }}>
        <Icon name="loader" size={14} stroke={2.2} />
      </div>
      <T x={14} y={40} size={5}>HOLD</T>
      <T x={38} y={40} size={5}>PWR</T>
      <T x={60} y={40} size={5}>WAIT</T>
      <Progress x={80} y={28} w={44} v={0.66} />
      <T x={80} y={40} size={6}>2.1 s</T>
      <D3HintBar />
    </Screen>
  )},
  { cap: 'ELRS · 3× cycles', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <T x={0} y={14} w={128} align="center" size={7} bold>ELRS · 2 / 3</T>
      <div style={{ position: 'absolute', left: 14, top: 26 }}>
        <Icon name="circle-check" size={16} stroke={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 42, top: 26 }}>
        <Icon name="loader" size={16} stroke={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 70, top: 26 }}>
        <Icon name="power" size={16} stroke={2.2} />
      </div>
      <T x={98} y={30} size={6}>= bind</T>
      <T x={0} y={48} w={128} align="center" size={6}>last cycle = bind mode</T>
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Bound!', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 18, top: 12 }}>
        <Icon name="circle-check" size={28} stroke={2.2} />
      </div>
      <T x={56} y={16} size={11} bold>OK</T>
      <T x={56} y={32} size={6}>FrSky · 8ch</T>
      <T x={56} y={40} size={6}>opening sticks…</T>
      <D3HintBar />
    </Screen>
  )},
];

// =========================================================================
// D4 — Mode Banner
// =========================================================================

const BindD4 = [
  { cap: 'Mode = BIND', el: () => (
    <Screen>
      <ModeBanner label="BIND" sub="· CHOOSE" icon="gamepad-2" />
      <Row4 y={11} icon="radio-tower" label="FrSky · D8/D16" selected />
      <Row4 y={20} icon="zap" label="ELRS · 2.4G" />
      <Row4 y={29} icon="x" label="Cancel" />
      <T x={3} y={42} size={6}>FrSky: 3-step ritual</T>
      <T x={3} y={50} size={6}>ELRS: 3× power cycle</T>
      <HintBar y={56} l="cursor" r="start" hl="exit" />
    </Screen>
  )},
  { cap: 'BIND · FrSky 2/3', el: () => (
    <Screen>
      <ModeBanner label="BIND" sub="· FrSky 2/3" icon="play" />
      <T x={3} y={13} size={6} bold>HOLD bind on TX</T>
      <T x={3} y={21} size={6}>then power the module</T>
      <Progress x={3} y={30} w={122} v={0.66} />
      <T x={3} y={38} size={6}>3 s anti-mash · 2.1 s</T>
      <T x={3} y={46} size={6}>led: fast green</T>
      <HintBar y={56} hl="cancel" />
    </Screen>
  )},
  { cap: 'BIND · ELRS', el: () => (
    <Screen>
      <ModeBanner label="BIND" sub="· ELRS · 2/3 cycles" icon="power" />
      <T x={3} y={13} size={6}>power-cycle RX 3 times</T>
      <Progress x={3} y={22} w={122} v={0.4} />
      <T x={3} y={30} size={6}>cycle 1 ok · 2 in progress</T>
      <T x={3} y={38} size={6}>last cycle = bind mode</T>
      <T x={3} y={46} size={6}>led: slow → fast</T>
      <HintBar y={56} hl="cancel" />
    </Screen>
  )},
  { cap: 'BOUND!', el: () => (
    <Screen>
      <ModeBanner label="BIND" sub="· BOUND ✓" icon="circle-check" />
      <T x={0} y={20} w={128} align="center" size={11} bold>BOUND</T>
      <T x={0} y={36} w={128} align="center" size={6}>FrSky · 8ch · ch7 trigger ok</T>
      <T x={0} y={44} w={128} align="center" size={6}>opening sticks page…</T>
      <HintBar y={56} r="open" hl="back" />
    </Screen>
  )},
];

// =========================================================================
// D5 — Card Stack
// =========================================================================

const BindD5 = [
  { cap: 'Card · which RX', el: () => (
    <Screen>
      <D5Crumb n={1} of={4} name="PAIR RX" />
      <div style={{ position: 'absolute', left: 8, top: 14 }}>
        <Icon name="gamepad-2" size={20} stroke={2} />
      </div>
      <T x={36} y={15} size={6}>choose receiver:</T>
      <Row4 y={24} icon="radio-tower" label="FrSky · D8/D16" selected />
      <Row4 y={33} icon="zap" label="ELRS · 2.4G" />
      <Row4 y={42} icon="x" label="Cancel" />
      <HintBar l="cursor" r="next" hl="exit" />
    </Screen>
  )},
  { cap: 'Card · FrSky 2/3', el: () => (
    <Screen>
      <D5Crumb n={2} of={4} name="FrSky · STEP 2" />
      <T x={3} y={13} size={7} bold>HOLD bind on TX</T>
      <T x={3} y={22} size={6}>then power module</T>
      <T x={3} y={30} size={6}>led should flash fast</T>
      <Progress x={3} y={38} w={122} v={0.66} />
      <T x={3} y={46} size={6}>anti-mash 3s · 2.1 s left</T>
      <HintBar l="—" r="—" hl="cancel" />
    </Screen>
  )},
  { cap: 'Card · ELRS', el: () => (
    <Screen>
      <D5Crumb n={2} of={4} name="ELRS · CYCLE 2/3" />
      <T x={3} y={13} size={6}>power-cycle RX 3 times</T>
      <T x={3} y={21} size={7} bold>last = bind mode</T>
      <Progress x={3} y={30} w={122} v={0.4} />
      <T x={3} y={38} size={6}>led: slow → fast blink</T>
      <T x={3} y={46} size={6}>do not unplug USB</T>
      <HintBar l="—" r="—" hl="cancel" />
    </Screen>
  )},
  { cap: 'Card · BOUND', el: () => (
    <Screen>
      <D5Crumb n={4} of={4} name="BOUND" />
      <div style={{ position: 'absolute', left: 8, top: 14 }}>
        <Icon name="circle-check" size={20} stroke={2.2} />
      </div>
      <T x={36} y={16} size={9} bold>SUCCESS</T>
      <T x={36} y={28} size={6}>FrSky · 8ch · ch7 trig</T>
      <T x={36} y={36} size={6}>frame 22 ms · 50 Hz</T>
      <T x={3} y={48} size={6}>R opens sticks page</T>
      <HintBar l="back" r="open" hl="exit" />
    </Screen>
  )},
];

// =========================================================================
// D6 — Dashboard
// =========================================================================

const BindD6 = [
  { cap: 'Pair · tiles', el: () => (
    <Screen>
      <D6Header page="PAIR RX" />
      <Tile x={3}  y={11} w={59} h={20} icon="radio-tower" label="FrSky" value="D8/16" sub="3-step ritual" />
      <Tile x={66} y={11} w={58} h={20} icon="zap" label="ELRS" value="2.4G" sub="3× pwr cycle" />
      <Box x={2} y={10} w={61} h={22} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="x" label="CANCEL" value="L" />
      <Tile x={66} y={33} w={58} h={20} icon="check" label="START" value="R" />
      <HintBar l="cursor" r="start" hl="exit" />
    </Screen>
  )},
  { cap: 'FrSky · live', el: () => (
    <Screen>
      <D6Header page="FrSky 2/3" />
      <Tile x={3}  y={11} w={59} h={20} icon="play" label="STEP" value="2 / 3" sub="HOLD bind" />
      <Tile x={66} y={11} w={58} h={20} icon="power" label="POWER" value="ON now" sub="led fast" />
      <HR y={31} />
      <Tile x={3}  y={33} w={120} h={6} icon="timer" label="" value="" />
      <Progress x={3} y={40} w={120} v={0.66} />
      <T x={3} y={48} size={6}>anti-mash · 2.1 s left</T>
      <HintBar l="—" r="—" hl="cancel" />
    </Screen>
  )},
  { cap: 'ELRS · live', el: () => (
    <Screen>
      <D6Header page="ELRS BIND" />
      <Tile x={3}  y={11} w={38} h={20} icon="circle-check" label="C1" value="OK" />
      <Tile x={45} y={11} w={38} h={20} icon="loader" label="C2" value="…" />
      <Tile x={87} y={11} w={38} h={20} icon="power" label="C3" value="=bind" />
      <HR y={31} />
      <Tile x={3}  y={33} w={120} h={6} label="" value="" />
      <Progress x={3} y={40} w={120} v={0.4} />
      <T x={3} y={48} size={6}>last cycle enters bind mode</T>
      <HintBar l="—" r="—" hl="cancel" />
    </Screen>
  )},
  { cap: 'BOUND', el: () => (
    <Screen>
      <D6Header page="BOUND ✓" arm />
      <Tile x={3}  y={11} w={59} h={20} icon="circle-check" label="STATUS" value="OK" sub="frame 22 ms" />
      <Tile x={66} y={11} w={58} h={20} icon="gamepad-2" label="MODEL" value="FrSky" sub="8 ch" />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="arrow-right-left" label="CH7" value="trig" sub="armed" />
      <Tile x={66} y={33} w={58} h={20} icon="arrow-up-right" label="NEXT" value="sticks" sub="R = open" />
      <HintBar l="back" r="open" hl="exit" />
    </Screen>
  )},
];

const BINDS = { 1: BindD1, 2: BindD2, 3: BindD3, 4: BindD4, 5: BindD5, 6: BindD6 };

const BindStrip = ({ dir, k = 2.4 }) => {
  const frames = BINDS[dir] || [];
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

Object.assign(window, { BindStrip, BINDS });
