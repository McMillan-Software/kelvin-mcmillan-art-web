import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './SplitHeading.module.css';

interface SplitHeadingProps {
  /** One entry per visual line; each gets its own mask and reveal delay. */
  lines: ReactNode[];
  as?: 'h1' | 'h2';
  className?: string;
  delay?: number;
  /** false = wait until scrolled into view instead of revealing on mount. */
  immediate?: boolean;
}

/**
 * Headline whose lines slide up from behind an overflow mask.
 * Ported from the Forman Builders site.
 */
const SplitHeading: React.FC<SplitHeadingProps> = ({
  lines,
  as = 'h1',
  className,
  delay = 0.15,
  immediate = true,
}) => {
  const Tag = as;
  const trigger = immediate
    ? ({ animate: 'show' } as const)
    : ({ whileInView: 'show', viewport: { once: true } } as const);

  return (
    <Tag className={`${styles.heading} ${className ?? ''}`}>
      {lines.map((line, i) => (
        <span key={i} className={styles.mask}>
          <motion.span
            className={styles.line}
            initial="hidden"
            {...trigger}
            variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default SplitHeading;
