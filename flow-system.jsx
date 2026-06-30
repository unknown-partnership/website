// Committed direction: Glyph-Forward.
// Lucide icons do the talking. Big VT323 readouts. Hero glyphs on confirm
// gates. Hint chips show icons not words. Icon-strip header doubles as
// monitor pagination.

const DIRECTION = {
  n: 3, key: 'glyph',
  title: 'Glyph-Forward',
  subtitle:
    'Lucide icons do the talking. Big VT323 readouts, hero glyphs on confirm gates, ' +
    'hint chips use icons not words. The 8px icon-strip header doubles as monitor pagination.',
};

const BUTTON_RULE = [
  { gesture: 'L',        meaning: 'navigate · prev · cursor · decrement' },
  { gesture: 'R',        meaning: 'act · next · select · increment' },
  { gesture: 'Hold L',   meaning: 'back · exit · up-level' },
  { gesture: 'Hold R',   meaning: 'quick-jump · context shortcut' },
  { gesture: 'Hold L+R', meaning: 'Actions overlay (pair / passthru / reboot)' },
];

// ---------- Token strip cards used in the system overview ----------------

const TOKENS = [
  {
    title: 'Page-strip header',
    body: 'Six page glyphs across the top double as pagination. Active page is inverted. Link bars and ARM badge live at the right edge. 9px tall.',
    sample: () => (
      <Scaled k={3}>
        <Screen>
          <D3PageStrip active={0} />
          <T x={0} y={28} w={128} size={6} align="center">page-strip header · 9 px</T>
          <T x={0} y={40} w={128} size={6} align="center">tap L/R to walk left/right</T>
        </Screen>
      </Scaled>
    ),
  },
  {
    title: 'Hero glyph + VT323 numeric',
    body: 'A 24-px lucide glyph anchors the left third. The primary value reads in VT323 at 26–32 px — legible at a glance, no decimals unless they matter.',
    sample: () => (
      <Scaled k={3}>
        <Screen>
          <D3PageStrip active={0} />
          <ScreenIcon x={6} y={16} name="radio-tower" size={24} stroke={2} />
          <Big x={36} y={12} size={28}>−58</Big>
          <T x={36} y={36} size={6}>dBm · NET 25</T>
          <T x={36} y={44} size={6}>915.000 MHz</T>
          <Bar x={96} y={18} w={28} h={3} v={0.74} />
        </Screen>
      </Scaled>
    ),
  },
  {
    title: 'Icon hint chips',
    body: 'The bottom hint bar shows what each gesture does — but with lucide icons, not words. Filled chip = tap. Outlined chip = hold. No translation needed.',
    sample: () => (
      <Scaled k={3}>
        <Screen>
          <D3PageStrip active={0} />
          <T x={0} y={22} w={128} size={6} align="center">tap = filled badge</T>
          <T x={0} y={32} w={128} size={6} align="center">hold = outlined badge</T>
          <T x={0} y={42} w={128} size={6} align="center">glyph = the meaning</T>
          <D3HintBar />
        </Screen>
      </Scaled>
    ),
  },
  {
    title: 'Danger language',
    body: 'Risky actions earn a hero alert glyph (shield-alert / octagon-alert / lock). Confirms require a sustained hold-R (1.2 s) — never a quick R-tap.',
    sample: () => (
      <Scaled k={3}>
        <Screen>
          <D3PageStrip active={-1} />
          <div style={{ position: 'absolute', left: 8, top: 13 }}>
            <Icon name="shield-alert" size={28} stroke={2} />
          </div>
          <T x={42} y={14} size={8} bold>MAVLINK</T>
          <T x={42} y={23} size={8} bold>DROPS</T>
          <T x={42} y={34} size={6}>hold R 1.2s</T>
          <T x={42} y={42} size={6}>to continue</T>
          <D3HintBar l="x" r="check" hl="corner-down-left" />
        </Screen>
      </Scaled>
    ),
  },
];

const SystemLegend = () => (
  <div style={{ padding: '28px 32px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 40, alignItems: 'start' }}>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#c96442', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Universal button rule
        </div>
        <h2 style={{ margin: '4px 0 10px', fontSize: 28, lineHeight: 1.05, letterSpacing: '-.015em' }}>
          Two buttons.<br /> One grammar.
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(40,30,20,.7)', lineHeight: 1.5, margin: 0 }}>
          Every screen obeys the same five gestures, so muscle memory transfers
          between flows. The hint bar reminds, it never remaps.
        </p>
        <table style={{ marginTop: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#2a251f', borderCollapse: 'collapse' }}>
          <tbody>
            {BUTTON_RULE.map(r => (
              <tr key={r.gesture}>
                <td style={{ padding: '5px 14px 5px 0', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                  <span style={{ background: '#2a251f', color: '#f5efe2', borderRadius: 3, padding: '2px 7px', fontWeight: 600 }}>{r.gesture}</span>
                </td>
                <td style={{ padding: '5px 0', color: 'rgba(40,30,20,.8)' }}>{r.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 18, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(40,30,20,.55)', lineHeight: 1.55 }}>
          Holds chirp once at 800 ms; the action fires on release. Danger gates
          use a sustained 1.2 s hold and render a fill ring — mash-proof.
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#c96442', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Design language · Glyph-Forward
        </div>
        <h2 style={{ margin: '4px 0 8px', fontSize: 22, letterSpacing: '-.01em' }}>{DIRECTION.subtitle}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
          {TOKENS.map((t, i) => {
            const Sample = t.sample;
            return (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 0 0 1px rgba(0,0,0,.06)',
                padding: '14px 14px 12px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: '0 0 auto' }}>
                  <Sample />
                </div>
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{t.title}</div>
                  <p style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, lineHeight: 1.5, color: 'rgba(40,30,20,.7)' }}>{t.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { DIRECTION, BUTTON_RULE, SystemLegend, TOKENS });
