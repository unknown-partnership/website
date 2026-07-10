// site-nav.jsx: shared top bar for the documentation-style pages
// (docs.html + update.html). Same chrome as the home page nav, wired to the
// real Shopify cart in shop.jsx so the cart works on these pages too.
//
// Loaded (after icons.jsx + shop.jsx) as a <script type="text/babel">. Both the
// fixed navbar (.pp-nav) and the cart drawer (.pp-cart-root) are position:fixed,
// so a single React root mounted at #site-nav-root positions them correctly
// against the viewport regardless of where the mount point sits in the document.

// Logo leads to the site root, top of the page (home page at the top).
const SiteLogo = () => (
  <a className="pp-logo" href="/" style={{ textDecoration: 'none' }}>
    <span className="pp-logo-mark">
      <Icon name="radio-tower" size={18} stroke={2.2} />
    </span>
    <span className="pp-logo-text">MissionWeaver <em>GCS</em></span>
  </a>
);

// The two resource pages cross-link here; the current one is marked active.
const SITE_NAV_LINKS = [
  { href: 'docs.html', file: 'docs.html', label: 'User Guide' },
  { href: 'update.html', file: 'update.html', label: 'Firmware' },
];

const SiteNav = () => {
  const here = (window.location.pathname || '').split('/').pop() || 'index.html';
  return (
    <header className="pp-nav">
      <SiteLogo />
      <nav className="pp-nav-links">
        {SITE_NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}
             aria-current={here === l.file ? 'page' : undefined}>
            {l.label}
          </a>
        ))}
        {/* Always shown (not collapsed); there is no hero Buy Now to defer to. */}
        <CartButton collapsed={false} />
      </nav>
    </header>
  );
};

// One ShopProvider owns the nav's cart button and the drawer so they share
// state, same wiring as index.jsx's App.
const SiteShell = () => (
  <ShopProvider>
    <SiteNav />
    <CartDrawer />
  </ShopProvider>
);

ReactDOM.createRoot(document.getElementById('site-nav-root')).render(<SiteShell />);
