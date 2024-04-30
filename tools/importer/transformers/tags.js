// @ts-ignore
const tags = async (main, document, params, url) => {
	const tagName = document.querySelector(".cmp-hashtag__name");
    /** @type {HTMLMetaElement | null} */
    const template = document.querySelector('meta[name="template"]');
	if (tagName && template?.content === 'article-template') {
		const tagCells = [["Tags"], [tagName]];
		// @ts-ignore
		const tagTable = WebImporter.DOMUtils.createTable(tagCells, document);
		main.prepend(tagTable);

		const tag = document.querySelector(".hashtag");
		tag.remove();

	}

}

export default tags;
