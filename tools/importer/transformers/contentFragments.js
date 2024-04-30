// @ts-ignore
const contentFragments = async (main, document, params, url) => {

	const contentFragment = main.querySelector('.content-fragments-model');

	if (contentFragment) {

		const meta = {};

		const desc = main.querySelector('h2');
		if (desc) {
			meta.Role = desc.innerHTML;
		}

		const author = main.querySelector('h1');

		if (author) {
			meta.Author = author.innerHTML;
		}

		const img = main.querySelector('img');
		if (img) {
			meta.Image = img;
		}

		const block = WebImporter.Blocks.getMetadataBlock(document, meta);
		main.append(block);
	}
}
export default contentFragments;
