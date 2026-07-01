// ─────────────────────────────────────────────────────────────────────────
// shop.jsx — Shopify Storefront API cart for the MissionWeaver GCS page.
//
// This file is self-contained: a config block, a tiny GraphQL client, a React
// context that owns the cart, and the cart UI (drawer, qty stepper, buttons).
// It is loaded as a global <script type="text/babel"> *before* index.jsx, so
// its top-level consts (ShopProvider, useShop, CartDrawer, AddToCart,
// BuyButton, CartButton) are visible to index.jsx — same pattern icons.jsx
// uses to expose <Icon>.
//
// ░░ SETUP ░░ Fill in SHOP_CONFIG below with the store's PUBLIC Storefront API
// credentials. Until then the page renders fine and the cart UI shows a
// "not connected yet" state instead of making network calls. Full setup steps
// (and which Shopify inventory settings drive the stock/backorder behavior)
// are in SHOPIFY_SETUP.md.
//
// SECURITY: the token here ships to every visitor's browser, so it MUST be the
// public *Storefront API access token* (a 32-char hex string, header
// X-Shopify-Storefront-Access-Token). NEVER paste an app secret / Admin token
// here — those start with shpss_ / shpat_ / shpca_ / shppa_ and grant
// write access to the whole store. A guard below refuses to run if it sees one.
// ─────────────────────────────────────────────────────────────────────────

const SHOP_CONFIG = {
  // e.g. 'missionweaver.myshopify.com' (the .myshopify.com domain, not a custom domain)
  DOMAIN: 'aev1ae-71.myshopify.com',

  // PUBLIC Storefront API access token (NOT the shpss_ secret). 32 hex chars.
  TOKEN: '72340ccfff6159b0264d35a6dcc2044c',

  // The product to sell. Provide EITHER a handle (from the product's admin URL,
  // .../products/<handle>) OR an explicit variant GID. If both are set,
  // VARIANT_ID wins. If only HANDLE is set, the first variant is used.
  PRODUCT_HANDLE: 'missionweaver-gcs',
  VARIANT_ID: '', // optional, e.g. 'gid://shopify/ProductVariant/1234567890'

  // Storefront API version. Bump to a newer dated version when convenient.
  API_VERSION: '2025-01',

  // Show real Shopify prices in the cart drawer. The marketing copy stays
  // price-free; this only controls the cart/line/subtotal figures.
  SHOW_PRICES: true,

  // Upper bound for the quantity stepper. Real availability still caps this
  // when inventory is tracked + "stop selling when out of stock" is on.
  MAX_QTY: 10,

  // Backorder / lead time. When ALLOW_BACKORDER is on, customers can order
  // beyond what's in stock: units up to the in-stock count go on a "ships now"
  // line, and the overflow goes on a SEPARATE "ships in ~LEAD_TIME" line item
  // (a visible Fulfillment attribute is stamped on each, so it carries through
  // to the Shopify order). This needs two store settings — see SHOPIFY_SETUP.md:
  //   1. the variant's inventory policy = "Continue selling when out of stock"
  //      (otherwise Shopify clamps the total to what's in stock), and
  //   2. the `unauthenticated_read_product_inventory` scope (so the page knows
  //      the in-stock count to split on). Without the scope the split can't be
  //      computed and the whole quantity is treated as one plain line.
  ALLOW_BACKORDER: true,
  LEAD_TIME: '3 weeks',
  BACKORDER_MAX: 25, // per-order cap on backordered units (sanity limit)
};

// Sentinels that mean "still a placeholder". Lets the page run pre-launch.
const looksUnset = (v) =>
  !v || /^YOUR[-_]/i.test(v) || v.indexOf('YOUR-STORE') !== -1;

// A pasted *secret* would be a security hole — detect and refuse it loudly.
const looksLikeSecret = (t) => /^shp(ss|at|ca|pa)_/.test(t || '');

const SHOP_READY = (() => {
  if (looksUnset(SHOP_CONFIG.DOMAIN) || looksUnset(SHOP_CONFIG.TOKEN)) return false;
  if (looksUnset(SHOP_CONFIG.PRODUCT_HANDLE) && !SHOP_CONFIG.VARIANT_ID) return false;
  if (looksLikeSecret(SHOP_CONFIG.TOKEN)) {
    // eslint-disable-next-line no-console
    console.error(
      '[shop] SHOP_CONFIG.TOKEN looks like a SECRET token (shpss_/shpat_/…). ' +
      'That must never be exposed in client-side code. Use the PUBLIC Storefront ' +
      'API access token instead. Cart is disabled until this is fixed.'
    );
    return false;
  }
  return true;
})();

// ── GraphQL client ───────────────────────────────────────────────────────
const SHOP_ENDPOINT = () =>
  `https://${SHOP_CONFIG.DOMAIN}/api/${SHOP_CONFIG.API_VERSION}/graphql.json`;

async function storefront(query, variables) {
  const res = await fetch(SHOP_ENDPOINT(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOP_CONFIG.TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Storefront API HTTP ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors && json.errors.length) {
    // Field-level errors (e.g. a variant field the token's scopes don't cover,
    // like quantityAvailable without `unauthenticated_read_product_inventory`)
    // come back *alongside* partial data — Shopify still returns everything it
    // is allowed to, nulling the denied field. Only treat this as fatal when
    // there's no usable data at all; otherwise degrade gracefully.
    if (json.data == null) {
      throw new Error(json.errors.map((e) => e.message).join('; '));
    }
    // eslint-disable-next-line no-console
    console.warn('[shop] Storefront API partial error(s): ' +
      json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

// Surface mutation userErrors (inventory clamps, etc.) as thrown errors.
function throwOnUserErrors(payload) {
  const errs = payload && payload.userErrors;
  if (errs && errs.length) throw new Error(errs.map((e) => e.message).join('; '));
  return payload;
}

// ── GraphQL documents ──────────────────────────────────────────────────────
// quantityAvailable / currentlyNotInStock require the Storefront token to have
// the `unauthenticated_read_product_inventory` access scope. Without it,
// quantityAvailable comes back null and we fall back to "in stock, count
// unknown" (still purchasable; just no "only N left" badge).
const VARIANT_FIELDS = `
  id
  title
  availableForSale
  quantityAvailable
  currentlyNotInStock
  price { amount currencyCode }
  product { title handle }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      attributes { key value }
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant { ${VARIANT_FIELDS} }
      }
    }
  }
`;

const Q_PRODUCT = `query ($handle: String!) {
  product(handle: $handle) {
    id title handle
    variants(first: 25) { nodes { ${VARIANT_FIELDS} } }
  }
}`;

const Q_VARIANT = `query ($id: ID!) {
  node(id: $id) { ... on ProductVariant { ${VARIANT_FIELDS} } }
}`;

const Q_CART = `query ($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;

const M_CART_CREATE = `mutation ($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) {
    cart { ${CART_FIELDS} }
    userErrors { field message }
  }
}`;

const M_LINES_ADD = `mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ${CART_FIELDS} }
    userErrors { field message }
  }
}`;

const M_LINES_UPDATE = `mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ${CART_FIELDS} }
    userErrors { field message }
  }
}`;

const M_LINES_REMOVE = `mutation ($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ${CART_FIELDS} }
    userErrors { field message }
  }
}`;

// ── Helpers ────────────────────────────────────────────────────────────────
const CART_ID_KEY = 'mw-gcs-cart-id';

function formatMoney(money) {
  if (!money) return '';
  const n = Number(money.amount);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: money.currencyCode,
    }).format(n);
  } catch (e) {
    return `${n.toFixed(2)} ${money.currencyCode}`;
  }
}

const cartLinesOf = (c) => (c && c.lines ? c.lines.nodes : []);

// ── Fulfillment split (backorder) ───────────────────────────────────────────
// Two cart lines for the SAME variant stay separate as long as their attributes
// differ (verified against the live store), so we stamp in-stock units and
// backordered units with a visible `Fulfillment` attribute. That both keeps the
// two lines distinct in the cart and carries the "ships now" / "ships in ~N"
// distinction through to the Shopify order the merchant fulfills.
const FULFILL_KEY = 'Fulfillment';
const FULFILL_NOW = 'In stock — ships now';
const fulfillLater = () => `Backorder — ships in ~${SHOP_CONFIG.LEAD_TIME}`;
const lineFulfillment = (line) => {
  const a = (line.attributes || []).find((x) => x.key === FULFILL_KEY);
  return a ? a.value : '';
};
const isLaterLine = (line) => /^Backorder/i.test(lineFulfillment(line));

// In-stock count from Shopify, or null when unknown (the inventory read scope
// isn't granted — quantityAvailable comes back null).
const inStockNow = (v) =>
  v && typeof v.quantityAvailable === 'number' ? Math.max(0, v.quantityAvailable) : null;

// Purchase/UI state for the variant. Both inventory limiting and backorder are
// ultimately controlled by the store's inventory settings, not this code:
//   • "Stop selling when out of stock"     → availableForSale flips false at 0;
//     with ALLOW_BACKORDER off we cap the stepper at the count / show sold-out.
//   • "Continue selling when out of stock" → stays buyable past 0; with
//     ALLOW_BACKORDER on, addToCart splits the order into ships-now + backorder.
function availability(v) {
  const backorder = !!SHOP_CONFIG.ALLOW_BACKORDER;
  if (!v) return { canBuy: false, maxPerAdd: 0, inStock: null, backorder, soldOut: false, unknown: true };
  const inStock = inStockNow(v);
  const soldOut = !v.availableForSale && !backorder;
  const maxPerAdd = backorder
    ? SHOP_CONFIG.MAX_QTY
    : (typeof inStock === 'number' && inStock > 0 ? Math.min(inStock, SHOP_CONFIG.MAX_QTY) : SHOP_CONFIG.MAX_QTY);
  return { canBuy: !soldOut, maxPerAdd, inStock, backorder, soldOut, unknown: false };
}

// Whether the now/later split can actually be computed for this variant.
const canSplit = (av) => av.backorder && typeof av.inStock === 'number';

// Short availability note for the buy box.
function buyboxNote(av) {
  if (!av || av.unknown) return { kind: 'pending', text: '' };
  if (av.soldOut) return { kind: 'sold-out', text: 'Sold out' };
  if (av.backorder) {
    if (typeof av.inStock === 'number' && av.inStock > 0)
      return { kind: 'in-stock', text: `${av.inStock} in stock · more ship in ~${SHOP_CONFIG.LEAD_TIME}` };
    return { kind: 'backorder', text: `Made to order · ships in ~${SHOP_CONFIG.LEAD_TIME}` };
  }
  if (typeof av.inStock === 'number' && av.inStock > 0)
    return { kind: 'in-stock', text: av.inStock <= 10 ? `Only ${av.inStock} left` : 'In stock' };
  return { kind: 'in-stock', text: 'In stock' };
}

// Per-cart-line note: which fulfillment bucket this line belongs to.
const lineNote = (line) =>
  isLaterLine(line)
    ? { kind: 'backorder', text: `Ships in ~${SHOP_CONFIG.LEAD_TIME}` }
    : { kind: 'in-stock', text: 'In stock · ships now' };

// ── Context ──────────────────────────────────────────────────────────────
const ShopContext = React.createContext(null);
const useShop = () => React.useContext(ShopContext);

const ShopProvider = ({ children }) => {
  const [cart, setCart] = React.useState(null);
  const [variant, setVariant] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);

  const readCartId = () => {
    try { return window.localStorage.getItem(CART_ID_KEY); } catch (e) { return null; }
  };
  const writeCartId = (id) => {
    try {
      if (id) window.localStorage.setItem(CART_ID_KEY, id);
      else window.localStorage.removeItem(CART_ID_KEY);
    } catch (e) { /* private mode / blocked storage — cart just won't persist */ }
  };

  // On mount: resolve the variant we sell + restore any saved cart.
  React.useEffect(() => {
    if (!SHOP_READY) return;
    let live = true;

    (async () => {
      try {
        let v = null;
        if (SHOP_CONFIG.VARIANT_ID) {
          const d = await storefront(Q_VARIANT, { id: SHOP_CONFIG.VARIANT_ID });
          v = d.node;
        } else {
          const d = await storefront(Q_PRODUCT, { handle: SHOP_CONFIG.PRODUCT_HANDLE });
          const nodes = d.product && d.product.variants ? d.product.variants.nodes : [];
          v = nodes.find((n) => n.availableForSale) || nodes[0] || null;
        }
        if (live) setVariant(v);
      } catch (e) {
        if (live) setError(e.message);
      }
    })();

    const savedId = readCartId();
    if (savedId) {
      (async () => {
        try {
          const d = await storefront(Q_CART, { id: savedId });
          if (!live) return;
          if (d.cart) setCart(d.cart);
          else writeCartId(null); // expired / completed — drop it
        } catch (e) { /* leave cart empty, will re-create on first add */ }
      })();
    }

    return () => { live = false; };
  }, []);

  // Run a cart mutation, sync state + persisted id from the server response,
  // and report failures without throwing into render.
  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      const next = await fn();
      if (next) { setCart(next); writeCartId(next.id); }
      return next;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const addToCart = async (quantity = 1) => {
    if (!SHOP_READY || !variant) { setDrawerOpen(true); return; }
    const merchandiseId = variant.id;
    const av = availability(variant);
    const id = cart && cart.id ? cart.id : readCartId();

    // Split the requested quantity against what's already in the cart: fill the
    // ships-now line up to the in-stock count, send the overflow to a separate
    // backorder line. Same-attribute lines merge server-side, so repeated adds
    // accumulate into just these two lines.
    const existNow = (cartLinesOf(cart).find((l) => !isLaterLine(l)) || {}).quantity || 0;
    const existLater = (cartLinesOf(cart).find((l) => isLaterLine(l)) || {}).quantity || 0;

    let lines;
    if (!canSplit(av)) {
      lines = [{ merchandiseId, quantity }]; // backorder off or stock unknown → one plain line
    } else {
      const addNow = Math.min(quantity, Math.max(0, av.inStock - existNow));
      const addLater = Math.min(quantity - addNow, Math.max(0, SHOP_CONFIG.BACKORDER_MAX - existLater));
      lines = [];
      if (addNow > 0) lines.push({ merchandiseId, quantity: addNow, attributes: [{ key: FULFILL_KEY, value: FULFILL_NOW }] });
      if (addLater > 0) lines.push({ merchandiseId, quantity: addLater, attributes: [{ key: FULFILL_KEY, value: fulfillLater() }] });
    }
    if (!lines.length) { setDrawerOpen(true); return; }

    await run(async () => {
      if (id) {
        const d = await storefront(M_LINES_ADD, { cartId: id, lines });
        return throwOnUserErrors(d.cartLinesAdd).cart;
      }
      const d = await storefront(M_CART_CREATE, { lines });
      return throwOnUserErrors(d.cartCreate).cart;
    });
    setDrawerOpen(true);
  };

  const setLineQty = async (lineId, quantity) => {
    if (!cart) return;
    if (quantity <= 0) return removeLine(lineId);
    await run(async () => {
      const d = await storefront(M_LINES_UPDATE, {
        cartId: cart.id, lines: [{ id: lineId, quantity }],
      });
      return throwOnUserErrors(d.cartLinesUpdate).cart;
    });
  };

  const removeLine = async (lineId) => {
    if (!cart) return;
    await run(async () => {
      const d = await storefront(M_LINES_REMOVE, {
        cartId: cart.id, lineIds: [lineId],
      });
      return throwOnUserErrors(d.cartLinesRemove).cart;
    });
  };

  const itemCount = cart && cart.totalQuantity ? cart.totalQuantity : 0;

  const value = {
    ready: SHOP_READY,
    cart, variant, busy, error, itemCount,
    drawerOpen,
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false),
    addToCart, setLineQty, removeLine,
    av: availability(variant),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// ── UI pieces ──────────────────────────────────────────────────────────────
const Spinner = () => <Icon name="loader" size={16} className="pp-shop-spin" />;

const QtyStepper = ({ value, min = 1, max = 99, onChange, disabled }) => (
  <div className={`pp-qty${disabled ? ' is-disabled' : ''}`}>
    <button
      type="button" className="pp-qty-btn" aria-label="Decrease quantity"
      disabled={disabled || value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
    >
      <Icon name="minus" size={15} />
    </button>
    <span className="pp-qty-val" aria-live="polite">{value}</span>
    <button
      type="button" className="pp-qty-btn" aria-label="Increase quantity"
      disabled={disabled || value >= max}
      onClick={() => onChange(Math.min(max, value + 1))}
    >
      <Icon name="plus" size={15} />
    </button>
  </div>
);

const StockNote = ({ note }) => {
  if (!note || !note.text) return null;
  return (
    <span className={`pp-stock pp-stock-${note.kind}`}>
      <Icon
        name={note.kind === 'sold-out' ? 'circle-x'
          : note.kind === 'backorder' ? 'hourglass' : 'circle-check'}
        size={14}
      />
      {note.text}
    </span>
  );
};

// Order-section purchase block: quantity picker + add-to-cart, gated by stock.
const AddToCart = ({ size = '' }) => {
  const shop = useShop();
  const [qty, setQty] = React.useState(1);
  const { variant, av, busy, ready } = shop;

  // Keep the picker within the per-add cap. Declared before the early return so
  // hook order stays stable across the ready / not-ready states.
  React.useEffect(() => {
    if (av.maxPerAdd && qty > av.maxPerAdd) setQty(av.maxPerAdd);
  }, [av.maxPerAdd]);

  if (!ready) {
    return (
      <div className="pp-buybox">
        <button
          type="button"
          className={`pp-btn pp-btn-primary${size ? ' ' + size : ''}`}
          onClick={shop.openCart}
        >
          <Icon name="shopping-cart" size={17} /> Buy Now
        </button>
        <span className="pp-stock pp-stock-pending">Checkout opens soon</span>
      </div>
    );
  }

  return (
    <div className="pp-buybox">
      <QtyStepper
        value={qty} min={1} max={av.maxPerAdd || 1}
        onChange={setQty} disabled={!av.canBuy || busy}
      />
      <button
        type="button"
        className={`pp-btn pp-btn-primary${size ? ' ' + size : ''}`}
        disabled={!av.canBuy || busy || !variant}
        onClick={async () => { await shop.addToCart(qty); setQty(1); }}
      >
        {busy ? <Spinner /> : <Icon name="shopping-cart" size={17} />}
        {av.soldOut ? 'Sold out' : 'Add to cart'}
      </button>
      <StockNote note={buyboxNote(av)} />
    </div>
  );
};

// Drop-in for the marketing CTAs. Adds one unit and opens the drawer.
// `innerRef` forwards the hero's IntersectionObserver ref.
const BuyButton = ({ className = '', children, innerRef }) => {
  const shop = useShop();
  const soldOut = shop.ready && shop.variant && shop.av.soldOut;
  return (
    <button
      ref={innerRef}
      type="button"
      className={className}
      disabled={shop.busy || soldOut}
      onClick={() => shop.addToCart(1)}
    >
      {shop.busy ? <Spinner /> : null}
      {soldOut ? 'Sold out' : children}
    </button>
  );
};

// Nav cart icon + item-count badge. `collapsed` mirrors the old CTA's
// hide-on-mobile-until-scrolled behavior, but we always show it once the
// cart has items so a mobile shopper can always get back to it.
const CartButton = ({ collapsed = false }) => {
  const shop = useShop();
  const hideOnMobile = collapsed && shop.itemCount === 0;
  return (
    <button
      type="button"
      className={`pp-cart-btn${hideOnMobile ? ' is-hidden-mobile' : ''}`}
      aria-label={`Open cart${shop.itemCount ? `, ${shop.itemCount} item${shop.itemCount > 1 ? 's' : ''}` : ''}`}
      onClick={shop.openCart}
    >
      <Icon name="shopping-cart" size={18} />
      {shop.itemCount > 0 && <span className="pp-cart-badge">{shop.itemCount}</span>}
    </button>
  );
};

const CartLine = ({ line }) => {
  const shop = useShop();
  const v = line.merchandise;
  const later = isLaterLine(line);

  // Both rows drive one logical total quantity with a fixed fill order: units fill
  // in-stock first (up to stock), and the overflow lands on the backorder row. So
  // the stepper edits the *total*, not the row it lives on:
  //   +  grows the total — addToCart fills in-stock, then spills to backorder.
  //   −  shrinks the total — remove from the backorder row first, in-stock last
  //      (so − on either row peels off a backordered unit until only stock remains).
  const lines = cartLinesOf(shop.cart);
  const nowLine = lines.find((l) => !isLaterLine(l));
  const laterLine = lines.find(isLaterLine);
  const nowQty = nowLine ? nowLine.quantity : 0;
  const laterQty = laterLine ? laterLine.quantity : 0;

  const knownStock = typeof shop.av.inStock === 'number';
  const stockCap = knownStock ? shop.av.inStock : SHOP_CONFIG.MAX_QTY;

  // Can the total still grow? Room in stock, or room on the backorder line.
  const canAdd = SHOP_CONFIG.ALLOW_BACKORDER
    ? (!knownStock || nowQty < stockCap || laterQty < SHOP_CONFIG.BACKORDER_MAX)
    : line.quantity < stockCap;
  // +1 of rolling headroom keeps + live; − stays live down to 0 (min={0} on the
  // stepper), which removes a unit. onChange's target only tells us the direction.
  const max = canAdd ? line.quantity + 1 : line.quantity;

  const bump = (q) => {
    if (q > line.quantity) shop.addToCart(1);                        // grow total
    else if (laterLine && laterQty > 0) shop.setLineQty(laterLine.id, laterQty - 1); // drop a backorder unit
    else if (nowLine && nowQty > 0) shop.setLineQty(nowLine.id, nowQty - 1);         // …then a stock unit
  };

  return (
    <li className={`pp-cart-line${later ? ' is-backorder' : ''}`}>
      <div className="pp-cart-line-main">
        <div className="pp-cart-line-title">
          {v.product ? v.product.title : v.title}
          {v.title && v.title !== 'Default Title' && (
            <span className="pp-cart-line-variant"> · {v.title}</span>
          )}
        </div>
        <StockNote note={lineNote(line)} />
      </div>
      <div className="pp-cart-line-side">
        <QtyStepper
          value={line.quantity} min={0} max={max}
          onChange={bump}
          disabled={shop.busy}
        />
        {SHOP_CONFIG.SHOW_PRICES && (
          <span className="pp-cart-line-price">{formatMoney(line.cost.totalAmount)}</span>
        )}
        <button
          type="button" className="pp-cart-remove" aria-label="Remove item"
          disabled={shop.busy} onClick={() => shop.removeLine(line.id)}
        >
          <Icon name="x" size={15} />
        </button>
      </div>
    </li>
  );
};

const CartDrawer = () => {
  const shop = useShop();
  const { cart, drawerOpen, busy, error, ready } = shop;

  // Close on Escape while open.
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') shop.closeCart(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  // Ships-now first, backorder second (Shopify returns lines in arbitrary order).
  const lines = cartLinesOf(cart).slice()
    .sort((a, b) => Number(isLaterLine(a)) - Number(isLaterLine(b)));
  const empty = lines.length === 0;
  const hasBackorder = lines.some(isLaterLine);

  return (
    <div className={`pp-cart-root${drawerOpen ? ' is-open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="pp-cart-scrim" onClick={shop.closeCart} />
      <aside className="pp-cart-panel" role="dialog" aria-modal="true" aria-label="Cart">
        <header className="pp-cart-head">
          <span className="pp-cart-head-title">
            <Icon name="shopping-cart" size={18} /> Your cart
          </span>
          <button type="button" className="pp-cart-close" aria-label="Close cart" onClick={shop.closeCart}>
            <Icon name="x" size={18} />
          </button>
        </header>

        {error && <div className="pp-cart-error">{error}</div>}

        {!ready ? (
          <div className="pp-cart-empty">
            <Icon name="lock" size={22} />
            <p>Checkout isn’t connected yet.</p>
            <p className="pp-cart-empty-sub">
              The store’s Storefront API token still needs to be added before
              orders can be taken.
            </p>
          </div>
        ) : empty ? (
          <div className="pp-cart-empty">
            <Icon name="shopping-cart" size={22} />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <ul className="pp-cart-lines">
            {lines.map((line) => <CartLine key={line.id} line={line} />)}
          </ul>
        )}

        {ready && !empty && hasBackorder && (
          <div className="pp-cart-note">
            <Icon name="hourglass" size={14} />
            Backordered units are made to order and ship in ~{SHOP_CONFIG.LEAD_TIME}.
            In-stock units ship right away.
          </div>
        )}

        {ready && !empty && (
          <footer className="pp-cart-foot">
            {SHOP_CONFIG.SHOW_PRICES && cart && (
              <div className="pp-cart-subtotal">
                <span>Subtotal</span>
                <span>{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
            )}
            <a
              className={`pp-btn pp-btn-primary pp-btn-xl pp-cart-checkout${busy ? ' is-busy' : ''}`}
              href={cart && cart.checkoutUrl ? cart.checkoutUrl : '#'}
              onClick={(e) => { if (busy || !cart || !cart.checkoutUrl) e.preventDefault(); }}
            >
              {busy ? <Spinner /> : null}
              Checkout <Icon name="arrow-right" size={17} />
            </a>
            <div className="pp-cart-secure">
              <Icon name="lock" size={13} /> Secure checkout on Shopify · taxes &amp; shipping at checkout
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
};

// Also expose on window as a convenience / for debugging in the console.
window.Shop = {
  config: SHOP_CONFIG, ready: SHOP_READY,
  ShopProvider, useShop, CartDrawer, AddToCart, BuyButton, CartButton,
};
