// Generates the responsive image variants served by the Home page.
//
// Full-resolution sources live in assets-src/ and are never shipped — only the
// generated files under public/images/ are. Re-run with: pnpm run images
//
// sharp is a devDependency, so this never ends up in the bundle.

import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const WEBP_QUALITY = 66;
const JPEG_QUALITY = 76;

/**
 * Widths are chosen per image from how much of the viewport it actually
 * occupies — see the `sizes` attribute at each call site.
 */
const TARGETS = [
  {
    name: 'landing',
    src: 'assets-src/landing.jpg',
    outDir: 'public/images/hero',
    // Full-bleed 100svh hero. On portrait phones `cover` scales by height, so
    // the effective width needed is larger than the viewport width.
    widths: [800, 1400, 2000],
    fallbackWidth: 1400,
  },
  {
    name: 'quote',
    src: 'assets-src/quote.jpg',
    outDir: 'public/images/quote',
    // One column of the two-column artist-statement section: ~32vw of the
    // 60%-capped content column on desktop, full width on mobile.
    widths: [600, 900, 1400],
    fallbackWidth: 900,
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function build({ name, src, outDir, widths, fallbackWidth }) {
  const source = join(root, src);
  const dir = join(root, outDir);

  const { width, height } = await sharp(source).metadata();
  console.log(`\n${src} (${width}x${height}, ${kb((await stat(source)).size)}) -> ${outDir}/`);

  await mkdir(dir, { recursive: true });

  for (const w of widths) {
    await sharp(source)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(join(dir, `${name}-${w}.webp`));
  }

  //generate fallback jpg 
  await sharp(source)
    .resize({ width: fallbackWidth, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(join(dir, `${name}-${fallbackWidth}.jpg`));

  for (const file of (await readdir(dir)).sort()) {
    console.log(`  ${file.padEnd(22)} ${kb((await stat(join(dir, file))).size)}`);
  }
}

async function main() {
  for (const target of TARGETS) {
    await build(target);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
