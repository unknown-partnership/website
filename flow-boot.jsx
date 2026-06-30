// Boot / first-90-seconds — 4 frames per direction.
// Steps: 1) splash (logo + version), 2) RFD radio probe,
// 3) waiting on MAVLink heartbeat, 4) ready → home.
// Across all six directions the same content; chrome differs.

// Shared chrome wrappers
const Chrome = {
  1: { // Conservative
    Frame: ({ title, children, hint = { l: '', r: '' }, arm }) => (
      <Screen>
        <Header link={0} page={title} uptime="00:01" arm={arm} />
        <div style={{ position: 'absolute', left: 0, top: 9, right: 0, bottom: 9 }}>{children}</div>
        <HintBar {...hint} />
      </Screen>
    ),
  },
  4: { // Mode banner
    Frame: ({ title, icon, mode = 'BOOT', children, hint = { l: '', r: '' }, arm, pass }) => (
      <Screen>
        <ModeBanner label={mode} sub={title ? `· ${title}` : ''} icon={icon} arm={arm} />
        <div style={{ position: 'absolute', left: 0, top: 10, right: 0, bottom: 9 }}>{children}</div>
        <HintBar y={56} {...hint} />
      </Screen>
    ),
  },
};

// ---------- Boot screens, per direction ----------------------------------

const Boot = {
  // D1 Conservative
  1: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <Abs x={0} y={0} w={128} h={64}>
          <T x={0} y={8} w={128} align="center" size={8} bold>C2 BOX</T>
          <T x={0} y={20} w={128} align="center" size={6}>RFD telemetry link</T>
          <div style={{ position: 'absolute', left: 49, top: 30 }}>
            <Icon name="radio-tower" size={16} stroke={2} />
          </div>
          <T x={0} y={50} w={128} align="center" size={6}>fw 1.4.2 · hw r3</T>
          <T x={0} y={57} w={128} align="center" size={6}>booting…</T>
        </Abs>
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <Header link={0} page="STARTUP" uptime="00:02" />
        <div style={{ position: 'absolute', left: 48, top: 14 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <T x={0} y={32} w={128} align="center" size={7}>probing RFD radio</T>
        <T x={0} y={40} w={128} align="center" size={6}>attempt 1 / 3</T>
        <Progress x={20} y={48} w={88} v={0.35} />
        <HintBar />
      </Screen>
    )},
    { cap: 'Waiting on MAVLink', el: () => (
      <Screen>
        <Header link={3} page="STARTUP" uptime="00:08" />
        <div style={{ position: 'absolute', left: 8, top: 14 }}>
          <Icon name="circle-check" size={12} stroke={2.2} />
        </div>
        <T x={22} y={15} size={7}>RFD link ok</T>
        <T x={22} y={23} size={6}>915.000 · NET 25</T>
        <HR y={32} />
        <div style={{ position: 'absolute', left: 8, top: 36 }}>
          <Icon name="loader" size={12} stroke={2.2} />
        </div>
        <T x={22} y={37} size={7}>waiting heartbeat</T>
        <T x={22} y={45} size={6}>2 s elapsed</T>
        <HintBar />
      </Screen>
    )},
    { cap: 'Ready · home', el: () => (
      <Screen>
        <Header link={4} page="RADIO" uptime="00:14" arm />
        <T x={3} y={13} size={6}>RSSI</T>
        <Big x={2} y={18} size={26}>−58</Big>
        <T x={42} y={23} size={6}>dBm</T>
        <T x={42} y={31} size={6}>noise −104</T>
        <T x={3} y={40} size={6}>NET 25 · 915.000</T>
        <Bar x={3} y={47} w={122} h={4} v={0.74} />
        <HintBar l="prev" r="next" hl="menu" hr="RFD" />
      </Screen>
    )},
  ],

  // D2 Always-on hints
  2: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <T x={0} y={6} w={128} align="center" size={8} bold>C2 BOX</T>
        <div style={{ position: 'absolute', left: 49, top: 16 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <T x={0} y={36} w={128} align="center" size={6}>fw 1.4.2 · hw r3</T>
        <T x={0} y={44} w={128} align="center" size={6}>booting…</T>
        <D2HintBar l="—" r="—" hl="—" hr="—" />
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <D2Header page="STARTUP · 2/4" link={0} />
        <T x={0} y={11} w={128} align="center" size={6}>probing RFD radio…</T>
        <T x={0} y={20} w={128} align="center" size={6}>attempt 1/3 · 57600 baud</T>
        <Progress x={14} y={30} w={100} v={0.35} />
        <T x={0} y={40} w={128} align="center" size={6}>(can cancel · hold L)</T>
        <D2HintBar l="—" r="—" hl="cancel" hr="—" />
      </Screen>
    )},
    { cap: 'Heartbeat wait', el: () => (
      <Screen>
        <D2Header page="STARTUP · 3/4" link={3} />
        <div style={{ position: 'absolute', left: 4, top: 10 }}>
          <Icon name="circle-check" size={10} stroke={2.2} />
        </div>
        <T x={16} y={11} size={6}>RFD 915.0 · NET 25</T>
        <div style={{ position: 'absolute', left: 4, top: 21 }}>
          <Icon name="loader" size={10} stroke={2.2} />
        </div>
        <T x={16} y={22} size={6}>waiting MAVLink hb</T>
        <T x={16} y={30} size={6}>2.1 s elapsed</T>
        <T x={0} y={42} w={128} align="center" size={6}>(skip · go to monitor)</T>
        <D2HintBar l="—" r="—" hl="—" hr="skip" />
      </Screen>
    )},
    { cap: 'Ready', el: () => (
      <Screen>
        <D2Header page="RADIO 1/6" link={4} arm />
        <T x={3} y={11} size={6}>RSSI</T>
        <Big x={2} y={15} size={24}>−58</Big>
        <T x={40} y={20} size={6}>dBm</T>
        <T x={40} y={28} size={6}>noise −104</T>
        <T x={3} y={38} size={6}>NET 25 · 915.000 MHz</T>
        <Bar x={3} y={45} w={122} h={4} v={0.74} />
        <D2HintBar l="prev" r="next" hl="menu" hr="jump" />
      </Screen>
    )},
  ],

  // D3 Glyph-Forward
  3: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <div style={{ position: 'absolute', left: 56, top: 4 }}>
          <Icon name="radio-tower" size={20} stroke={2} />
        </div>
        <T x={0} y={28} w={128} align="center" size={9} bold>C2 BOX</T>
        <T x={0} y={40} w={128} align="center" size={6}>fw 1.4.2</T>
        <T x={0} y={50} w={128} align="center" size={6}>· · ·</T>
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <div style={{ position: 'absolute', left: 38, top: 6 }}>
          <Icon name="radio-tower" size={20} stroke={2} />
        </div>
        <div style={{ position: 'absolute', left: 70, top: 14 }}>
          <Icon name="loader" size={12} stroke={2.2} />
        </div>
        <T x={0} y={32} w={128} align="center" size={7}>probing RFD</T>
        <T x={0} y={40} w={128} align="center" size={6}>1 / 3</T>
        <Progress x={20} y={48} w={88} v={0.35} />
      </Screen>
    )},
    { cap: 'Heartbeat wait', el: () => (
      <Screen>
        <div style={{ position: 'absolute', left: 18, top: 8 }}>
          <Icon name="circle-check" size={18} stroke={2.2} />
        </div>
        <div style={{ position: 'absolute', left: 56, top: 12 }}>
          <Icon name="arrow-right-left" size={10} stroke={2.2} />
        </div>
        <div style={{ position: 'absolute', left: 90, top: 8 }}>
          <Icon name="loader" size={18} stroke={2.2} />
        </div>
        <T x={0} y={32} w={128} align="center" size={7}>RFD ok · MAVLink?</T>
        <T x={0} y={42} w={128} align="center" size={6}>aircraft heartbeat…</T>
        <D3HintBar l="chevron-left" r="x" hl="x" hr="zap" />
      </Screen>
    )},
    { cap: 'Ready', el: () => (
      <Screen>
        <D3PageStrip active={0} />
        <ScreenIcon x={6} y={16} name="radio-tower" size={24} stroke={2} />
        <Big x={36} y={12} size={28}>−58</Big>
        <T x={36} y={36} size={6}>dBm · NET 25</T>
        <T x={36} y={44} size={6}>915.000 MHz</T>
        <Bar x={96} y={18} w={28} h={3} v={0.74} />
        <D3HintBar />
      </Screen>
    )},
  ],

  // D4 Mode banner
  4: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <Inv x={0} y={0} w={128} h={10}>
          <T x={0} y={1} w={128} align="center" size={7} inv bold>BOOT · 1/4</T>
        </Inv>
        <T x={0} y={18} w={128} align="center" size={9} bold>C2 BOX</T>
        <div style={{ position: 'absolute', left: 49, top: 30 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <T x={0} y={50} w={128} align="center" size={6}>fw 1.4.2 · hw r3</T>
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <Inv x={0} y={0} w={128} h={10}>
          <T x={0} y={1} w={128} align="center" size={7} inv bold>BOOT · RFD PROBE</T>
        </Inv>
        <T x={0} y={16} w={128} align="center" size={6}>attempt 1 of 3</T>
        <T x={0} y={24} w={128} align="center" size={6}>57600 baud · AT mode</T>
        <Progress x={14} y={34} w={100} v={0.4} />
        <T x={0} y={46} w={128} align="center" size={6}>2.4 s</T>
      </Screen>
    )},
    { cap: 'Heartbeat wait', el: () => (
      <Screen>
        <Inv x={0} y={0} w={128} h={10}>
          <T x={0} y={1} w={128} align="center" size={7} inv bold>BOOT · MAVLINK</T>
        </Inv>
        <div style={{ position: 'absolute', left: 6, top: 14 }}>
          <Icon name="circle-check" size={10} stroke={2.2} />
        </div>
        <T x={20} y={15} size={6}>RFD 915.0 · NET 25</T>
        <div style={{ position: 'absolute', left: 6, top: 26 }}>
          <Icon name="loader" size={10} stroke={2.2} />
        </div>
        <T x={20} y={27} size={6}>waiting heartbeat</T>
        <T x={20} y={35} size={6}>2.1 s</T>
        <HintBar y={56} l="—" r="—" hl="cancel" hr="skip" />
      </Screen>
    )},
    { cap: 'Ready', el: () => (
      <Screen>
        <ModeBanner label="MONITOR" sub="· RADIO" icon="radio-tower" arm link={4} />
        <T x={3} y={14} size={6}>RSSI</T>
        <Big x={2} y={19} size={26}>−58</Big>
        <T x={44} y={24} size={6}>dBm</T>
        <T x={44} y={32} size={6}>noise −104</T>
        <T x={3} y={42} size={6}>NET 25 · 915.000</T>
        <Bar x={3} y={49} w={122} h={4} v={0.74} />
        <HintBar y={56} l="prev" r="next" hl="menu" hr="RFD" />
      </Screen>
    )},
  ],

  // D5 Card stack
  5: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <D5Crumb n={1} of={4} name="BOOT" link={0} />
        <T x={0} y={20} w={128} align="center" size={11} bold>C2 BOX</T>
        <div style={{ position: 'absolute', left: 49, top: 33 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <T x={0} y={52} w={128} align="center" size={6}>fw 1.4.2 · hw r3</T>
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <D5Crumb n={2} of={4} name="RFD PROBE" link={0} />
        <div style={{ position: 'absolute', left: 8, top: 14 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <Big x={28} y={12} size={22}>1/3</Big>
        <T x={66} y={20} size={6}>57600</T>
        <T x={66} y={28} size={6}>AT mode</T>
        <Progress x={6} y={36} w={116} v={0.4} />
        <T x={0} y={46} w={128} align="center" size={6}>2.4 s elapsed</T>
        <HintBar l="—" r="skip" hl="cancel" />
      </Screen>
    )},
    { cap: 'Heartbeat wait', el: () => (
      <Screen>
        <D5Crumb n={3} of={4} name="MAVLINK" link={3} />
        <div style={{ position: 'absolute', left: 6, top: 12 }}>
          <Icon name="circle-check" size={12} stroke={2.2} />
        </div>
        <T x={22} y={13} size={7}>RFD link</T>
        <T x={22} y={21} size={6}>915.0 · NET 25</T>
        <HR y={32} />
        <div style={{ position: 'absolute', left: 6, top: 36 }}>
          <Icon name="loader" size={12} stroke={2.2} />
        </div>
        <T x={22} y={37} size={7}>aircraft hb…</T>
        <T x={22} y={45} size={6}>2.1 s</T>
        <HintBar l="—" r="skip" hl="cancel" />
      </Screen>
    )},
    { cap: 'Ready', el: () => (
      <Screen>
        <D5Crumb n={1} of={6} name="RADIO" arm />
        <T x={3} y={13} size={6}>SIGNAL</T>
        <Big x={2} y={18} size={30}>−58</Big>
        <T x={50} y={28} size={7}>dBm</T>
        <T x={3} y={40} size={6}>NET 25 · 915.000 · TX 20</T>
        <Bar x={3} y={47} w={122} h={4} v={0.74} />
        <HintBar l="prev" r="next" hl="exit" hr="RFD" />
      </Screen>
    )},
  ],

  // D6 Dashboard — boot ends on tile dashboard
  6: [
    { cap: 'Splash · POR', el: () => (
      <Screen>
        <D6Header page="C2 BOX" />
        <T x={0} y={16} w={128} align="center" size={9} bold>C2 BOX</T>
        <div style={{ position: 'absolute', left: 49, top: 26 }}>
          <Icon name="radio-tower" size={16} stroke={2} />
        </div>
        <T x={0} y={48} w={128} align="center" size={6}>fw 1.4.2 · hw r3</T>
      </Screen>
    )},
    { cap: 'Probing RFD', el: () => (
      <Screen>
        <D6Header page="STARTUP" />
        <Tile x={4}  y={11} w={56} h={20} icon="radio-tower" label="RFD" value="probe" sub="attempt 1/3" />
        <Tile x={64} y={11} w={60} h={20} icon="loader" label="STATUS" value="…" sub="57600 baud" />
        <HR y={31} />
        <Tile x={4}  y={33} w={120} h={20} icon="loader" label="PROGRESS" value="" sub="" />
        <Progress x={4} y={45} w={120} v={0.4} />
        <HintBar l="—" r="skip" hl="cancel" />
      </Screen>
    )},
    { cap: 'Heartbeat wait', el: () => (
      <Screen>
        <D6Header page="STARTUP" />
        <Tile x={4}  y={11} w={56} h={20} icon="circle-check" label="RFD" value="ok" sub="NET 25 · 915.0" />
        <Tile x={64} y={11} w={60} h={20} icon="loader" label="MAVLINK" value="…" sub="hb 2.1 s" />
        <HR y={31} />
        <Tile x={4}  y={33} w={120} h={20} icon="info" label="STATUS" value="link up · awaiting aircraft" />
        <HintBar l="—" r="skip" hl="cancel" />
      </Screen>
    )},
    { cap: 'Ready · dashboard', el: () => (
      <Screen>
        <D6Header page="DASHBOARD" arm />
        <Tile x={3}  y={11} w={59} h={20} icon="radio-tower" label="RSSI" value="−58" sub="dBm  N−104" bar={0.74} />
        <Tile x={66} y={11} w={58} h={20} icon="hash" label="NET 25 · 915" value="ok" sub="TX 20" />
        <VR x={64} y={10} h={43} />
        <HR y={31} />
        <Tile x={3}  y={33} w={59} h={20} icon="battery" label="BATT" value="14.8v" sub="72% STAB" bar={0.72} />
        <Tile x={66} y={33} w={58} h={20} icon="satellite" label="GPS" value="12 · 3D" sub="HDOP 0.9" />
        <HintBar l="prev" r="next" hl="menu" hr="RFD" />
      </Screen>
    )},
  ],
};

const BootStrip = ({ dir, k = 2.2 }) => {
  const frames = Boot[dir] || [];
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

Object.assign(window, { BootStrip, Boot, Chrome });
