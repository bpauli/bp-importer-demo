// @ts-ignore
export default function BlogPosts(main, document, params, url) {
  const blogPosts = document.querySelector('.cmp-image-list--type-bloglist');
  /**  @type {HTMLMetaElement | null} */
  const template = document.querySelector('meta[name="template"]');

  if (blogPosts && template?.content === 'page-content') {
    const cells = [['blogposts'], ['']];
    // @ts-ignore
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
}
