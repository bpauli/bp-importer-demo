import { createSignal, onMount } from 'solid-js';
import html from 'solid-js/html';
import { Portal } from 'solid-js/web';

export default function () {
  const [visible, setVisible] = createSignal(false);
  /** @type {HTMLDivElement | null} */
  let ref = null;

  onMount(() => {
    if (!ref) {
      return;
    }
    ref.animate(
      [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.3)', offset: 0.14 },
        { transform: 'scale(1)', offset: 0.2 },
        { transform: 'scale(1.3)', offset: 0.42 },
        { transform: 'scale(1)', offset: 0.7 },
        { transform: 'scale(1)', offset: 1 },
      ],
      { duration: 1000, iterations: Number.POSITIVE_INFINITY },
    );
  });
  return html`
    <button
      ref=${(/** @type {HTMLDivElement} */ el) => (ref = el)}
      class="inset-0 z-40 mx-auto w-fit transition-all duration-500"
      classList=${() => ({
        'top-[calc(100%-20px)] text-comwrap-icon absolute': !visible(),
        // 'bottom-auto top-[15dvh] text-white fixed': visible(),
        'text-white fixed -top-[68dvh]': visible(),
      })}
      onClick=${() => setVisible(!visible())}
      aria-label="heart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22.857" height="20" >
        <path
          d="M11.301 20S.001 15.24.001 6.562A6.284 6.284 0 016.024 0a6 6 0 015.393 3.654A6 6 0 0116.811 0a6.318 6.318 0 016.047 6.562C22.858 15.192 11.301 20 11.301 20z"
          fill="currentColor"
        />
      </svg>
    </button>

    <${Portal}>
      <div
        class="inset-0 z-30 bg-[#212a35]/[.99] text-white transition duration-500"
        classList=${() => ({
          'scrolllock fixed': visible(),
          'translate-y-full fixed': !visible(),
        })}
      >
        <div class='mountain absolute inset-0 bottom-0 -z-10 transition-[clip-path] delay-150 duration-[800ms]'
        classList=${() => ({
          show: visible(),
        })}>
          <svg viewBox="0 0 284 531" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMin slice"
          class='h-full w-full'>
            <defs>
              <linearGradient x1="80.912%" y1="0%" x2="56.984%" y2="50%" id="a">
                <stop stop-color="#212A35" offset="0%" />
                <stop stop-color="#F91351" offset="100%" />
              </linearGradient>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b">
                <stop stop-color="#F91351" stop-opacity="0" offset="0%" />
                <stop stop-color="#F91351" offset="100%" />
              </linearGradient>
            </defs>
            <g fill-rule="nonzero" fill="none">
              <path fill="#F91351" d="M0 156h284v375H0z" />
              <path
                fill="url(#a)"
                d="M159.325 84.485l59.989-3.506L284 0v385H0V151.404l94.373-23.466z"
              />
              <path fill="url(#b)" d="M0 323h284v61H0z" />
            </g>
          </svg>
        </div>
        <div
          class="intro mx-auto mt-[15dvh] grid w-fit grid-cols-1 grid-rows-1 gap-8 *:text-xs *:uppercase"
        >
          <span class="-translate-x-[80%]">made with</span>
          <span class="translate-x-[80%]">based on</span>
        </div>
        <img class="mx-auto mt-12" width="320" height="91" src="/icons/aem.svg" alt="aem"/>
        <div class="mx-auto mt-[40dvh] w-fit">
          <span class="text-xs uppercase">with edge delivery services</span>

          <svg
            class="mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="86.234"
            height="56.259"
          >
            <defs>
              <style>
                .cls-1 {
                  fill: #fff;
                }
              </style>
            </defs>
            <g id="cw-puzzle" transform="translate(-189.096 -466.081)">
              <path
                id="Puzzle_2"
                data-name="Puzzle 2"
                class="cls-1"
                d="M81.9 61.8l-2-1.3 5.8-8.6-10-6.7-2.2 3.3a2.523 2.523 0 01-1.5 1 2.319 2.319 0 01-1.8-.4 2.523 2.523 0 01-1-1.5 2.319 2.319 0 01.4-1.8l2.2-3.3-10-6.7-5.8 8.6-2-1.3a4.03 4.03 0 00-3-.6 3.9 3.9 0 00-2.6 1.7 4.03 4.03 0 00-.6 3 3.9 3.9 0 001.7 2.6l2 1.3-5.8 8.6 10 6.7 2.2-3.3a2.3 2.3 0 013.3-.6 2.523 2.523 0 011 1.5 2.319 2.319 0 01-.4 1.8l-2.2 3.3 10 6.7 5.8-8.6 2 1.3a4.03 4.03 0 003 .6 3.9 3.9 0 002.6-1.7 4.03 4.03 0 00.6-3 4.772 4.772 0 00-1.7-2.6z"
                transform="rotate(141 78.826 307.141)"
              />
              <path
                id="Puzzle_1"
                data-name="Puzzle 1"
                class="cls-1"
                d="M32.7 28.2a3.631 3.631 0 00-1.2-2.8 3.949 3.949 0 00-2.8-1.2 4.012 4.012 0 00-4 4v2.4H14.3v12h4a2.342 2.342 0 011.7.7 2.413 2.413 0 01.7 1.7 2.342 2.342 0 01-.7 1.7 2.413 2.413 0 01-1.7.7h-4v12h10.4v2.4a4 4 0 108 0v-2.4h10.4v-12h-4a2.433 2.433 0 01-2.4-2.4 2.342 2.342 0 01.7-1.7 2.413 2.413 0 011.7-.7h4v-12H32.7z"
                transform="rotate(11 -2188.888 1194.021)"
              />
            </g>
          </svg>
        </div>
        <button class="mx-auto mt-[10dvh] block scale-[1.75]" onClick=${() => setVisible(false)} aria-label="heart">&times;</button>
      </div>
    <//>
  `;
}
