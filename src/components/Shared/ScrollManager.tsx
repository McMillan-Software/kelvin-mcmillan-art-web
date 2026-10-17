import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'scroll-positions';
// Give async page content (paintings load after mount) this long to grow tall
// enough to restore into before settling for the furthest reachable point.
const RESTORE_TIMEOUT_MS = 1500;

const readPositions = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const savePosition = (key: string, y: number) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readPositions(), [key]: y }));
  } catch {
    // storage unavailable (private mode etc.) - scroll restoration is best effort
  }
};

// index.css sets `scroll-behavior: smooth` on html, which would otherwise animate these jumps
const jumpTo = (y: number) => window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });

/**
 * BrowserRouter has no scroll handling, so the window kept the previous page's
 * offset across navigations. Remembers the offset per history entry instead:
 * new navigations start at the top, back/forward and reload return to where
 * that entry was left.
 */
const ScrollManager: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const lastY = useRef(0);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const track = () => { lastY.current = window.scrollY; };
    const saveOnLeave = () => savePosition(location.key, window.scrollY);
    window.addEventListener('scroll', track, { passive: true });
    window.addEventListener('pagehide', saveOnLeave);
    return () => {
      window.removeEventListener('scroll', track);
      window.removeEventListener('pagehide', saveOnLeave);
    };
  }, [location.key]);

  // Layout effect so the outgoing page's offset is saved before the browser
  // clamps it to the (possibly shorter) incoming page.
  useLayoutEffect(() => {
    const leavingKey = location.key;

    if (navigationType !== 'POP') {
      // Hash links (e.g. /Prints#collection-3) scroll themselves once loaded
      if (!location.hash) jumpTo(0);
      lastY.current = window.scrollY;
    } else {
      const target = readPositions()[location.key] ?? 0;
      const started = performance.now();
      let frame = 0;
      const stop = () => cancelAnimationFrame(frame);

      const attempt = () => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        jumpTo(Math.min(target, maxY));
        lastY.current = window.scrollY;
        if (maxY < target && performance.now() - started < RESTORE_TIMEOUT_MS) {
          frame = requestAnimationFrame(attempt);
        }
      };
      attempt();

      // Don't fight the visitor if they start scrolling while content loads
      const userEvents = ['wheel', 'touchstart', 'keydown'] as const;
      userEvents.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }));

      return () => {
        stop();
        userEvents.forEach((e) => window.removeEventListener(e, stop));
        savePosition(leavingKey, lastY.current);
      };
    }

    return () => savePosition(leavingKey, lastY.current);
  }, [location.key]);

  return null;
};

export default ScrollManager;
