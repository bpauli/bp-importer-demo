import html from 'solid-js/html';
import { render } from 'solid-js/web';

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
