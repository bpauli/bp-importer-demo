import html from '../../vendor/solid-js/html/dist/html.js';
import { render } from '../../vendor/solid-js/web/dist/web.js';

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const code = block.innerHTML
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/ \\/g, '')
    .replace(/^\s*$/gm, '')
    .trim();
  const codeWrapper = document.createElement('code');
  codeWrapper.innerHTML = code;

  block.innerHTML = '';
  render(
    () => html`
        <pre>${codeWrapper}</pre>
      `,
    block,
  );
}
