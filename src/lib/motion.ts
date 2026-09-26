import type { ReactNode } from 'react';
import { AnimatePresence as FramerAnimatePresence } from 'framer-motion';

/**
 * framer-motion v11 types `AnimatePresence` as returning `Element | undefined`.
 * TypeScript only tolerates that from a JSX component from 5.1 onwards, via
 * `JSX.ElementType` — this project is on 4.9, so it errors with TS2786.
 *
 * The runtime behaviour is correct either way; this re-export just narrows the
 * type to what TS 4.9 accepts. Delete it and import from 'framer-motion'
 * directly once the project moves to TypeScript 5.1+.
 */
export const AnimatePresence = FramerAnimatePresence as React.FC<{
  children?: ReactNode;
  initial?: boolean;
  mode?: 'sync' | 'wait' | 'popLayout';
  onExitComplete?: () => void;
}>;
