import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import SplitHeading from './SplitHeading';
import styles from './PageHeader.module.css';

const ease = [0.22, 1, 0.36, 1] as const;

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional controls (e.g. filters) shown beneath the intro. */
  children?: ReactNode;
}

/**
 * Shared heading block for the gallery pages (Originals, Prints, Portfolio),
 * so each opens with the same type scale, spacing and reveal animation.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, intro, children }) => (
  <header className={styles.header}>
    <motion.p
      className={`eyebrow ${styles.eyebrow}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
    >
      {eyebrow}
    </motion.p>

    <SplitHeading className={styles.title} lines={[title]} delay={0.1} />

    {intro && (
      <motion.p
        className={`lead ${styles.intro}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.35 }}
      >
        {intro}
      </motion.p>
    )}

    {children && <div className={styles.controls}>{children}</div>}
  </header>
);

export default PageHeader;
