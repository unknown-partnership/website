// RFD radio config — the disruptive flow. 4 frames per direction:
// 1) Confirm gate (MAVLink will drop)
// 2) RFD param list — browse radio settings
// 3) Numeric editor — the 16-bit Network ID
// 4) Apply prompt — Local / OTA / Cancel (OTA is the dangerous one)

// =========================================================================
// Direction 1 — Hint-Bar Conservative
// =========================================================================

const RfdD1 = [
  { cap: 'Confirm gate', el: () => (
    <Screen>
      <Header link={4} page="RFD CONFIG" uptime="01:24" arm />
      <div style={{ position: 'absolute', left: 6, top: 14 }}>
        <Icon name="triangle-alert" size={14} stroke={2.2} />
      </div>
      <T x={24} y={14} size={7} bold>MAVLink will drop</T>
      <T x={24} y={22} size={6}>while editing radio</T>
      <T x={24} y={30} size={6}>parameters. Aircraft</T>
      <T x={24} y={38} size={6}>telemetry pauses.</T>
      <HR y={47} />
      <T x={3} y={49} size={6}>continue?</T>
      <HintBar l="cancel" r="continue" hl="back" />
    </Screen>
  )},
  { cap: 'Param list', el: () => (
    <Screen>
      <Header link={0} page="RFD Util  2/26" uptime="01:24" pass />
      <MenuRow y={10} icon="hash" label="NetID" value="25" />
      <MenuRow y={21} icon="radio" label="AirSpd" value="64" selected />
      <MenuRow y={32} icon="zap" label="TxPwr" value="20" />
      <MenuRow y={43} icon="wifi" label="ECC" value="on" />
      <HintBar l="cursor" r="edit" hl="back" hr="apply" />
    </Screen>
  )},
  { cap: 'Numeric · NET ID', el: () => (
    <Screen>
      <Header link={0} page="NET ID" uptime="01:24" pass />
      <T x={3} y={13} size={6}>edit 16-bit value</T>
      <Big x={2} y={17} size={32}>00025</Big>
      <T x={70} y={22} size={6}>range 0..65535</T>
      <T x={70} y={30} size={6}>step ×1</T>
      <T x={70} y={38} size={6}>tap 5× = ×10</T>
      <Bar x={3} y={46} w={122} h={3} v={25 / 65535} />
      <HintBar l="−" r="+" hl="done" hr="×10" />
    </Screen>
  )},
  { cap: 'Apply choices', el: () => (
    <Screen>
      <Header link={0} page="APPLY" uptime="01:24" pass />
      <T x={3} y={13} size={6}>changes pending: 3</T>
      <MenuRow y={20} icon="save" label="Apply local" value="" selected />
      <MenuRow y={31} icon="broadcast" label="Apply over-air" value="" danger />
      <MenuRow y={42} icon="x" label="Discard" value="" />
      <HintBar l="cursor" r="apply" hl="back" />
    </Screen>
  )},
];

// =========================================================================
// Direction 2 — Always-On Hints
// =========================================================================

const RfdD2 = [
  { cap: 'Confirm gate', el: () => (
    <Screen>
      <D2Header page="RFD CONFIG · GATE" link={4} arm />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="triangle-alert" size={12} stroke={2.2} />
      </div>
      <T x={22} y={13} size={6}>MAVLink will drop</T>
      <T x={22} y={21} size={6}>aircraft telemetry</T>
      <T x={22} y={29} size={6}>pauses ~30 s</T>
      <T x={3} y={42} size={6}>are you sure?</T>
      <D2HintBar l="cancel" r="open" hl="exit" hr="—" />
    </Screen>
  )},
  { cap: 'Param list', el: () => (
    <Screen>
      <D2Header page="RFD · 2/12" link={0} pass />
      <Row2 y={9}  icon="hash"  label="NET ID"   value="25" />
      <Row2 y={17} icon="radio" label="AIR RATE" value="64" selected />
      <Row2 y={25} icon="zap"   label="TX POWER" value="20" />
      <Row2 y={33} icon="wifi"  label="ECC"      value="on" />
      <Row2 y={41} icon="signal" label="LBT"     value="off" />
      <D2HintBar l="cursor" r="edit" hl="back" hr="apply" />
    </Screen>
  )},
  { cap: 'Numeric · NET ID', el: () => (
    <Screen>
      <D2Header page="NET ID · 16-bit" link={0} pass />
      <Big x={2} y={12} size={28}>00025</Big>
      <T x={84} y={14} size={6}>step</T>
      <T x={84} y={20} size={6}>×100</T>
      <T x={84} y={28} size={6}>accel</T>
      <T x={84} y={34} size={6}>(tap=×1)</T>
      <Bar x={3} y={44} w={122} h={3} v={25 / 65535} />
      <D2HintBar l="−×100" r="+×100" hl="done" hr="×1" />
    </Screen>
  )},
  { cap: 'Apply · safe vs OTA', el: () => (
    <Screen>
      <D2Header page="APPLY · 3 edits" link={0} pass />
      <Row2 y={10} icon="save" label="Apply local" selected />
      <Row2 y={18} icon="broadcast" label="Apply over-air" danger />
      <Row2 y={26} icon="rotate-cw" label="Apply + match remote" danger />
      <Row2 y={34} icon="x" label="Discard" />
      <Row2 y={42} icon="corner-down-left" label="Back" />
      <D2HintBar l="cursor" r="apply" hl="back" hr="hold ok" />
    </Screen>
  )},
];

// =========================================================================
// Direction 3 — Glyph-Forward
// =========================================================================

const RfdD3 = [
  { cap: 'Confirm gate', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 8, top: 13 }}>
        <Icon name="shield-alert" size={28} stroke={2} />
      </div>
      <T x={42} y={14} size={8} bold>MAVLINK</T>
      <T x={42} y={23} size={8} bold>DROPS</T>
      <T x={42} y={34} size={6}>edit radio params</T>
      <T x={42} y={42} size={6}>aircraft pauses ~30s</T>
      <D3HintBar l="x" r="check" hl="corner-down-left" />
    </Screen>
  )},
  { cap: 'Param list', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <GRow y={10} icon="hash" label="NET" value="25" />
      <GRow y={22} icon="radio" label="RATE" value="64" selected />
      <GRow y={34} icon="zap" label="POWER" value="20" />
      <GRow y={46} icon="wifi" label="ECC" value="on" />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Numeric · NET ID', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 4, top: 14 }}>
        <Icon name="hash" size={24} stroke={2} />
      </div>
      <Big x={30} y={11} size={34}>00025</Big>
      <T x={30} y={42} size={6}>0..65535 · step ×100</T>
      <Bar x={3} y={50} w={122} h={2} v={25 / 65535} />
      <D3HintBar l="minus" r="plus" hl="check" hr="zap" />
    </Screen>
  )},
  { cap: 'Apply choices', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <GRow y={10} icon="save" label="local" selected />
      <GRow y={22} icon="broadcast" label="over-air" danger />
      <GRow y={34} icon="rotate-cw" label="local+remote" danger />
      <GRow y={46} icon="x" label="discard" />
      <D3HintBar />
    </Screen>
  )},
];

// =========================================================================
// Direction 4 — Mode Banner
// =========================================================================

const RfdD4 = [
  { cap: 'Confirm gate', el: () => (
    <Screen>
      <ModeBanner label="CONFIG" sub="· RFD · DANGER" icon="shield-alert" />
      <T x={3} y={14} size={6}>MAVLink will drop:</T>
      <T x={3} y={22} size={6}>· aircraft telemetry pauses</T>
      <T x={3} y={30} size={6}>· box reboots after apply</T>
      <T x={3} y={38} size={6}>· takes ~30 s round trip</T>
      <HR y={47} />
      <T x={3} y={49} size={6}>R = continue (hold to confirm)</T>
      <HintBar y={56} l="cancel" r="hold ok" hl="back" />
    </Screen>
  )},
  { cap: 'Param list', el: () => (
    <Screen>
      <ModeBanner label="CONFIG" sub="· RFD · 2/12" icon="radio-tower" pass />
      <Row4 y={11} icon="hash" label="NET ID" value="25" />
      <Row4 y={20} icon="radio" label="AIR RATE" value="64" selected />
      <Row4 y={29} icon="zap" label="TX POWER" value="20" />
      <Row4 y={38} icon="wifi" label="ECC" value="on" />
      <Row4 y={47} icon="signal" label="LBT" value="off" />
      <HintBar y={56} l="cursor" r="edit" hl="back" hr="apply" />
    </Screen>
  )},
  { cap: 'Numeric · NET ID', el: () => (
    <Screen>
      <ModeBanner label="CONFIG" sub="· NET ID" icon="hash" pass />
      <Big x={2} y={14} size={30}>00025</Big>
      <T x={78} y={16} size={6}>step</T>
      <T x={78} y={22} size={7} bold>×100</T>
      <T x={78} y={31} size={6}>tap 5× = +10</T>
      <T x={78} y={37} size={6}>(tap=×1)</T>
      <Bar x={3} y={46} w={122} h={3} v={25 / 65535} />
      <HintBar y={56} l="−" r="+" hl="done" hr="step" />
    </Screen>
  )},
  { cap: 'Apply choices', el: () => (
    <Screen>
      <ModeBanner label="CONFIG" sub="· APPLY · DANGER" icon="shield-alert" pass />
      <Row4 y={11} icon="save" label="Local only" selected />
      <Row4 y={20} icon="broadcast" label="Over-air sync" danger />
      <Row4 y={29} icon="rotate-cw" label="Local + remote" danger />
      <Row4 y={38} icon="x" label="Discard edits" />
      <Row4 y={47} icon="corner-down-left" label="Back" />
      <HintBar y={56} l="cursor" r="hold ok" hl="back" />
    </Screen>
  )},
];

// =========================================================================
// Direction 5 — Card Stack
// =========================================================================

const RfdD5 = [
  { cap: 'Gate · card', el: () => (
    <Screen>
      <D5Crumb n={0} of={12} name="RFD CONFIG" />
      <div style={{ position: 'absolute', left: 56, top: 11 }}>
        <Icon name="shield-alert" size={16} stroke={2} />
      </div>
      <T x={0} y={30} w={128} align="center" size={7} bold>MAVLink will drop</T>
      <T x={0} y={38} w={128} align="center" size={6}>aircraft telemetry pauses</T>
      <T x={0} y={46} w={128} align="center" size={6}>hold R to continue</T>
      <HintBar l="cancel" r="hold ok" hl="exit" />
    </Screen>
  )},
  { cap: 'Card · AIR RATE', el: () => (
    <Screen>
      <D5Crumb n={2} of={12} name="AIR RATE" pass link={0} />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="radio" size={16} stroke={2} />
      </div>
      <Big x={28} y={11} size={32}>64</Big>
      <T x={68} y={20} size={6}>kbps</T>
      <T x={68} y={28} size={6}>4 · 16 · 32 · [64] · 128 · 192 · 250</T>
      <Bar x={3} y={42} w={122} h={3} v={64 / 250} />
      <T x={3} y={48} size={6}>matches remote · ok</T>
      <HintBar l="prev" r="next" hl="exit" hr="apply" />
    </Screen>
  )},
  { cap: 'Card · NET ID (num)', el: () => (
    <Screen>
      <D5Crumb n={1} of={12} name="NET ID · 16-bit" pass link={0} />
      <T x={3} y={13} size={6}>edit value · step ×100</T>
      <Big x={4} y={17} size={36}>00025</Big>
      <T x={92} y={22} size={6}>÷65535</T>
      <Bar x={3} y={42} w={122} h={3} v={25 / 65535} />
      <T x={3} y={48} size={6}>hold R cycles step ×1 / ×10 / ×100</T>
      <HintBar l="−×100" r="+×100" hl="exit" hr="step" />
    </Screen>
  )},
  { cap: 'Apply card', el: () => (
    <Screen>
      <D5Crumb n={12} of={12} name="APPLY · 3 edits" pass link={0} />
      <Row4 y={11} icon="save" label="Local only" selected />
      <Row4 y={20} icon="broadcast" label="Over-air to remote" danger />
      <Row4 y={29} icon="rotate-cw" label="Local + match remote" danger />
      <Row4 y={38} icon="x" label="Discard all" />
      <T x={3} y={48} size={6}>OTA = hold R 1.2s</T>
      <HintBar l="cursor" r="apply" hl="exit" />
    </Screen>
  )},
];

// =========================================================================
// Direction 6 — Dashboard
// =========================================================================

const RfdD6 = [
  { cap: 'Gate · tiles', el: () => (
    <Screen>
      <D6Header page="RFD GATE" />
      <Tile x={3}  y={11} w={59} h={20} icon="triangle-alert" label="RISK" value="HIGH" sub="MAVLink drops" />
      <Tile x={66} y={11} w={58} h={20} icon="timer" label="DOWNTIME" value="~30s" sub="round-trip" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="x" label="CANCEL" value="L" sub="" />
      <Tile x={66} y={33} w={58} h={20} icon="check" label="CONTINUE" value="R" sub="hold 1.2s" />
      <HintBar l="cancel" r="hold ok" hl="back" />
    </Screen>
  )},
  { cap: 'Param tiles', el: () => (
    <Screen>
      <D6Header page="RFD PARAMS" />
      <Tile x={3}  y={11} w={38} h={20} icon="hash"    label="NET"    value="25"  sub="0..65k" />
      <Tile x={45} y={11} w={38} h={20} icon="radio"   label="RATE"   value="64"  sub="kbps" />
      <Tile x={87} y={11} w={38} h={20} icon="zap"     label="TX"     value="20"  sub="dBm" />
      <Tile x={3}  y={33} w={38} h={20} icon="wifi"    label="ECC"    value="on"  />
      <Tile x={45} y={33} w={38} h={20} icon="signal"  label="LBT"    value="off" />
      <Tile x={87} y={33} w={38} h={20} icon="broadcast" label="BAND" value="915" />
      <Box x={2} y={10} w={40} h={22} />
      <HintBar l="cursor" r="edit" hl="back" hr="apply" />
    </Screen>
  )},
  { cap: 'NET ID editor', el: () => (
    <Screen>
      <D6Header page="EDIT · NET ID" />
      <Tile x={3}  y={11} w={75} h={20} icon="hash" label="CURRENT" value="25" sub="of 65535" />
      <Tile x={82} y={11} w={42} h={20} icon="sliders-horizontal" label="STEP" value="×100" sub="hold R = step" />
      <VR x={80} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={75} h={20} icon="arrow-right-left" label="NEW" value="00025" sub="" bar={25 / 65535} />
      <Tile x={82} y={33} w={42} h={20} icon="save" label="WRITE" value="auto" sub="on done" />
      <HintBar l="−" r="+" hl="done" hr="step" />
    </Screen>
  )},
  { cap: 'Apply tiles', el: () => (
    <Screen>
      <D6Header page="APPLY · 3 edits" />
      <Tile x={3}  y={11} w={59} h={20} icon="save" label="LOCAL" value="safe" sub="reboots box" />
      <Tile x={66} y={11} w={58} h={20} icon="broadcast" label="OVER-AIR" value="DANGER" sub="risks link" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="rotate-cw" label="BOTH" value="DANGER" sub="hold R 1.2s" />
      <Tile x={66} y={33} w={58} h={20} icon="x" label="DISCARD" value="" sub="L = cancel" />
      <Box x={2} y={10} w={61} h={22} />
      <HintBar l="cursor" r="hold ok" hl="back" />
    </Screen>
  )},
];

const RFDS = { 1: RfdD1, 2: RfdD2, 3: RfdD3, 4: RfdD4, 5: RfdD5, 6: RfdD6 };

const RfdStrip = ({ dir, k = 2.4 }) => {
  const frames = RFDS[dir] || [];
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

Object.assign(window, { RfdStrip, RFDS });
