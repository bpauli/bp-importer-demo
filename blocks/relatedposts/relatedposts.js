import {
  getArticlesByCategory,
  getAuthorByNameSync,
  getAuthors,
} from '../../lib/blog-helper.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  a,
  article,
  button,
  div,
  h2,
  h5,
  p,
} from '../../scripts/dom-helpers.js';

/** @type Promise<import('../../lib/blog-helper.js').Author[] | undefined> */
let authorPromise;
/**
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  const characteristics = {
    category: '',
    maxitems: 0,
    sortorder: '',
    title: '',
  };

  for (let i = 0; i <= block.children.length - 1; i++) {
    const element = block.children[i].children[0];
    const value = block.children[i].children[1].textContent || '';
    const key = element?.textContent?.toLowerCase().replace(/\s+/g, '') || '';
    if (key === 'maxitems') {
      characteristics.maxitems = Number.parseInt(value);
    }
    if (key === 'category') {
      characteristics.category = value.toLowerCase().trim();
    }
    if (key === 'sortorder') {
      // characteristics.sortorder = value.toLowerCase().trim();
      /**
       * TODO: align this with transformer
       * See TODO in tools/importer/transformers/relatedPosts.js
       */
      characteristics.sortorder = 'descending';
    }
    if (key === 'title') {
      characteristics.title = value.trim();
    }
  }

  const articlesByCategories = await getArticlesByCategory(
    characteristics.category,
    characteristics.maxitems,
    characteristics.sortorder,
  );
  authorPromise = authorPromise || getAuthors();

  const divContainer = div({ class: 'relatedposts-inner relative mt-10 mb-10 pb-10 overflow-x-clip' });
  divContainer.appendChild(h2({ class: 'relatedposts-card-title mb-4 font-black', id: characteristics.title.toLowerCase().replaceAll(' ', '-') }, characteristics.title));
  const relatedPostContainer = divContainer.appendChild(div({ 'class': 'relatedposts-inner-container flex relative w-full flex flex-row flex-none transform transition-transform ease-in-out duration-300 relative rounded-lg', 'data-carousel': 'slide' }));
  const isDesktop = window.innerWidth >= 768;

  if (articlesByCategories.length > 2 || (!isDesktop && articlesByCategories.length > 1)) {
    const prevBtn = divContainer.appendChild(button({ 'id': 'prevBtn', 'class': 'absolute bottom-0 cursor end-12 z-30 hidden md:flex items-center justify-center px-4 cursor-pointer group focus:outline-none', 'type': 'button', 'data-carousel-prev': '' }));
    const prevBtnTemplate = document.createElement('template');
    prevBtnTemplate.innerHTML = `<span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-comwrap-gray bg-white/30 transition-all hover:pr-2 hover:text-black group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-100/70">
      <svg class="h-3 w-4 text-comwrap-pink hover:text-black rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
      </svg>
      <span class="sr-only">Previous</span>
    </span>`;
    prevBtn.append(prevBtnTemplate.content.cloneNode(true));

    const nextBtn = divContainer.appendChild(button({ 'id': 'nextBtn', 'class': 'absolute bottom-0 cursor end-0 z-30 hidden md:flex items-center justify-center px-4 cursor-pointer group focus:outline-none', 'type': 'button', 'data-carousel-next': '' }));
    const nextBtnTemplate = document.createElement('template');
    nextBtnTemplate.innerHTML = `<span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-comwrap-gray bg-white/30 transition-all hover:pl-2 hover:text-black group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-100/70">
      <svg class="h-3 w-4 text-comwrap-pink hover:text-black rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
      </svg>
      <span class="sr-only">Next</span>
    </span>`;
    nextBtn.append(nextBtnTemplate.content.cloneNode(true));

    let currentIndex = 0;
    const indicatorWrapper = divContainer.appendChild(div({ class: 'absolute z-30 flex -translate-x-1/2 md:-bottom-5 bottom pt-3 left-1/2 space-x-3 rtl:space-x-reverse' }));
    showSlide(currentIndex);

    articlesByCategories.forEach(async (articleItem, _index) => {
      if (isDesktop) {
        if (_index % 2 === 0) {
          indicatorWrapper.append(button({ 'type': 'button', 'class': `${_index === 0 ? 'bg-comwrap-pink' : 'bg-comwrap-gray'} w-2 h-2 rounded-full`, 'aria-current': 'true', 'aria-label': `Slide ${_index}`, 'slide-to': _index }));
        }
      } else {
        indicatorWrapper.append(button({ 'type': 'button', 'class': `${_index === 0 ? 'bg-comwrap-pink' : 'bg-comwrap-gray'} w-2 h-2 rounded-full`, 'aria-current': 'true', 'aria-label': `Slide ${_index}`, 'slide-to': _index }));
      }

      const card = createArticleCard(articleItem);
      relatedPostContainer.appendChild(await card);
    });

    if (!isDesktop) {
      const carousel = document.querySelector('.relatedposts');
      let touchStartX = 0;
      let touchEndX = 0;

      if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
          if (e instanceof TouchEvent) {
            touchStartX = e.touches[0].clientX;
          }
        });
        carousel.addEventListener('touchmove', (e) => {
          if (e instanceof TouchEvent) {
            touchEndX = e.touches[0].clientX;
          }
        });
        carousel.addEventListener('touchend', () => handleSwipe());
      }

      function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
          nextSlide();
        } else if (touchEndX - touchStartX > threshold) {
          prevSlide();
        }
      }
    }

    /**
     * @param {number} index
     */
    function showSlide(index) {
      const transformValue = `translateX(-${index * 100}%)`;
      const element = document.querySelector('.relatedposts-inner-container');
      if (element instanceof HTMLElement) {
        element.style.transform = transformValue;
      }
    }

    function nextSlide() {
      if (isDesktop) {
        currentIndex = (currentIndex === Math.floor((articlesByCategories.length - 1) / 2)) ? 0 : currentIndex + 1;
      } else {
        currentIndex = currentIndex === articlesByCategories.length - 1 ? 0 : currentIndex + 1;
      }
      markIndicator(indicatorWrapper.children[currentIndex]);
      showSlide(currentIndex);
    }

    function prevSlide() {
      if (isDesktop && currentIndex === 0) {
        currentIndex = articlesByCategories.length % 2 === 0 ? Math.floor((articlesByCategories.length - 1) / 2) : (articlesByCategories.length - 1) / 2;
      } else if (!isDesktop && currentIndex === 0) {
        currentIndex = articlesByCategories.length - 1;
      } else {
        currentIndex = currentIndex - 1;
      }
      markIndicator(indicatorWrapper.children[currentIndex]);
      showSlide(currentIndex);
    }

    /**
     * @param {Element} indicatorElement
     */
    function markIndicator(indicatorElement) {
      Array.from(indicatorWrapper.children).forEach((element) => {
        element.classList.remove('bg-comwrap-pink');
        element.classList.add('bg-comwrap-gray');
      });
      indicatorElement.classList.remove('bg-comwrap-gray');
      indicatorElement.classList.add('bg-comwrap-pink');
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', prevSlide);
      nextBtn.addEventListener('click', nextSlide);
    }
    Array.from(indicatorWrapper.children).forEach((element) => {
      element.addEventListener('click', () => {
        markIndicator(element);
        const elementDataSet = element.getAttribute('slide-to');
        if (elementDataSet != null) {
          const currentIndex = Number.parseInt(elementDataSet);
          if (isDesktop) {
            showSlide(Math.floor(currentIndex / 2));
          } else {
            showSlide(currentIndex);
          }
        }
      });
    });
  } else {
    articlesByCategories.forEach(async (articleItem) => {
      if (articleItem.path === window.location.pathname) {
        return;
      }
      const card = createArticleCard(articleItem);
      relatedPostContainer.appendChild(await card);
    });
  }

  block.replaceChildren(divContainer);

  // Utility function to create an article card
  /**
   * @param {import("../../lib/blog-helper.js").Article} articleItem
   */
  async function createArticleCard(articleItem) {
    const firstAuthor = articleItem.author.split(',')[0].trim();
    const author = await getAuthorByNameSync(firstAuthor, await authorPromise);

    const recentArticleWrapper = article({ class: 'relatedposts-card-wrapper flex shrink-0 md:w-1/2 w-full' });
    const recentarticlediv = recentArticleWrapper.appendChild(a({ class: 'relatedposts-card text-decoration-none flex md:flex-row flex-col flex-shrink-1 mr-4 transition-transform ease-in-out duration-300', href: articleItem.path }));
    recentarticlediv.appendChild(div({ class: 'relatedposts-image md:w-1/2 w-full h-full object-cover rounded-md' }, createOptimizedPicture(articleItem.image, articleItem.title, false, [
      { height: '800', width: '800' },
    ], '', 'rounded-md object-cover h-full w-full')));

    const relatedpostscardcontent = recentarticlediv.appendChild(div({ class: 'relatedposts-card-content flex flex-col justify-start md:w-1/2 w-full md:p-4 py-4' }));
    relatedpostscardcontent.appendChild(p({ class: 'relatedposts-card-date font-black' }, articleItem.date.toLocaleDateString()));
    relatedpostscardcontent.appendChild(h5({ class: 'overflow-hidden my-3 font-black' }, articleItem.title));

    const authorDiv = relatedpostscardcontent.appendChild(div({ class: 'relatedposts-card-author flex flex-row mt-2 items-center' }));
    const authorDivInner = (div({ class: 'relatedposts-card-author-about ml-2' }));
    if (author) {
      authorDiv.appendChild(createOptimizedPicture(author.image, firstAuthor, false, [
        { height: '500', width: '500' },
      ], '', 'block rounded-full w-11 mr-1.5'));
      authorDivInner.appendChild(div({ class: 'relatedposts-card-author-role text-comwrap-gray-light' }, author?.role || ''));
    }
    authorDivInner.appendChild(div({ class: 'relatedposts-card-author-name font-black' }, firstAuthor));
    authorDiv.appendChild(authorDivInner);

    return recentArticleWrapper;
  }
}
