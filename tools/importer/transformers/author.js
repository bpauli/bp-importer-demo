// @ts-ignore
const authors = async (main, document, params, url) => {
	const cells = [["Author"]];
	const avatar = document.querySelector('.cmp-avatar__container');
    /** @type {HTMLMetaElement | null} */
    const template = document.querySelector('meta[name="template"]');

	if (avatar && template?.content === 'article-template') {
		// const authorImages = document.querySelectorAll(
		// 	".cmp-avatar__image-image:not(.image-list .cmp-avatar__image-image)"
		// );
		const authorNames = document.querySelectorAll(
			".cmp-avatar__title:not(.image-list .cmp-avatar__title)"
		);
		// const authorDescriptions = document.querySelectorAll(
		// 	".cmp-avatar__subtitle:not(.image-list .cmp-avatar__subtitle)"
		// );
		for (let i = 0; i < authorNames.length; i++) {
			// const authorImage = authorImages[i];
			const authorName = authorNames[i].textContent;
			// const authorDescription = authorDescriptions[i].textContent;
			// const authorDetails = authorName + "<br>" + authorDescription;
			cells.push([authorName.trim()]);
		}
		// @ts-ignore
		const table = WebImporter.DOMUtils.createTable(cells, document);
		main.prepend(table);
		// we'll need two sections, one that renders tags, author, title and a image
		// while the other will render the rest of the post
		// doing so, we'll have a better chance in improving lcp
		main.querySelector('img').after(document.createElement('hr'));
	}
}
export default authors;
