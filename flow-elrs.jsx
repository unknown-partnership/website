// ELRS flash — putting the ELRS receiver into firmware passthrough so
// the host (ExpressLRS Configurator) can flash it. 3 frames per direction:
// 1) Entry warning (don't unplug — this is destructive)
// 2) Bridge active — USB ↔ ELRS RX with throughput indicator
// 3) Done — box reboots

// =========================================================================
// D1 — Conservative
// =========================================================================

const ElrsD1 = [
  { cap: 'Entry warning', el: () => (
    <Screen>
      <Header link={4} page="ELRS FLASH" uptime="01:24" />
      <div style={{ position: 'absolute', left: 6, top: 14 }}>
        <Icon name="octagon-alert" size={14} stroke={2.2} />
      </div>
      <T x={24} y={14} size={7} bold>USB → ELRS bridge</T>
      <T x={24} y={22} size={6}>do NOT unplug</T>
      <T x={24} y={30} size={6}>box reboots on exit</T>
      <T x={24} y={38} size={6}>use ELRS Cfg to flash</T>
      <HR y={47} />
      <T x={3} y={49} size={6}>hold R 1.2s to start</T>
      <HintBar l="cancel" r="hold ok" hl="back" />
    </Screen>
  )},
  { cap: 'Bridge active', el: () => (
    <Screen>
      <Header link={0} page="ELRS BRIDGE" uptime="01:24" pass />
      <Bridge x={4} y={13} w={120} left="usb" leftLabel="USB" right="zap" rightLabel="ELRS" />
      <T x={3} y={40} size={6}>420 KB / 1.2 MB · 35%</T>
      <Progress x={3} y={47} w={122} v={0.35} />
      <T x={3} y={56} size={6} bold>do not unplug</T>
      <HintBar hl="abort" hr="abort" l="L+R" r="hold" />
    </Screen>
  )},
  { cap: 'Done · reboot', el: () => (
    <Screen>
      <Header link={4} page="DONE" uptime="01:32" />
      <div style={{ position: 'absolute', left: 56, top: 14 }}>
        <Icon name="circle-check" size={16} stroke={2.2} />
      </div>
      <T x={0} y={34} w={128} align="center" size={8} bold>FLASH OK</T>
      <T x={0} y={44} w={128} align="center" size={6}>rebooting in 2 s…</T>
      <HintBar />
    </Screen>
  )},
];

// =========================================================================
// D2 — Always-On Hints
// =========================================================================

const ElrsD2 = [
  { cap: 'Entry warning', el: () => (
    <Screen>
      <D2Header page="ELRS FLASH · ⚠" />
      <T x={3} y={11} size={6}>USB → ELRS bridge</T>
      <T x={3} y={19} size={6}>· do not unplug</T>
      <T x={3} y={27} size={6}>· box reboots on exit</T>
      <T x={3} y={35} size={6}>· use ELRS Configurator</T>
      <T x={3} y={43} size={6}>hold R 1.2s to begin</T>
      <D2HintBar l="cancel" r="hold ok" hl="back" hr="—" />
    </Screen>
  )},
  { cap: 'Bridge active', el: () => (
    <Screen>
      <D2Header page="ELRS BRIDGE · LIVE" pass link={0} />
      <Bridge x={4} y={10} w={120} left="usb" right="zap" leftLabel="USB" rightLabel="ELRS" />
      <Progress x={3} y={34} w={122} v={0.35} />
      <T x={3} y={42} size={6}>420k / 1.2M · 35%</T>
      <D2HintBar l="—" r="—" hl="abort" hr="abort" />
    </Screen>
  )},
  { cap: 'Done · reboot', el: () => (
    <Screen>
      <D2Header page="FLASH OK ✓" />
      <div style={{ position: 'absolute', left: 8, top: 12 }}>
        <Icon name="circle-check" size={20} stroke={2.2} />
      </div>
      <T x={36} y={16} size={8} bold>FLASH OK</T>
      <T x={36} y={26} size={6}>verified · 1.2 MB</T>
      <T x={36} y={34} size={6}>reboot in 2 s</T>
      <Progress x={3} y={44} w={122} v={0.9} />
      <D2HintBar l="—" r="—" hl="—" hr="—" />
    </Screen>
  )},
];

// =========================================================================
// D3 — Glyph-Forward
// =========================================================================

const ElrsD3 = [
  { cap: 'Entry warning', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 6, top: 14 }}>
        <Icon name="octagon-alert" size={26} stroke={2} />
      </div>
      <T x={40} y={15} size={7} bold>ELRS FLASH</T>
      <T x={40} y={25} size={6}>do NOT unplug</T>
      <T x={40} y={33} size={6}>USB → RX direct</T>
      <T x={40} y={41} size={6}>hold R to start</T>
      <D3HintBar l="x" r="check" hl="corner-down-left" />
    </Screen>
  )},
  { cap: 'Bridge active', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 6, top: 14 }}>
        <Icon name="usb" size={22} stroke={2} />
      </div>
      <div style={{ position: 'absolute', left: 36, top: 16 }}>
        <Icon name="arrow-right-left" size={18} stroke={2.4} />
      </div>
      <div style={{ position: 'absolute', left: 62, top: 14 }}>
        <Icon name="zap" size={22} stroke={2} />
      </div>
      <Big x={92} y={12} size={20}>35%</Big>
      <Progress x={3} y={46} w={122} v={0.35} />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Done', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 16, top: 12 }}>
        <Icon name="circle-check" size={32} stroke={2.2} />
      </div>
      <T x={56} y={18} size={9} bold>FLASH</T>
      <T x={56} y={28} size={9} bold>OK</T>
      <T x={56} y={40} size={6}>rebooting…</T>
      <D3HintBar />
    </Screen>
  )},
];

// =========================================================================
// D4 — Mode Banner
// =========================================================================

const ElrsD4 = [
  { cap: 'PASSTHRU · ELRS · GATE', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· ELRS · DANGER" icon="octagon-alert" />
      <T x={3} y={14} size={6}>USB ↔ ELRS RX bridge</T>
      <T x={3} y={22} size={6}>· firmware will write to RX</T>
      <T x={3} y={30} size={6}>· do NOT unplug</T>
      <T x={3} y={38} size={6}>· box reboots on exit</T>
      <HR y={47} />
      <T x={3} y={49} size={6}>hold R 1.2s to start</T>
      <HintBar y={56} l="cancel" r="hold ok" hl="back" />
    </Screen>
  )},
  { cap: 'PASSTHRU · ELRS · LIVE', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· ELRS · 35%" icon="zap" link={0} />
      <Bridge x={4} y={14} w={120} left="usb" leftLabel="USB" right="zap" rightLabel="ELRS" />
      <Progress x={3} y={40} w={122} v={0.35} />
      <T x={3} y={48} size={6}>420k / 1.2M · 35%</T>
      <HintBar y={56} l="—" r="—" hl="abort" hr="abort" />
    </Screen>
  )},
  { cap: 'PASSTHRU · ELRS · DONE', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· ELRS · DONE ✓" icon="circle-check" />
      <T x={0} y={18} w={128} align="center" size={11} bold>FLASH OK</T>
      <T x={0} y={32} w={128} align="center" size={6}>1.2 MB verified</T>
      <T x={0} y={40} w={128} align="center" size={6}>rebooting box…</T>
      <Progress x={3} y={48} w={122} v={0.92} />
      <HintBar y={56} />
    </Screen>
  )},
];

// =========================================================================
// D5 — Card Stack
// =========================================================================

const ElrsD5 = [
  { cap: 'Gate card', el: () => (
    <Screen>
      <D5Crumb n={0} of={3} name="ELRS FLASH" />
      <div style={{ position: 'absolute', left: 56, top: 11 }}>
        <Icon name="octagon-alert" size={18} stroke={2} />
      </div>
      <T x={0} y={32} w={128} align="center" size={6}>USB → ELRS RX bridge</T>
      <T x={0} y={40} w={128} align="center" size={6}>do not unplug</T>
      <T x={0} y={48} w={128} align="center" size={6}>hold R 1.2 s</T>
      <HintBar l="cancel" r="hold ok" hl="exit" />
    </Screen>
  )},
  { cap: 'Live card', el: () => (
    <Screen>
      <D5Crumb n={1} of={3} name="BRIDGING…" pass link={0} />
      <Bridge x={4} y={12} w={120} left="usb" leftLabel="USB" right="zap" rightLabel="ELRS" />
      <Big x={2} y={36} size={20}>35%</Big>
      <T x={40} y={42} size={6}>420 KB / 1.2 MB</T>
      <Progress x={3} y={48} w={122} v={0.35} />
      <HintBar l="—" r="—" hl="abort" hr="abort" />
    </Screen>
  )},
  { cap: 'Done card', el: () => (
    <Screen>
      <D5Crumb n={3} of={3} name="DONE" />
      <div style={{ position: 'absolute', left: 8, top: 12 }}>
        <Icon name="circle-check" size={20} stroke={2.2} />
      </div>
      <T x={36} y={16} size={11} bold>OK</T>
      <T x={36} y={32} size={6}>1.2 MB · verified</T>
      <T x={36} y={40} size={6}>rebooting…</T>
      <Progress x={3} y={50} w={122} v={0.92} />
      <HintBar />
    </Screen>
  )},
];

// =========================================================================
// D6 — Dashboard
// =========================================================================

const ElrsD6 = [
  { cap: 'Gate · risk tiles', el: () => (
    <Screen>
      <D6Header page="ELRS · GATE" />
      <Tile x={3}  y={11} w={59} h={20} icon="octagon-alert" label="RISK" value="HIGH" sub="don't unplug" />
      <Tile x={66} y={11} w={58} h={20} icon="zap" label="TARGET" value="ELRS" sub="USB direct" />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="x" label="CANCEL" value="L" sub="" />
      <Tile x={66} y={33} w={58} h={20} icon="check" label="START" value="R" sub="hold 1.2s" />
      <HintBar l="cancel" r="hold ok" hl="back" />
    </Screen>
  )},
  { cap: 'Bridge dashboard', el: () => (
    <Screen>
      <D6Header page="ELRS · LIVE" />
      <Tile x={3}  y={11} w={59} h={20} icon="usb" label="HOST" value="USB" sub="ELRS cfg open" />
      <Tile x={66} y={11} w={58} h={20} icon="zap" label="TGT" value="ELRS" sub="rx attached" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="upload" label="WRITE" value="35%" sub="420k / 1.2M" bar={0.35} />
      <Tile x={66} y={33} w={58} h={20} icon="x" label="ABORT" value="L+R" sub="hold 0.6s" />
      <HintBar l="—" r="—" hl="abort" hr="abort" />
    </Screen>
  )},
  { cap: 'Done · tiles', el: () => (
    <Screen>
      <D6Header page="FLASH OK ✓" />
      <Tile x={3}  y={11} w={59} h={20} icon="circle-check" label="STATUS" value="OK" sub="verified" />
      <Tile x={66} y={11} w={58} h={20} icon="hard-drive" label="SIZE" value="1.2 MB" sub="" />
      <HR y={31} />
      <Tile x={3}  y={33} w={120} h={20} icon="power" label="BOX" value="rebooting…" sub="" bar={0.92} />
      <HintBar />
    </Screen>
  )},
];

const ELRS = { 1: ElrsD1, 2: ElrsD2, 3: ElrsD3, 4: ElrsD4, 5: ElrsD5, 6: ElrsD6 };

const ElrsStrip = ({ dir, k = 2.4 }) => {
  const frames = ELRS[dir] || [];
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

Object.assign(window, { ElrsStrip, ELRS });
