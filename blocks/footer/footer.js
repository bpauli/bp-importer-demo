import html from '../../vendor/solid-js/html/dist/html.js';
import { render } from '../../vendor/solid-js/web/dist/web.js';
import Heart from './_components/heart.js';

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const langUrlSegment = document.location.pathname.split('/').at(1);
  const lang = langUrlSegment?.match(/^(en|de)$/i)?.[0] || 'en';
  const footerXF = await fetch(
    `/fragments/${lang}/site/footer/master.plain.html`,
  );
  const footerHTML = await footerXF.text();
  const documentFragment = document
    .createRange()
    .createContextualFragment(footerHTML);
  block.innerHTML = '';

  /** @param {Document} document */
  function preloadLinks(document) {
    const links = document.querySelectorAll('a');
    // add prefetch to anchorlinks on hover
    links.forEach((link) => {
      link.addEventListener('mouseover', () => {
        const linkEl = document.createElement('link');
        Object.assign(linkEl, {
          rel: 'prefetch',
          href: link.href,
          as: 'document',
        });
        document.head.appendChild(linkEl);
      });
    });
  }
  preloadLinks(document);
  render(() => Footer(documentFragment, langUrlSegment), block);
}

/**
 * @param {DocumentFragment} block
 * @param {string | undefined} langUrlSegment
 */
function Footer(block, langUrlSegment) {
  const computedUrlSegment = langUrlSegment ? `/${langUrlSegment}.html` : '/';
  const internalLink = block.querySelectorAll('a[href^="/"]');
  internalLink.forEach((link) => {
    link.setAttribute('href', `${link.getAttribute('href')}`);
  });
  return html`
    <div class="mt-10 border-t-2 border-black/10">
      <div
        class="mx-auto mt-20 flex w-[calc(min(100vw-4rem,1440px))] max-w-screen-2xl flex-col items-center gap-20 pb-10 md:flex-row md:justify-between"
      >
        <div class="flex flex-col items-center justify-center md:items-start">
          <a href="${computedUrlSegment}">
            <img
              src="/icons/logo.svg"
              alt="logo"
              class="aspect-[307/96] w-[117px] md:w-[148px]"
            />
          </a>
          <span class="mt-10 inline-block text-sm text-comwrap-gray/80">
            © Comwrap Reply GmbH
          </span>
        </div>
        <div
          class="flex flex-col-reverse items-center gap-20 md:flex-col md:gap-10"
        >
          <div class="flex justify-center gap-8 md:justify-end">
            <a href="https://www.twitter.com/comwrap" target="_blank" aria-label="twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                class="scale-150"
              >
                <rect width="24" height="24" rx="4" fill="none" />
                <path
                  d="M9.032 18.8a9.2 9.2 0 009.34-9.2c0-.141 0-.279-.01-.418A6.612 6.612 0 0020 7.513a6.6 6.6 0 01-1.885.509 3.254 3.254 0 001.443-1.788 6.633 6.633 0 01-2.085.785 3.323 3.323 0 00-4.645-.14 3.2 3.2 0 00-.95 3.088A9.375 9.375 0 015.112 6.59 3.2 3.2 0 006.13 10.9a3.3 3.3 0 01-1.49-.4v.041a3.247 3.247 0 002.634 3.168 3.3 3.3 0 01-1.482.057 3.279 3.279 0 003.066 2.244 6.644 6.644 0 01-4.077 1.386 6.758 6.758 0 01-.782-.047A9.4 9.4 0 009.031 18.8"
                  fill="#212a35"
                  fill-rule="evenodd"
                />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/comwrap/" target="_blank" aria-label="linkedin">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                class="scale-150"
              >
                <rect width="24" height="24" rx="4" fill="none" />
                <path
                  d="M7.859 20.249H4.212V9.285h3.647zM6.037 7.788h-.025A1.9 1.9 0 116.06 4a1.9 1.9 0 11-.024 3.788zM21 20.249h-3.644v-5.865c0-1.474-.528-2.479-1.846-2.479a2 2 0 00-1.87 1.333 2.5 2.5 0 00-.12.889v6.122H9.876s.048-9.935 0-10.964h3.644v1.552a3.618 3.618 0 013.284-1.81c2.4 0 4.2 1.567 4.2 4.935zm0 0"
                  fill="#212a35"
                />
              </svg>
            </a>
            <a
              href="https://www.xing.com/companies/comwrapgmbh"
              target="_blank" aria-label="xing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                class="scale-150"
              >
                <rect width="24" height="24" rx="4" fill="none" />
                <path
                  d="M6.988 15.611h-2.6a.381.381 0 01-.339-.177.4.4 0 010-.4l2.761-4.868a.013.013 0 000-.015L5.055 7.115a.4.4 0 01-.015-.4.4.4 0 01.354-.162h2.6a.8.8 0 01.723.487l1.785 3.112-2.8 4.956a.794.794 0 01-.714.503zM19.264 3.566l-5.748 10.163a.013.013 0 000 .017l3.659 6.687a.408.408 0 01.006.4.385.385 0 01-.345.166h-2.593a.811.811 0 01-.725-.494L9.83 13.738l5.776-10.244a.761.761 0 01.7-.494h2.623a.385.385 0 01.345.166.406.406 0 01-.01.4z"
                  fill="#212a35"
                />
              </svg>
            </a>
          </div>
          <div
            class="flex flex-col items-center justify-center gap-12 text-sm font-medium text-comwrap-black md:order-2 md:flex-row md:justify-end"
          >
            ${[...internalLink].map((link) => {
              return html`
                <a
                  class="transition duration-300 ease-[ease] lg:hover:-translate-y-[0.125rem]"
                  href="${link.getAttribute('href') || ''}"
                >
                  ${link.textContent}
                </a>
              `;
            })}
          </div>
        </div>
      </div>
      <div>
        <${Heart} />
      </div>
    </div>
  `;
}
