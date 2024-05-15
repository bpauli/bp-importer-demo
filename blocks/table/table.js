/*
 * Table Block
 */
import { table, tbody, td, th, thead, tr } from '../../scripts/dom-helpers.js';

/**
 * @param {number} rowIndex
 */
function buildCell(rowIndex) {
  const cell = rowIndex
    ? td({ class: 'text-left p-5 text-comwrap-black' })
    : th({ class: 'text-left text-comwrap-pink font-bold p-5 uppercase' });
  if (!rowIndex) {
    cell.setAttribute('scope', 'col');
  }
  return cell;
}

/**
 * @param {{ children: any; innerHTML: string; classList: {
     remove: (arg0 : string) => void; add: (arg0: string, arg1: string) => void;
}; append: (arg0: Element) => void; }} block
 */
export default async function decorate(block) {
  const t = table({
    class: 'table-auto w-full max-w-full overflow-x-auto',
    cellpadding: 1,
    cellspacing: 0,
    border: 1,
  });
  const head = thead();
  const body = tbody();
  t.append(head, body);
  [...block.children].forEach((child, i) => {
    const row = tr();
    if (i) {
      body.append(row);
    } else {
      row.classList.add(...'border-b border-b-gray-200'.split(' '));
      head.append(row);
    }
    [...child.children].forEach((col) => {
      const cell = buildCell(i);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.classList.remove('table');
  block.classList.add('w-full', 'overflow-x-auto');
  block.append(t);
}