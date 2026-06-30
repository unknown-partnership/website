// Passthrough flow — the user's must-solve.
// Dedicated modes that bridge USB transparently to a target chip
// (RFD radio, ESP, or ELRS RX). 4 frames per direction:
// 1) Actions overlay (entered via Hold L+R from anywhere)
// 2) Passthrough chooser — pick target
// 3) RFD passthrough active
// 4) ESP passthrough active

// Shared bits ---------------------------------------------------------------

// USB ↔ Target flow widget. Two endpoint blobs + animated dots.
const Bridge = ({ x = 4, y = 18, w = 120, left = 'usb', right = 'radio-tower', leftLabel = 'USB', rightLabel = 'RFD', inv = false }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: 22 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 32, height: 22, boxShadow: 'inset 0 0 0 1px #e6efff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={left} size={12} stroke={2} />
      <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 6, marginTop: 1 }}>{leftLabel}</span>
    </div>
    <div style={{ position: 'absolute', left: w - 32, top: 0, width: 32, height: 22, boxShadow: 'inset 0 0 0 1px #e6efff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={right} size={12} stroke={2} />
      <span style={{ fontFamily: 'Silkscreen, monospace', fontSize: 6, marginTop: 1 }}>{rightLabel}</span>
    </div>
    {/* connecting line + arrows */}
    <div style={{ position: 'absolute', left: 32, top: 10, width: w - 64, height: 1, background: '#e6efff' }} />
    {/* moving dots */}
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} style={{
        position: 'absolute', left: 32 + ((i * 13) % (w - 70)) + 6, top: 9, width: 2, height: 3, background: '#e6efff',
      }} />
    ))}
    <div style={{ position: 'absolute', left: w - 38, top: 7, fontFamily: 'Silkscreen, monospace', fontSize: 8, lineHeight: '8px' }}>›</div>
    <div style={{ position: 'absolute', left: 32, top: 7, fontFamily: 'Silkscreen, monospace', fontSize: 8, lineHeight: '8px' }}>‹</div>
  </div>
);

// =========================================================================
// Direction 1 — Hint-Bar Conservative
// =========================================================================

const PassD1 = [
  { cap: 'Actions · L+R hold', el: () => (
    <Screen>
      <Header link={4} page="ACTIONS" uptime="01:24" arm />
      <MenuRow y={10} icon="gamepad-2" label="Pair RC" />
      <MenuRow y={21} icon="arrow-right-left" label="Passthrough" selected chevron />
      <MenuRow y={32} icon="power" label="Reboot box" danger />
      <MenuRow y={43} icon="corner-down-left" label="Close" />
      <HintBar l="cursor" r="open" hl="close" />
    </Screen>
  )},
  { cap: 'Choose target', el: () => (
    <Screen>
      <Header link={4} page="PASSTHRU" uptime="01:24" arm />
      <MenuRow y={10} icon="radio-tower" label="RFD radio (AT)" selected chevron />
      <MenuRow y={21} icon="microchip" label="ESP (Wi-Fi cfg)" chevron />
      <MenuRow y={32} icon="zap" label="ELRS (flash)" chevron danger />
      <MenuRow y={43} icon="corner-down-left" label="Cancel" />
      <HintBar l="cursor" r="enter" hl="back" />
    </Screen>
  )},
  { cap: 'RFD passthrough ON', el: () => (
    <Screen>
      <Header link={0} page="RFD PASSTHRU" uptime="01:24" pass />
      <Bridge x={4} y={13} w={120} left="usb" leftLabel="USB" right="radio-tower" rightLabel="RFD" />
      <T x={3} y={40} size={6}>57600 8N1 · transparent</T>
      <T x={3} y={48} size={6}>MAVLink paused</T>
      <HintBar hl="exit" hr="exit" l="L+R" r="hold" />
    </Screen>
  )},
  { cap: 'ESP passthrough ON', el: () => (
    <Screen>
      <Header link={0} page="ESP PASSTHRU" uptime="01:24" pass />
      <Bridge x={4} y={13} w={120} left="usb" leftLabel="USB" right="microchip" rightLabel="ESP" />
      <T x={3} y={40} size={6}>921600 baud · Wi-Fi mgr</T>
      <T x={3} y={48} size={6}>web cfg at 192.168.4.1</T>
      <HintBar hl="exit" hr="exit" l="L+R" r="hold" />
    </Screen>
  )},
];

// =========================================================================
// Direction 2 — Always-On Hints
// =========================================================================

const PassD2 = [
  { cap: 'Actions · L+R hold', el: () => (
    <Screen>
      <D2Header page="ACTIONS · L+R" arm />
      <Row2 y={10} icon="gamepad-2" label="Pair RC" />
      <Row2 y={18} icon="arrow-right-left" label="Passthrough" selected />
      <Row2 y={26} icon="zap" label="ELRS flash" danger />
      <Row2 y={34} icon="power" label="Reboot" danger />
      <Row2 y={42} icon="x" label="Close overlay" />
      <D2HintBar l="cursor" r="open" hl="close" hr="—" />
    </Screen>
  )},
  { cap: 'Choose target', el: () => (
    <Screen>
      <D2Header page="PASSTHRU · CHOOSE" arm />
      <Row2 y={10} icon="radio-tower" label="RFD · AT (57600)" selected />
      <Row2 y={18} icon="microchip" label="ESP · Wi-Fi (921k)" />
      <Row2 y={26} icon="zap" label="ELRS · flash mode" danger />
      <Row2 y={34} icon="cable" label="USB-CDC direct" />
      <Row2 y={42} icon="x" label="Cancel" />
      <D2HintBar l="cursor" r="enter" hl="back" hr="—" />
    </Screen>
  )},
  { cap: 'RFD passthrough', el: () => (
    <Screen>
      <D2Header page="PASSTHRU · RFD" link={0} pass />
      <Bridge x={4} y={10} w={120} left="usb" right="radio-tower" leftLabel="USB" rightLabel="RFD" />
      <T x={3} y={34} size={6}>57600 8N1 transparent</T>
      <T x={3} y={42} size={6}>RSSI hold = exit</T>
      <D2HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
  { cap: 'ESP passthrough', el: () => (
    <Screen>
      <D2Header page="PASSTHRU · ESP" link={0} pass />
      <Bridge x={4} y={10} w={120} left="usb" right="microchip" leftLabel="USB" rightLabel="ESP" />
      <T x={3} y={34} size={6}>921600 · web @192.168.4.1</T>
      <T x={3} y={42} size={6}>L+R hold = exit</T>
      <D2HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
];

// =========================================================================
// Direction 3 — Glyph-Forward
// =========================================================================

const PassD3 = [
  { cap: 'Actions overlay', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <T x={0} y={11} w={128} align="center" size={6}>ACTIONS · hold L+R</T>
      <GRow y={20} icon="gamepad-2" label="pair RC" />
      <GRow y={32} icon="arrow-right-left" label="passthrough" selected />
      <GRow y={44} icon="power" label="reboot" danger />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'Target picker', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <Tile x={3} y={11} w={38} h={32} icon="radio-tower" label="RFD" value="AT" sub="57600" />
      <Tile x={45} y={11} w={38} h={32} icon="microchip" label="ESP" value="Wi-Fi" sub="921k" />
      <Tile x={87} y={11} w={38} h={32} icon="zap" label="ELRS" value="flash" sub="danger" />
      <Box x={2} y={10} w={40} h={34} />
      <D3HintBar />
    </Screen>
  )},
  { cap: 'RFD passthrough', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 6, top: 16 }}>
        <Icon name="usb" size={20} stroke={2} />
      </div>
      <div style={{ position: 'absolute', left: 40, top: 18 }}>
        <Icon name="arrow-right-left" size={16} stroke={2.4} />
      </div>
      <div style={{ position: 'absolute', left: 64, top: 16 }}>
        <Icon name="radio-tower" size={20} stroke={2} />
      </div>
      <T x={92} y={20} size={7} bold>RFD</T>
      <T x={92} y={28} size={6}>57600</T>
      <HR y={42} />
      <T x={0} y={44} w={128} align="center" size={6}>L+R hold to exit</T>
      <D3HintBar l="x" r="x" hl="corner-down-left" hr="corner-down-left" />
    </Screen>
  )},
  { cap: 'ESP passthrough', el: () => (
    <Screen>
      <D3PageStrip active={-1} />
      <div style={{ position: 'absolute', left: 6, top: 16 }}>
        <Icon name="usb" size={20} stroke={2} />
      </div>
      <div style={{ position: 'absolute', left: 40, top: 18 }}>
        <Icon name="arrow-right-left" size={16} stroke={2.4} />
      </div>
      <div style={{ position: 'absolute', left: 64, top: 16 }}>
        <Icon name="microchip" size={20} stroke={2} />
      </div>
      <T x={92} y={20} size={7} bold>ESP</T>
      <T x={92} y={28} size={6}>921k</T>
      <HR y={42} />
      <T x={0} y={44} w={128} align="center" size={6}>web · 192.168.4.1</T>
      <D3HintBar l="x" r="x" hl="corner-down-left" hr="corner-down-left" />
    </Screen>
  )},
];

// =========================================================================
// Direction 4 — Mode Banner (PASSTHRU mode is its own banner — strongest)
// =========================================================================

const PassD4 = [
  { cap: 'Actions overlay', el: () => (
    <Screen>
      <ModeBanner label="ACTIONS" sub="· L+R OVERLAY" icon="menu" arm />
      <Row4 y={11} icon="gamepad-2" label="Pair RC" />
      <Row4 y={20} icon="arrow-right-left" label="Passthrough" selected />
      <Row4 y={29} icon="zap" label="ELRS flash" danger />
      <Row4 y={38} icon="power" label="Reboot box" danger />
      <Row4 y={47} icon="x" label="Close" />
      <HintBar y={56} l="cursor" r="open" hl="close" />
    </Screen>
  )},
  { cap: 'Choose target', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· CHOOSE" icon="arrow-right-left" arm />
      <Row4 y={11} icon="radio-tower" label="RFD radio (AT)" selected />
      <Row4 y={20} icon="microchip" label="ESP (Wi-Fi cfg)" />
      <Row4 y={29} icon="zap" label="ELRS (flash)" danger />
      <Row4 y={38} icon="cable" label="USB-CDC direct" />
      <Row4 y={47} icon="x" label="Cancel" />
      <HintBar y={56} l="cursor" r="enter" hl="back" />
    </Screen>
  )},
  { cap: 'PASSTHRU · RFD', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· RFD · LIVE" icon="radio-tower" link={0} />
      <Bridge x={4} y={14} w={120} left="usb" leftLabel="USB" right="radio-tower" rightLabel="RFD" />
      <T x={3} y={40} size={6}>57600 8N1 · transparent</T>
      <T x={3} y={48} size={6}>MAVLink paused · 0 b/s</T>
      <HintBar y={56} l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
  { cap: 'PASSTHRU · ESP', el: () => (
    <Screen>
      <ModeBanner label="PASSTHRU" sub="· ESP · LIVE" icon="microchip" link={0} />
      <Bridge x={4} y={14} w={120} left="usb" leftLabel="USB" right="microchip" rightLabel="ESP" />
      <T x={3} y={40} size={6}>921600 baud · web mgr</T>
      <T x={3} y={48} size={6}>192.168.4.1 · L+R = exit</T>
      <HintBar y={56} l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
];

// =========================================================================
// Direction 5 — Card Stack
// =========================================================================

const PassD5 = [
  { cap: 'Card · Actions', el: () => (
    <Screen>
      <D5Crumb n={0} of={5} name="ACTIONS · L+R" />
      <Row4 y={11} icon="gamepad-2" label="Pair RC" />
      <Row4 y={20} icon="arrow-right-left" label="Passthrough" selected />
      <Row4 y={29} icon="power" label="Reboot box" danger />
      <Row4 y={38} icon="x" label="Close" />
      <T x={3} y={48} size={6}>L+R again = close</T>
      <HintBar l="cursor" r="open" hl="close" />
    </Screen>
  )},
  { cap: 'Card · target', el: () => (
    <Screen>
      <D5Crumb n={1} of={3} name="PASSTHRU" />
      <div style={{ position: 'absolute', left: 6, top: 12 }}>
        <Icon name="radio-tower" size={18} stroke={2} />
      </div>
      <Big x={32} y={11} size={22}>RFD</Big>
      <T x={68} y={16} size={6}>radio AT cfg</T>
      <T x={68} y={24} size={6}>57600 8N1</T>
      <T x={68} y={32} size={6}>1 of 3</T>
      <T x={3} y={44} size={6}>L/R switch · hold L exit · hold R enter</T>
      <HintBar l="prev" r="enter" hl="exit" />
    </Screen>
  )},
  { cap: 'Card · RFD live', el: () => (
    <Screen>
      <D5Crumb n={1} of={3} name="RFD · LIVE" link={0} pass />
      <Bridge x={4} y={12} w={120} left="usb" leftLabel="USB" right="radio-tower" rightLabel="RFD" />
      <T x={3} y={38} size={6}>57600 · transparent</T>
      <T x={3} y={46} size={6}>RX 1.2k · TX 0.8k bytes</T>
      <HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
  { cap: 'Card · ESP live', el: () => (
    <Screen>
      <D5Crumb n={2} of={3} name="ESP · LIVE" link={0} pass />
      <Bridge x={4} y={12} w={120} left="usb" leftLabel="USB" right="microchip" rightLabel="ESP" />
      <T x={3} y={38} size={6}>921600 · web mgr</T>
      <T x={3} y={46} size={6}>192.168.4.1 · joined 2 dev</T>
      <HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
];

// =========================================================================
// Direction 6 — Dashboard (passthrough as a 2-tile bridge dashboard)
// =========================================================================

const PassD6 = [
  { cap: 'Actions · tiles', el: () => (
    <Screen>
      <D6Header page="ACTIONS · L+R" />
      <Tile x={3}  y={11} w={59} h={20} icon="gamepad-2" label="PAIR" value="RC" sub="FrSky / ELRS" />
      <Tile x={66} y={11} w={58} h={20} icon="arrow-right-left" label="PASS" value="THRU" sub="RFD/ESP/ELRS" />
      <Box x={65} y={10} w={60} h={22} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="power" label="REBOOT" value="box" sub="confirm 1.2s" />
      <Tile x={66} y={33} w={58} h={20} icon="x" label="CLOSE" value="L+R" sub="" />
      <HintBar l="cursor" r="open" hl="close" />
    </Screen>
  )},
  { cap: 'Target tiles', el: () => (
    <Screen>
      <D6Header page="PASSTHRU CHOOSE" />
      <Tile x={3}  y={11} w={38} h={42} icon="radio-tower" label="RFD" value="AT" sub="57600" />
      <Tile x={45} y={11} w={38} h={42} icon="microchip" label="ESP" value="Wi-Fi" sub="921k" />
      <Tile x={87} y={11} w={38} h={42} icon="zap" label="ELRS" value="flash" sub="DANGER" />
      <Box x={2} y={10} w={40} h={44} />
      <HintBar l="cursor" r="enter" hl="back" />
    </Screen>
  )},
  { cap: 'RFD · live dash', el: () => (
    <Screen>
      <D6Header page="RFD · LIVE" />
      <Tile x={3}  y={11} w={59} h={20} icon="usb" label="HOST" value="USB" sub="GCS connected" />
      <Tile x={66} y={11} w={58} h={20} icon="radio-tower" label="TGT" value="RFD" sub="57600 8N1" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="arrow-right-left" label="RX/TX" value="1.2k/0.8k" sub="bytes/s" />
      <Tile x={66} y={33} w={58} h={20} icon="x" label="EXIT" value="L+R" sub="hold 0.6s" />
      <HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
  { cap: 'ESP · live dash', el: () => (
    <Screen>
      <D6Header page="ESP · LIVE" />
      <Tile x={3}  y={11} w={59} h={20} icon="usb" label="HOST" value="USB" sub="921600 cdc" />
      <Tile x={66} y={11} w={58} h={20} icon="microchip" label="TGT" value="ESP" sub="Wi-Fi mgr" />
      <VR x={64} y={10} h={43} />
      <HR y={31} />
      <Tile x={3}  y={33} w={59} h={20} icon="wifi" label="WEB" value="192.168.4.1" sub="" />
      <Tile x={66} y={33} w={58} h={20} icon="x" label="EXIT" value="L+R" sub="hold 0.6s" />
      <HintBar l="—" r="—" hl="exit" hr="exit" />
    </Screen>
  )},
];

const PASS = { 1: PassD1, 2: PassD2, 3: PassD3, 4: PassD4, 5: PassD5, 6: PassD6 };

const PassStrip = ({ dir, k = 2.4 }) => {
  const frames = PASS[dir] || [];
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

Object.assign(window, { PassStrip, PASS, Bridge });
