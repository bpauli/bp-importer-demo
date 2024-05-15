import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  div,
} from '../../scripts/dom-helpers.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const divWrapper = div({ class: 'quote-content relative flex flex-col justify-around pb-8' });
  [...block.children].forEach((row) => {
    if (block.children[1]) {
      block.children[1].className = 'quote-author text-2xl font-bold text-comwrap-black';
    }

    const divInner = div({ class: 'flex flex-row items-center justify-start' });

    while (row.firstElementChild) {
      divInner.append(row.firstElementChild);
    }

    [...divInner.children].forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = 'flex';
      } else {
        div.className = 'flex flex-col items-start justify-center';
      }
    });

    divWrapper.append(divInner);
  });
  divWrapper
    .querySelectorAll('img')
    .forEach((img) =>
      img
        ?.closest('picture')
        ?.replaceWith(
          createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }], '', 'w-11 rounded-full mr-2.5'),
        ),
    );

  block.textContent = '';
  block.append(divWrapper);
}
