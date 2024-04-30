/* global WebImporter */
const quote = async (main, document, params, url) => {
  const quotes = main.querySelectorAll('.cmp-teaser--type-quote');
  const template = document.querySelector('meta[name="template"]');

  if (quotes && template?.content === 'article-template') {
    quotes.forEach((quote) => {
      const quoteCells = [['Quote']];

      const quoteText = quote.querySelector('.cmp-teaser');
      if (quoteText) {
        quoteCells.push([quoteText]);
      }
      const quoteMeta = [];
      const quoteAuthorImage = quote.querySelector('.cmp-teaser__image');
      if (quoteAuthorImage) {
        quoteMeta.push(quoteAuthorImage);
      }
      const quoteAuthorName = quote.querySelector('.cmp-teaser__pretitle');
      const quoteAuthorRole = quote.querySelector('.cmp-teaser__title');
      if (quoteAuthorName && quoteAuthorRole) {
        quoteMeta.push([quoteAuthorName, quoteAuthorRole]);
      }
      if (quoteMeta.length > 0) quoteCells.push(quoteMeta);

      const table = WebImporter.DOMUtils.createTable(quoteCells, document);

      quote.replaceWith(table);
    });
  }
};
export default quote;
