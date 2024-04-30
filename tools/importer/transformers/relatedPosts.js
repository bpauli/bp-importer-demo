/* global WebImporter */

const relatedPosts = async (main, document, params, url) => {

  const relatedPostWrapper = main.querySelector('.image-list');
  const template = document.querySelector('meta[name="template"]');

  function removeDuplicates(categories) {
    let uniqueCategories = {};
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      if (!uniqueCategories[category]) {
        uniqueCategories[category] = true;
      }
    }
    let uniqueArray = Object.keys(uniqueCategories);
    return uniqueArray;
  }

  if (relatedPostWrapper && template?.content === 'article-template') {
      const categories = relatedPostWrapper?.querySelectorAll('.cmp-hashtag__name');
      let arrayFromNodeList = [...(categories ?? [])];
      let categoriesArray = arrayFromNodeList.map(
        (element) => element.innerHTML,
      );

      const categoryFinalList = removeDuplicates(categoriesArray).join(', ');

      const imageListItems = document.querySelectorAll(
        '.cmp-image-list__item-container',
      );
      const imageListLength = imageListItems.length;

      const recentArticlesTitle = document.querySelectorAll('.cmp-title__text');
      let lastTitleTextElement =
        recentArticlesTitle[recentArticlesTitle.length - 1];
      const recentArticlesTitleTags = [
        ['Relatedposts'],
        ['Title', lastTitleTextElement?.innerHTML],
        ['Category', categoryFinalList],
        ['Max Items', imageListLength],
        ['Sort Order', 'descending'], // TODO: Read this value from JCR
      ];
      const recentArticlesTable = WebImporter.DOMUtils.createTable(
        recentArticlesTitleTags,
        document,
      );
      main.append(recentArticlesTable);

      lastTitleTextElement?.remove();
  }
};

export default relatedPosts;
