/* global WebImporter */

const carousel = async (
  /** @type {HTMLDivElement} */ main,
  /** @type {HTMLDivElement} */ document,
  /** @type {any} */ _params,
  /** @type {any} */ _url,
) => {
  const carouselWrapperArr = main.querySelectorAll('.cmp-carousel');
  /** @type {HTMLMetaElement | null} */
  const template = document.querySelector('meta[name="template"]');

  if (!carouselWrapperArr.length && template?.content !== 'article-template') {
    return;
  }
  for (const carouselWrapper of carouselWrapperArr) {
    /** @type {Array<HTMLElement[]|string[]>} */
    const carouselComponent = [['Carousel']];

    const carouselItems = carouselWrapper.querySelectorAll(
      '.cmp-carousel__item',
    );
    for (const carouselItem of carouselItems) {
      /** @type {HTMLImageElement | null} */
      const carouselImg = carouselItem.querySelector('.cmp-image');
      if (carouselImg) {
        carouselComponent.push([carouselImg]);
      }
    }

    // @ts-ignore
    const carouselTable = WebImporter.DOMUtils.createTable(
      carouselComponent,
      document,
    );
    carouselWrapper.replaceWith(carouselTable);
  }
};

export default carousel;
