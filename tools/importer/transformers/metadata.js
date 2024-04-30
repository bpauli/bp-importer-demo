/* global WebImporter */

const metadata = async (main, document, params, url) => {

	const template = document.querySelector('[name="template"]');

	if (template) {

		const meta = {};

		meta.Template = template.content;

		const title = document.querySelector("title");
		if (title) {
			meta.Title = title.innerHTML.replace(/[\n\t]/gm, "");
		}

		const desc = document.querySelector('[property="og:description"]');
		if (desc) {
			meta.Description = desc.content;
		}

		const authors = document.querySelectorAll(
			".cmp-avatar__title:not(.image-list .cmp-avatar__title)"
		);
		if (authors) {
			let authorNamesArray = Array.from(authors).map(function (author) {
				return author.textContent;
			});
			meta.Author = authorNamesArray.join(",");
		}

		const category = document.querySelector(".cmp-hashtag__name")?.innerHTML;
		if (category) {
			meta.Category = category;
		}

		const img = document.querySelector('[property="og:image"]');

		if (img) {
			const el = document.createElement("img");
			let elSrc = el.src;
			elSrc = img.content;
			const originUrl = "https://www.comwrap.com/";
			const localUrl = "http://localhost:3001/";
			el.src = elSrc.replace(originUrl, localUrl);
			meta.Image = el;
		}

		const featuredImage = document.querySelector(".cmp-image__image");
		if (featuredImage) {
			const featImg = document.createElement("img");
			featImg.src = featuredImage.src;
			meta.featuredImage = featImg;
		}

		/** @type {HTMLMetaElement | null} */
		const dateElement = document.querySelector("meta[name='modify-date']");
		if (dateElement) {
			meta.date = dateElement.content;
		}

		const block = WebImporter.Blocks.getMetadataBlock(document, meta);

		main.append(block);

	}
};

export default metadata;
