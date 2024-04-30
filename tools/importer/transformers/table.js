/* global WebImporter */
const table = async (main, document, params, url) => {

  const tables = main.querySelectorAll('table');

  if (tables) {
    main.querySelectorAll('table').forEach((table) => {
      let tHead = table.querySelector('thead');
      if (!tHead) {
        tHead = table.createTHead();
      }
      if (tHead) {
        const row = tHead.insertRow(0);
        const th = document.createElement('th');
        th.textContent = 'Table';
        row.appendChild(th);
      }
    });
  }
};
export default table;
