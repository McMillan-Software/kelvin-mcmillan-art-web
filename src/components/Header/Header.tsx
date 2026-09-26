import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { AnimatePresence } from '../../lib/motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { site } from '../../config/site';
import styles from './Header.module.css';

const navItems = [
  { to: '/Originals', label: 'Originals' },
  { to: '/Prints', label: 'Prints' },
  { to: '/Portfolio', label: 'Portfolio' },
  { to: '/About', label: 'About' },
  { to: '/Contact', label: 'Contact' },
];

/** Routes that open with a full-bleed hero the header can sit transparently over. */
const heroRoutes = ['/'];

const ease = [0.22, 1, 0.36, 1] as const;

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  // Seed from the current offset: browsers restore scroll position on reload
  // and back-navigation, and no scroll event fires for that initial state.
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 60);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Only the home page has a hero behind the header. Everywhere else the header
  // must be solid from the first paint, or it would be white text on white page.
  const overHero = heroRoutes.includes(pathname);
  const solid = scrolled || !overHero;

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 60);
    setHidden(y > 400 && y > prev && !open);
  });

  // The browser restores scroll position AFTER React mounts, and that restore
  // fires no event we'd otherwise catch — so re-sync once the page has settled.
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 60);
    sync();
    window.addEventListener('load', sync);
    return () => window.removeEventListener('load', sync);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock page scroll, move focus into the drawer, and allow Escape while open.
  useEffect(() => {
    if (!open) return;
    // The lock must go on <html>, not <body>. index.css sets `overflow-x:
    // hidden` on <html>, which stops <body>'s overflow propagating to the
    // viewport — so a body-level lock silently does nothing and the page
    // scrolls behind the open drawer.
    const root = document.documentElement;
    const previousOverflowY = root.style.overflowY;
    root.style.overflowY = 'hidden';
    drawerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflowY = previousOverflowY;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={`${styles.header} ${solid && !open ? styles.solid : ''} ${open ? styles.menuOpen : ''}`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.brand} aria-label={`${site.name} — home`}>
            <span className={styles.word}>Kelvin McMillan</span>
            <span className={styles.sub}>Artist · {site.location}</span>
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/Contact" className={`btn ${solid ? '' : 'btn--light'} ${styles.cta}`}>
              Get in touch
            </Link>
          </nav>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </motion.header>
            
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={drawerRef}
            tabIndex={-1}
            className={styles.drawer}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <nav className={styles.drawerNav} aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...navItems].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.06 }}
                >
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.active : ''}`}
                  >
                    <span className={styles.drawerIndex}>0{i + 1}</span>
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className={styles.drawerFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <a href={`tel:${site.phoneHref}`}>
                <FontAwesomeIcon icon={faPhone} aria-hidden /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`}>
                <FontAwesomeIcon icon={faEnvelope} aria-hidden /> {site.email}
              </a>
              <div className={styles.drawerSocial}>
                <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
                <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
