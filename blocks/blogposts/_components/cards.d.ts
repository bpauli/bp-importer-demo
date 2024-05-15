import type { Article } from '../../../lib/blog-helper.js';

export { Article };

export default function Cards(props: { article: Article, categories: string[] }): Node | Node[];
