// create a function that is a tag template lieral for html and just retruns the same string

import { loadCSS } from '../scripts/aem.js';

/** @type {import('./utils.d.ts').html} */
export function html(strings, ...values) {
  let str = '';
  for (let i = 0; i < strings.length; i++) {
    str += strings[i] + (values[i] || '');
  }

  return str;
}

/** @type {import('./utils.d.ts').render} */
export function render(element, mountContainer) {
  const _mount = mountContainer?.mount;
  if (_mount) {
    _mount.innerHTML = '';
    _mount.append(element);
    return _mount;
  }

  const tmpl = document.createElement('template');
  tmpl.innerHTML = element;
  const fragment = new DocumentFragment();
  fragment.append(tmpl ? tmpl.content.cloneNode(true) : element);
  return fragment;
}

/** @type {import('./utils.d.ts').groupBy} */
export function groupBy(array, keyGetter) {
  const _map = new Map();
  const arr = array.reduce((map, item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
    return map;
  }, _map);

  return arr;
}

/** @type {import('./utils.d.ts').loadComponentCSS} */
export function loadComponentCSS(url) {
  loadCSS(url.replace('.js', '.css'));
}

/** @type {import('./utils.d.ts').clamp} */
export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
};