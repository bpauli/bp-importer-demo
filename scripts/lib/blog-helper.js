import { groupBy } from './utils.js';

/** @type {import('./blog-helper.d.ts').BlogIndex | null} */
let blogIndex = null;
/** @type {import('./blog-helper.d.ts').fetchBlogArticleIndex} */
export async function fetchBlogArticleIndex(
  props = { pageSize: 40, offset: 0 },
) {
  if (!blogIndex) {
    blogIndex = {
      data: [],
      byPath: {},
      complete: false,
      offset: 0,
    };
  }
  if (blogIndex.complete) {
    return blogIndex;
  }
  const index = blogIndex;
  try {
    const resp = await fetch(
      `/api/blogposts.json`,
    );
    /** @type {import('./blog-helper.d.ts').ArticleResult} */
    const json = await resp.json();
    const complete = json.limit + json.offset === json.total;
    json.data.forEach((post) => {
      post.date = new Date(post.date);
      index.data.push(post);
    });
    index.complete = complete;
    index.offset = json.offset + props.pageSize;
    index.byPath = groupBy(index.data, (post) => post.path);
  } catch (e) {
    console.error(e);
  }

  return index;
}

/**
 * Retrieves articles by category.
 *
 * @param {string} categoriesString - The string of categories separated by commas.
 * @param {string | number} numberOfArticles - The number of articles to retrieve.
 * @param {string} sorting - The sorting order of the articles ('ascending' or 'descending').
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of limited articles.
 * @throws {Error} - If there is an error fetching the blog articles.
 */
export async function getArticlesByCategory(
  categoriesString,
  numberOfArticles,
  sorting,
) {
  try {
    if (
      !categoriesString
      || !numberOfArticles
      || !sorting
      || (sorting !== 'ascending' && sorting !== 'descending')
    ) {
      throw new Error('Invalid parameters');
    }

    if (typeof numberOfArticles === 'string') {
      numberOfArticles = Number.parseInt(numberOfArticles, 10);
    }

    if (Number.isNaN(numberOfArticles) || numberOfArticles <= 0) {
      throw new Error('Invalid numberOfArticles');
    }

    const categories = categoriesString
      .split(',')
      .map((category) => category.trim());
    const allArticles = await fetchBlogArticleIndex();
    const lowerCaseCategories = categories.map((category) =>
      category.toLowerCase(),
    );
    const currentPath = window.location.pathname;

    const articlesInCategories = allArticles.data.filter(
      (article) => {
        return lowerCaseCategories.includes(article.category.toLowerCase())
          && article.path !== currentPath && article.path.startsWith(`/${currentPath.split('/')[1]}`);
      },
    );

    let sortedArticles;
    if (sorting === 'ascending') {
      sortedArticles = articlesInCategories.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );
    } else {
      sortedArticles = articlesInCategories.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );
    }

    const limitedArticles = sortedArticles.slice(0, numberOfArticles);

    return limitedArticles;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching blog articles:', error.message);
    }
    return [];
  }
}

/** @type {Array<any> | undefined} */
let authors;
/** @type {import('./blog-helper.d.ts').getAuthors} */
export async function getAuthors() {
  try {
    if (!authors) {
      const resp = await fetch('/api/authors.json');

      if (!resp.ok) {
        throw new Error(`Failed to fetch data. Status: ${resp.status}`);
      }

      const json = await resp.json();
      authors = json.data;
    }
    if (!authors) {
      throw new Error('should not happen');
    }
    return authors;
  } catch (error) {
    console.error('Error during fetch operation:', error);
    // Handle the error as needed, e.g., return a default value or rethrow the error
    throw error;
  }
}

/** @type {import('./blog-helper.d.ts').getAuthorByName} */
export async function getAuthorByName(authorName) {
  try {
    const authors = await getAuthors();
    if (!authors) {
      throw new Error('unable to retrieve authors');
    }
    for (const author of authors) {
      if (author.title === authorName) {
        return author;
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error('unable to retrieve authors');
  }
}

/** @type {import('./blog-helper.d.ts').getAuthorByNameSync} */
export function getAuthorByNameSync(authorName, authors) {
  if (!authors) {
    throw new Error('no authors provided');
  }
  for (const author of authors) {
    if (author.title === authorName) {
      return author;
    }
  }
}
