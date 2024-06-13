import html from 'solid-js/html';
import { render } from 'solid-js/web';

function formattedTags(inputString) {
  return inputString
    .replace(/comwrap:products\//g, '')
    .map((part) => part.replace('-', ' ').toUpperCase());
}

/** @param {HTMLElement} block */
export default function decorate(block) {
  const tag = formattedTags(block.textContent?.split(',')[0].trim());
  const blogUrl = `/${location.pathname.split('/').slice(1, 3).join('/')}?categories=${tag}`;
  const Tags = () => html`
    <a href='${blogUrl}' aria-label="tag">${tag}</a>
  `;
  block.innerHTML = '';
  render(Tags, block);
}
