const morph = async (main, document, params, url) => {
	let imageTitleNodes = main.querySelectorAll('span.cmp-image__title');
	for (const imageTitleNode of imageTitleNodes) {
		let image = imageTitleNode.parentNode.querySelector('img');
		if (image.alt.trim() === imageTitleNode.textContent.trim()) {
			image.alt = cleanup(imageTitleNode.textContent.trim());
		}
	}
}

function cleanup(text) {
	// Remove punctuation and convert to lowercase
	var cleanedText = text.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, '').toLowerCase()
	var words = cleanedText.split(/\s+/);
	return words.join('_');
}


export default morph;
