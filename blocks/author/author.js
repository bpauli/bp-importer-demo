import { For, Show, createMemo, createResource } from 'solid-js';
import html from '../../vendor/solid-js/html/dist/html.js';
import { render } from '../../vendor/solid-js/html/dist/web.js';
import { getAuthorByNameSync, getAuthors } from '../../lib/blog-helper.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

/** @param {HTMLElement} block */
export default async function decorate(block) {
  /** @type {Array<string>} */
  const authorNames = [];
  if (!block.children.length) {
    return console.error('No children found in author block');
  }
  for (const child of block.children) {
    authorNames.push(child.textContent?.trim() ?? '');
  }

  block.innerHTML = '';
  render(() => Author(authorNames), block);
}
/** @param {Array<string>} authorNames */
function Author(authorNames) {
  const [rawAuthors] = createResource(getAuthors);
  const authors = createMemo(() => {
    if (!rawAuthors()) {
      return [];
    }
    const authors = rawAuthors() ?? [];
    const filteredAuthors = [];
    for (const authorName of authorNames) {
      const author = getAuthorByNameSync(authorName, authors);
      if (author) {
        filteredAuthors.push(author);
      }
    }
    return filteredAuthors;
  });

  return html`
    <${Show} when=${() => authors().length === 0}>
      ${authorNames.map(() => html`<div class="flex min-h-[182px] flex-1 pb-8 pt-8 md:min-h-[130px]"></div>`)}
    <//>
    <${For}
      each=${authors}
    >
      ${(
        /** @type {import('../../lib/blog-helper.d.ts').Author} */ author,
        /** @type {() => number} */ index,
      ) => {
        return html`
          <div
            class="flex min-h-[182px] flex-1 pb-8 pt-8 md:min-h-[130px]"
            classList=${() => ({
              'justify-center': authors().length === 1,
              'justify-end': authors().length > 1 && index() % 2 === 0,
              'justify-start': authors().length > 1 && index() % 2 === 1,
            })}
          >
            <div
              class="flex w-[24ch] min-w-[24ch] flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div class="flex-shrink-0 text-[10px]">
                ${createOptimizedPicture(
                  author.image,
                  author.title,
                  true,

                  [{ height: '150', width: '150' }],
                  '',
                  'w-11 rounded-full',
                )}
              </div>
              <div>
                <p
                  class="m-0 text-balance text-center text-[9pt] text-base font-black leading-[var(--heading-line-height-xxs)] md:text-left"
                >
                  ${author.title}
                </p>
                <p
                  class="m-0 text-balance text-center text-base text-zinc-600 md:text-left"
                >
                  ${author.role}
                </p>
              </div>
            </div>
          </div>
        `;
      }}
    <//>
  `;
}
