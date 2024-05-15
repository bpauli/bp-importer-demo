import { html, loadComponentCSS, render } from '../../../lib/utils.js';
import { createOptimizedPicture } from '../../../scripts/aem.js';

/** @type {import('./cards.d.ts').Cards} */
export function Cards(articleProps) {
  loadComponentCSS(import.meta.url);
  const cards = (/** @type {import('./cards.d.ts').Article} */ props) => html`
    <a class="card" href=${props.path}>
      <picture class="card__image">
        ${createOptimizedPicture(
          props.image,
          props.title,
          false,
          [{ width: '750' }],
        ).innerHTML}
      </picture>
      <div class="card__content">
        <div class="card__category">
          <p>${props.category}</p>
        </div>
        <div class="card__body">
          <div class="card__title">
            <strong>${props.title}</strong>
          </div>
          <p class="card__description">${props.description}</p>
          <p class="card__date">${props.date.toLocaleDateString()}</p>
        </div>
      </div>
    </a>
  `;

  return render(cards(articleProps));
}
