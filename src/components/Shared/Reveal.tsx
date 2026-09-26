import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Needed where the element is also an anchor target. */
  id?: string;
  delay?: number;
  /** Distance travelled on entry, in px. */
  y?: number;
  as?: 'div' | 'section';
}

/**
 * Fades and lifts content into place the first time it scrolls into view.
 * Ported from the Forman Builders site.
 *
 * `prefers-reduced-motion` is handled globally by <MotionConfig reducedMotion="user">
 * in App.tsx — no per-component handling needed.
 */
const Reveal: React.FC<RevealProps> = ({ children, className, id, delay = 0, y = 28, as = 'div' }) => {
  // Indexing `motion[as]` the way the original does does not narrow cleanly
  // under this project's TypeScript version, so branch explicitly.
  const Tag = as === 'section' ? motion.section : motion.div;

  return (
    <Tag
      className={className}
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
