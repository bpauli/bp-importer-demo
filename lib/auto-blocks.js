import { buildBlock, getMetadata } from '../scripts/aem.js';

/**
 * Builds tag block and prepends to main.
 * @param {Element} main The container element
 */
function buildTagBlock(main) {
  const template = getMetadata('template');
  if (!template || template !== 'blog') {
    return;
  }
  /** @type {HTMLMetaElement | null} */
  const metaTag = document.querySelector('meta[name=category]');
  if (
    metaTag
  ) {
    const div = main.querySelector('div');
    div?.prepend(buildBlock('tags', { elems: [metaTag?.content] }));
  }
}

/** @param {Element} main */
// eslint-disable-next-line unused-imports/no-unused-vars
function buildRelatedPostsBlock(main) {
  const template = getMetadata('template');
  if (!template || template !== 'blog') {
    return;
  }
  /** @type {HTMLMetaElement | null} */
  const metaTag = document.querySelector('meta[name=category]');
  if (
    metaTag
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('relatedposts', { elems: [metaTag?.content] }));
    main.append(section);
  }
}

/** @type {import('./auto-blocks.d.ts').buildCustomAutoBlocks} */
export function buildCustomAutoBlocks(main) {
  buildTagBlock(main);
  // buildRelatedPostsBlock(main);
}