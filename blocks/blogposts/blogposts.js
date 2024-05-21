import { createEffect, createSignal } from '../../vendor/solid-js/dist/solid.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const searchParams = new URLSearchParams(window.location.search).get(
  'categories',
);
const categoriesFromUrl = (searchParams && searchParams.split(',')) || [];
// const selectedCategories = () => categoriesFromUrl;
const [selectedCategories, setSelectedCategories] = createSignal(categoriesFromUrl);

/** @returns {Promise<import('../../lib/blog-helper.js').BlogIndex>} Returntype */
async function getBlogArticles() {
  const res = await (
    await fetch(
      `/api/blogposts.json`,
    )
  ).json();

  for (const article of res.data) {
    article.date = new Date(article.date);
  }
  return res;
}

/**
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  render(block);
}

/**
 * @param {HTMLElement} block
 */
async function render(block) {
  const { data: items } = await getBlogArticles();
  const currentPageUrl = window.location.pathname.split('.html')[0];
  const filteredContent
    = items
      .filter(
        (/** @type any */ obj) =>
          obj.path !== currentPageUrl
          && obj.path !== '/'
          && obj.path.startsWith(currentPageUrl),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime()) ?? [];

  const categoriesMapped = filteredContent.map((item) => item.category) ?? [];
  /** @type String[] */
  const filteredCats = [];
  for (const cat of categoriesMapped) {
    if (cat && !filteredCats.includes(cat)) {
      filteredCats.push(cat);
    }
  }
  const categories = filteredCats.sort((a, b) => a.localeCompare(b));
  const wrapper = document.createElement('div');
  wrapper.className = 'pt-16';
  block.appendChild(wrapper);
  const filterBarWrapper = document.createElement('div');
  const filterBar = document.createElement('div');
  filterBar.className = 'mt-12 flex flex-wrap items-center gap-4';
  filterBar.dataset.filterbar = '';

  categories.forEach((categorie) => {
    const button = document.createElement('button');
    button.className
      = 'whitespace-nowrap rounded-full bg-seconday px-4 py-2 text-sm font-medium text-white opacity-80 transition-all duration-300 hover:-translate-y-1 hover:opacity-80 data-[checked]:-translate-y-1 data-[checked]:opacity-100';
    button.dataset.categorie = categorie;
    if (selectedCategories().includes(categorie)) {
      button.dataset.checked = '';
    }
    button.textContent = categorie;
    filterBar.appendChild(button);
  });

  filterBarWrapper.appendChild(filterBar);
  wrapper.append(filterBarWrapper);

  let renderedFirst = false;
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'mt-6 flex max-w-[1900px] flex-wrap [gap:var(--gap)]';
  cardWrapper.style.setProperty('--gap', '1rem');
  filteredContent.forEach((article, idx) => {
    const articleLink = document.createElement('a');
    articleLink.className
      = 'hidden w-full flex-col bg-white shadow-md transition-all hover:scale-[1.02] data-[checked]:flex sm:w-[calc(50%-(var(--gap)))] md:w-[calc(1/3*100%-(var(--gap)))] lg:w-[calc(25%-(var(--gap)))]';
    articleLink.href = article.path;
    articleLink.style.viewTransitionName = article.path.replaceAll('/', '-');
    articleLink.dataset.category = article.category;

    if (selectedCategories().length > 0) {
      if (selectedCategories().includes(article.category)) {
        articleLink.dataset.checked = '';
      }
    } else {
      articleLink.dataset.checked = '';
    }

    const articleImage = createOptimizedPicture(
      article.image,
      article.title,
      (() => {
        const checked = selectedCategories().includes(article.category);
        if (selectedCategories().length === 0 && idx === 0) {
          return true;
        }
        if (checked && !renderedFirst) {
          renderedFirst = true;
          return true;
        }
        return false;
      })(),
      [{ height: '225', width: '400' }],
      'block leading-none aspect-[16/9] overflow-hidden',
      'w-full h-full object-cover',
    );
    articleLink.appendChild(articleImage);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'mt-6 flex flex-1 flex-col px-4 pb-4';

    const categoryDiv = document.createElement('div');
    categoryDiv.className
      = 'mb-2 text-xs font-bold uppercase text-comwrap-pink';
    const categoryP = document.createElement('p');
    categoryP.textContent = article.category;
    categoryDiv.appendChild(categoryP);
    contentWrapper.appendChild(categoryDiv);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'font-customBold text-xl';
    const titleStrong = document.createElement('strong');
    titleStrong.textContent = article.title;
    titleDiv.appendChild(titleStrong);
    contentWrapper.appendChild(titleDiv);

    const descriptionP = document.createElement('p');
    descriptionP.className
      = 'mt-2 line-clamp-2 bg-white text-sm leading-5 text-zinc-600';
    descriptionP.textContent = article.description;
    contentWrapper.appendChild(descriptionP);

    const dateP = document.createElement('p');
    dateP.className
      = 'font-customBold mt-auto pt-2 text-[10px] font-bold text-seconday';
    dateP.textContent = new Date(article.date).toLocaleDateString();
    contentWrapper.appendChild(dateP);

    articleLink.appendChild(contentWrapper);

    cardWrapper.appendChild(articleLink);
  });

  wrapper.append(cardWrapper);

  const filterBarEl = block.querySelector('[data-filterbar]');
  filterBarEl?.addEventListener('click', (e) => {
    if (e.target instanceof Element) {
      if (e.target.tagName !== 'BUTTON') {
        return;
      }
      const target = e.target;
      let _selectedCats = selectedCategories();
      switch (target.getAttribute('data-checked')) {
        case '':
          target.removeAttribute('data-checked');
          if (
            selectedCategories().includes(
              target.getAttribute('data-categorie') ?? '',
            )
          ) {
            _selectedCats = _selectedCats.filter(
              (item) => item !== target.getAttribute('data-categorie') ?? '',
            );
          }
          break;
        default:
          target.setAttribute('data-checked', '');
          _selectedCats.push(target.getAttribute('data-categorie') ?? '');
      }
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setSelectedCategories([..._selectedCats]);
        });
        return;
      }
      setSelectedCategories([..._selectedCats]);
    }
  });
  const articles = block.querySelectorAll('a[data-category]');
  createEffect(() => {
    if (selectedCategories().length === 0) {
      articles.forEach((article) => {
        article.setAttribute('data-checked', '');
      });
      return;
    }
    articles.forEach((article) => {
      const category = article.getAttribute('data-category');
      if (category && selectedCategories().includes(category)) {
        article.setAttribute('data-checked', '');
      } else {
        article.removeAttribute('data-checked');
      }
    });
  });
  createEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    selectedCategories().length > 0
      ? searchParams.set('categories', selectedCategories().join(','))
      : searchParams.delete('categories');
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url);
  });
}
