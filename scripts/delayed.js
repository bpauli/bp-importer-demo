import {
  decorateBlock,
  loadBlock,
  sampleRUM,
  updateSectionsStatus,
} from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const hljs = (await import('highlight.js')).default;
async function highlight() {
  document
    .querySelectorAll('.code > pre > code > pre > code')
    .forEach((value) => {
      hljs.highlightElement(/** @type {HTMLElement} */ (value));
    });
}

async function related() {
  let main = document.querySelector('main');
  if (!main) return;
  for (const block of main.querySelectorAll('div.section > div > div')) {
    let name = block.classList[0];
    if (['code'].includes(name)) {
      decorateBlock(block);
    }
  }

  updateSectionsStatus(main);
  // const relatedposts = [...main.querySelectorAll('div.block.relatedposts')];
  const code = [...main.querySelectorAll('div.block.code')];
  let promises = code.map((value) => loadBlock(value));
  await Promise.all(promises);
  updateSectionsStatus(main);
}

await related();
await highlight();
