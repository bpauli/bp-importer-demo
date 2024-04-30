/* global WebImporter */
const code = async (main, document, params, url) => {
    const codeBlocks = main.querySelectorAll('code');
    const template = document.querySelector('meta[name="template"]');

    if(codeBlocks && template?.content === 'article-template') {
        codeBlocks.forEach((codeBlock) => {
            const formattedCode = codeBlock.innerHTML;
            const pre = document.createElement('pre');
            pre.innerHTML = formattedCode;
            const codeCells = [['Code'], [pre]];
            const codeTable = WebImporter.DOMUtils.createTable(codeCells, document);
            codeTable.innerHTML = codeTable.innerHTML.replaceAll('<br>', '');
            codeBlock.replaceWith(codeTable);
        })
    }
};
export default code;
