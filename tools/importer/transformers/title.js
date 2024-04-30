const title = async (main, document, params, url) => {
	const title = document.querySelector(".cmp-title__text");
	if (title) {
		main.prepend(title);
	}
}

export default title;
