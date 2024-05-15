import {
  buildBlock,
  decorateBlocks,
  decorateButtons,
  decorateDescriptionOfImage,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  getMetadata,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  sampleRUM,
  waitForLCP
} from './aem.js';

const LCP_BLOCKS = ['author']; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function buildBlogListHero(main) {
  const h1 = main.querySelector('h1');
  const paragraph = main.querySelector('p');
  if(h1 && paragraph && h1.nextElementSibling === paragraph){
    const section = document.createElement('div');
    section.append(buildBlock('intro', { elems: [h1, paragraph] }));
    main.prepend(section);
  }
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildTitle(main) {
  const h1 = main.querySelector('h1');
  const authorBlock = main.querySelector('.author');
  if (h1 && authorBlock) {
    h1.after(authorBlock);
  }
}

/**
 * @param {Element} main
 */
async function buildTagBlock(main) {
  const template = getMetadata('template');
  if (!template || template !== 'blog') {
    return;
  }

  /** @type {HTMLMetaElement | null} */
  const metaTag = document.querySelector('meta[name=category]');

  if (metaTag) {
    const section = document.createElement('div');
    section.append(buildBlock('tags', { elems: [metaTag?.content] }));
    main.prepend(section);
  }
}

/**
 * @param {Element} main
 */
async function buildAuthorBlock(main) {

  const template = getMetadata('template');
  if (!template || template !== 'article-template') {
    return;
  }
  /** @type {HTMLMetaElement | null} */
  const metaAuthor = document.querySelector('meta[name=author]');
  if (metaAuthor) {
    const section = document.createElement('div');
    section.append(buildBlock('author', { elems: [metaAuthor?.content] }));

    main.prepend(section);

  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // buildAuthorBlock(main);
    // buildTitle(main);
    // buildTagBlock(main);
    // buildHeroBlock(main);
    buildBlogListHero(main);
  } catch (error) {
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */

export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateDescriptionOfImage(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');

  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
	await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) {
    element.scrollIntoView();
  }

  loadHeader(doc.querySelector('header'));
  setTimeout(() => new Promise((res) => res(loadFooter(doc.querySelector('footer')))), 1500);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
