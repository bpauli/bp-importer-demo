import { createUniqueId } from 'solid-js';
import html from 'solid-js/html';
import { For, render } from 'solid-js/web';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const slides = [...block.children];
  const uniqueContainerId = createUniqueId();
  const slideIds = slides.map(() => createUniqueId());

  /** @param {string} id */
  function markActiveDot(id) {
    const dots = document.getElementById(`${uniqueContainerId}-dots`);
    if (!dots) {
      return;
    }
    [...dots?.children].forEach((dot) => {
      dot.classList.remove('bg-comwrap-pink');
      dot.classList.add('bg-comwrap-gray');
    });

    const activeDot = document.getElementById(id);
    if (!activeDot) {
      return;
    }
    activeDot.classList.add('bg-comwrap-pink');
    activeDot.classList.remove('bg-comwrap-gray');
  }
  const Carousel = html`
    <div class="relative mb-10 sm:mb-0">
      <div
        id=${uniqueContainerId}
        class="flex snap-x snap-mandatory flex-row flex-nowrap gap-0 overflow-clip overflow-x-scroll scrollbar-hide"
        onScrollEnd=${() => {
          const activeSlide = getSlideIndex();
          markActiveDot(`${uniqueContainerId}-${slideIds[activeSlide]}-dot`);
        }}
      >
        <${For} each=${slides}>
          ${(
            /** @type {HTMLElement} */ slide,
            /** @type {() => number} */ index,
          ) => {
            return html`
              <article
                id=${`${uniqueContainerId}-${slideIds[index()]}`}
                class="aspect-video h-full w-full flex-shrink-0 snap-start snap-always object-cover"
              >
                ${slide}
              </article>
            `;
          }}
        <//>
      </div>
      <div class="sm:pt-4">
        <button
          class="cursor group absolute bottom-0 end-12 z-30 hidden cursor-pointer items-center justify-center px-4 text-comwrap-pink hover:text-black focus:outline-none md:flex"
          onClick=${() => {
            const slideIndex = getSlideIndex();

            const arr = rotateSlideIds(slideIds, slideIndex);

            document
              .getElementById(`${uniqueContainerId}-${arr.at(-1)}`)
              ?.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest',
              });
            markActiveDot(`${uniqueContainerId}-${arr.at(-1)}-dot`);
          }}
        >
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-comwrap-gray bg-white/30 transition-all hover:pr-2 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-100/70"
          >
            <svg
              class="h-3 w-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span class="sr-only">Previous</span>
          </span>
        </button>
        <button
          class="cursor group absolute bottom-0 end-0 z-30 hidden cursor-pointer items-center justify-center px-4 text-comwrap-pink hover:text-black focus:outline-none md:flex"
          onClick=${() => {
            const slideIndex = getSlideIndex();
            const arr = rotateSlideIds(slideIds, slideIndex);

            document
              .getElementById(`${uniqueContainerId}-${arr[1]}`)
              ?.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest',
              });

            markActiveDot(`${uniqueContainerId}-${arr[1]}-dot`);
          }}
        >
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-comwrap-gray bg-white/30 transition-all hover:pl-2 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-100/70"
          >
            <svg
              class="h-3 w-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span class="sr-only">Next</span>
          </span>
        </button>
        <div
          id=${() => `${uniqueContainerId}-dots`}
          class="bottom absolute left-1/2 z-30 flex -translate-x-1/2 space-x-3 pt-3 md:-bottom-5"
        >
          <${For} each=${slides}>
            ${(/** @type {any} */ _, /** @type {() => number} */ index) => {
              return html`
                <button
              aria-label=${() => `Slide ${index() + 1}`}
              aria-current=${() => (index() === 0 ? 'true' : 'false')}
                  id=${() => `${uniqueContainerId}-${slideIds[index()]}-dot`}
                  class="h-2 w-2 rounded-full"
                  classList=${() => ({
                    'bg-comwrap-pink': index() === 0,
                    'bg-comwrap-gray': index() !== 0,
                  })}
                  onClick=${() => {
                    document
                      .getElementById(
                        `${uniqueContainerId}-${slideIds[index()]}`,
                      )
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'start',
                        block: 'nearest',
                      });

                    markActiveDot(
                      `${uniqueContainerId}-${slideIds[index()]}-dot`,
                    );
                  }}
                ></button>
              `;
            }}
          <//>
        </div>
      </div>
    </div>
  `;

  render(() => Carousel, block);

  /**
   * @template {unknown} T
   * @param {Array<T>} arr
   * @param {number} n
   * @returns {Array<T>} rotated array
   */
  function rotateSlideIds(arr, n) {
    const len = arr.length;
    const offset = ((n % len) + len) % len;
    return [...arr.slice(offset), ...arr.slice(0, offset)];
  }

  /**
   * Gets the index of the current slide.
   * @returns {number} slide index
   */
  function getSlideIndex() {
    const scrollLeft
      = document.getElementById(uniqueContainerId)?.scrollLeft ?? 0;
    const slideWidth
      = document.getElementById(`${uniqueContainerId}-${slideIds[0]}`)
        ?.offsetWidth ?? scrollLeft;
    const slideIndex = Math.round(scrollLeft / slideWidth);
    return slideIndex;
  }
}
