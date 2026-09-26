import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SplitHeading from '../Shared/SplitHeading';
import styles from './Hero.module.css';

const ease = [0.22, 1, 0.36, 1] as const;

// Intrinsic size of the generated variants' source, used to reserve layout
// space and avoid cumulative layout shift while the image loads.
const IMG_W = 3389;
const IMG_H = 1674;

/**
 * On tall/narrow viewports an `object-fit: cover` image is sized by the
 * viewport's HEIGHT, not its width, so a plain `100vw` would under-select.
 * Below a 3:2 aspect ratio we therefore ask for 150vh instead.
 */
const SIZES = '(max-aspect-ratio: 3/2) 150vh, 100vw';

const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} className={styles.hero}>
      <motion.div className={styles.media} style={{ y }}>
        <motion.div
          className={styles.mediaInner}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease }}
        >
          <picture>
            <source
              type="image/webp"
              sizes={SIZES}
              srcSet="/images/hero/landing-800.webp 800w, /images/hero/landing-1400.webp 1400w, /images/hero/landing-2000.webp 2000w"
            />
            <img
              className={styles.img}
              src="/images/hero/landing-1400.jpg"
              sizes={SIZES}
              width={IMG_W}
              height={IMG_H}
              alt="Painting by Kelvin McMillan of coloured beehive boxes in tussock grass below the golden Canterbury ranges"
              loading="eager"
              decoding="sync"
              // @ts-expect-error — valid HTML attribute, not yet in React 18's typings
              fetchpriority="high"
            />
          </picture>
        </motion.div>
      </motion.div>

      <motion.div className={`container ${styles.content}`} style={{ opacity: fade }}>
        <motion.p
          className={`eyebrow ${styles.eyebrow}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          Canterbury, New Zealand
        </motion.p>

        <SplitHeading
          className={styles.title}
          lines={['Capturing the light, land and character', <em key="em">of New Zealand</em>]}
        />

        <motion.p
          className={`lead ${styles.lead}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          Original paintings and giclée prints by Kelvin McMillan.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.65 }}
        >
          <Link to="/Originals" className="btn btn--light">
            View originals <FontAwesomeIcon icon={faArrowRight} aria-hidden />
          </Link>
          <Link to="/Prints" className="btn btn--ghost-light">
            Giclée prints
          </Link>
          <Link to="/Contact" className="btn btn--ghost-light">
            Get in touch
          </Link>
        </motion.div>
      </motion.div>

      <a href="#artist-statement" className={styles.scrollCue} aria-label="Scroll to the artist's statement">
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FontAwesomeIcon icon={faArrowDown} aria-hidden />
        </motion.span>
      </a>
    </section>
  );
};

export default Hero;
