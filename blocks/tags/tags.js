import html from 'solid-js/html';
import { render } from 'solid-js/web';


async function formattedTags(inputString, lang) {
  const resp = await fetch(`/taxonomy.json?sheet=${lang}`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch data. Status: ${resp.status}`);
  }

  const json = await resp.json();
  const tagData = json.data.find((item) => item.tag === inputString);

  if (tagData) {
    return tagData.title;
  }
}

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const langUrlSegment = document.location.pathname.split('/').at(1);
  const lang = langUrlSegment?.match(/^(en|de)$/i)?.[0] || 'en';
  const tag = await formattedTags(block.textContent?.split(',')[0].trim(), lang);
  const blogUrl = `/${location.pathname.split('/').slice(1, 3).join('/')}?categories=${tag}`;
  const Tags = () => html`
    <a href='${blogUrl}' aria-label="tag">${tag}</a>
  `;
  block.innerHTML = '';
  render(Tags, block);
}
