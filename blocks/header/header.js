import { createEffect, createMemo, createSignal, onMount } from '../../vendor/solid-js/dist/solid.js';
import html from '../../vendor/solid-js/html/dist/html.js';
import { render } from '../../vendor/solid-js/web/dist/web.js';
import { clamp } from '../../lib/utils.js';
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';


/**
 * @param {DocumentFragment} documentFragment
 * @param {string | undefined} langUrlSegment
 */
function Header(documentFragment, langUrlSegment) {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [isLarge, setIsLarge] = createSignal(false);
  const [nav, langNav] = documentFragment.querySelectorAll('ul');
  const contactButton = [...documentFragment.querySelectorAll('a')].at(-1);
  const computedUrlSegment = langUrlSegment ? `/${langUrlSegment}.html` : '/';
  const iconPrefix = window.hlx.codeBasePath;
  const showMenu = createMemo(() => menuOpen() && !isLarge());

  createEffect(() => {
    if (showMenu()) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  });

  onMount(() => {
    const header = document.querySelector('header');
    if (!header) {
      console.error('header not found');
      return;
    }

    let scroll = 0;
    let lastScroll = 0;

    /**
     * @param {number} scrollPos
     * @param {HTMLElement} element
     */
    function translateElement(scrollPos, element) {
      if (scrollPos < 0) { // happens on rubber banding on iPhone
        return;
      }

      const height = element.getBoundingClientRect().height; // this might cause perf issues and could be statically defined based on breakpoints.
      scroll = clamp(scroll + (scrollPos - lastScroll), 0, height);
      element.style.setProperty('transform', `translateY(-${scroll}px)`);
      scrollPos > 0
        ? element.classList.add('scrolled')
        : element.classList.remove('scrolled');
      lastScroll = scrollPos;
    }

    document.addEventListener('scroll', () => {
      translateElement(window.scrollY, header);
    });
  });

  createEffect(() => {
    const mql = window.matchMedia('(min-width: 1025px)');
    /** @param {MediaQueryListEvent} evt */
    const handler = (evt) => {
      if (evt.matches) {
        setIsLarge(true);
      } else {
        setIsLarge(false);
      }
    };
    mql.addEventListener('change', handler);

    if (mql.matches) {
      setIsLarge(true);
    } else {
      setIsLarge(false);
    }
    return () => {
      mql.removeEventListener('change', handler);
    };
  });

  function toggle() {
    setMenuOpen((open) => {
      return !open;
    });
  }

  return html`
    <div class="container mx-auto flex max-w-screen-2xl items-center">
      <a href="${computedUrlSegment}">
        <img
          src="${iconPrefix}/icons/logo.svg"
          alt="logo"
          class="aspect-[307/96] w-[117px] md:w-[148px]"
        />
      </a>
      <div
        class="grid place-items-center transition-all lg:mx-[30px] lg:ml-[3.75rem] lg:flex lg:flex-1 lg:items-center lg:justify-between lg:opacity-100"
        classList=${() => ({
          'menuOpen': showMenu(),
          'menu fixed inset-0 z-10 bg-white h-screen w-screen mx-0':
            !isLarge(),
        })}
      >
        <nav
          class="flex flex-col items-center justify-center text-2xl font-medium leading-5 transition-all duration-500 ease-[ease] *:my-[30px] lg:flex-row lg:text-base lg:*:mx-[20px] lg:*:my-0"
        >
          ${[...nav.querySelectorAll('a')].map((item) => {
            const { href, textContent } = item;
            return html`
              <a
                href=${href}
                class="transition duration-300 ease-[ease] lg:hover:-translate-y-[0.125rem]"
              >
                ${textContent}
              </a>
            `;
          })}
        </nav>
        <div class="hidden lg:block">
          <${LangNav} nav="${langNav}" urlSegment="${langUrlSegment}" />
        </div>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <a
          class="flex items-center from-[#eff1f4] from-50% to-comwrap-pink to-50% bg-[length:calc(200%+2px)_100%] bg-[100%_100%] transition-all duration-300 ease-[ease] hover:bg-[0%_100%] hover:text-comwrap-black lg:rounded-[3px] lg:bg-gradient-to-r lg:px-[1.25rem] lg:py-[0.405rem] lg:text-white"
          href=${contactButton?.href || ''}
          aria-label="contact"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="ml-[-0.4rem] mr-[0.4rem] w-8 lg:w-[22px]"
            classList=${() => ({
              hidden: showMenu(),
            })}
          >
            <path
              d="M2.617 21.924A1 1 0 012 21V11a2 2 0 012-2h2a1 1 0 011 1 1 1 0 01-1 1H4v7.586l1.293-1.292A1 1 0 016 17h7v-2a1 1 0 011-1 1 1 0 011 1v2a2 2 0 01-2 2H6.414l-2.707 2.707A1 1 0 013 22a.984.984 0 01-.383-.076zm17.676-7.217L17.586 12H11a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v10a1 1 0 01-.617.924A.984.984 0 0121 15a1 1 0 01-.707-.293zM11 10h7a1 1 0 01.707.293L20 11.585V4h-9z"
              fill="currentColor"
              stroke="transparent"
              stroke-miterlimit="10"
            />
          </svg>
          <span
            class="hidden text-sm font-medium leading-[30px] tracking-normal lg:inline-block"
          >
            ${contactButton?.textContent}
          </span>
        </a>

        <div
          class="z-20 mx-1 mt-1"
          classList=${() => ({
            hidden: !menuOpen() || isLarge(),
          })}
        >
          <${LangNav} nav="${langNav}" urlSegment="${langUrlSegment}" />
        </div>
        <button
          class="menuButton relative z-20 h-[21px] w-6 lg:hidden"
          classList=${() => ({ active: menuOpen() })}
          onClick=${() => {
            toggle();
          }}
          aria-label="burger"
        >
          <div class="burger">
            <div class="top"></div>
            <div class="bun"></div>
            <div class="bottom"></div>
          </div>
        </button>
      </div>
    </div>
  `;
}

/**
 * @param {object} obj
 * @param {HTMLUListElement} obj.nav
 * @param {string} obj.urlSegment
 */
function LangNav({ nav, urlSegment }) {
  const items = [...nav.querySelectorAll('a')]
    .filter((item) => item.textContent?.toLowerCase() !== urlSegment)
    .map((el) => el.cloneNode(true));
  return html`
    <nav class="flex text-base font-medium leading-5">${items}</nav>
  `;
}

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const headerHTML = await loadFragment(navPath);
  const documentFragment = document
    .createRange()
    .createContextualFragment(headerHTML.innerHTML);
  block.innerHTML = '';

  render(() => Header(documentFragment, 'en'), block);
}
