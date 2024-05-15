import html from 'solid-js/html';
import { render } from 'solid-js/web';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const tag = block.textContent?.split(',')[0].trim();
  const blogUrl = `/${location.pathname.split('/').slice(1, 3).join('/')}?categories=${tag}`;
  const Tags = () => html`
    <a href='${blogUrl}' aria-label="tag">${tag}</a>
  `;
  block.innerHTML = '';
  render(Tags, block);
}
