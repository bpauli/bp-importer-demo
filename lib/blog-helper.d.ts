export interface BlogIndex {
  data: Article[]
  byPath: unknown
  complete: boolean
  offset: number
}

export function getArticlesByCategory(categoriesString: string, numberOfArticles: number, sorting: string): Promise<Array<Article>>;
export function fetchBlogArticleIndex(props?: { pageSize: number, offset: number }): BlogIndex;
export function getAuthors(): Promise<Author[]>;
export function getAuthorByName(authorName: string): Promise<Author | undefined>;
export function getAuthorByNameSync(authorName: string, authors?: Array<Author>): Author | undefined;

export interface ArticleResult {
  total: number
  offset: number
  limit: number
  data: Article[]
  ':type': string
}

export interface Article {
  path: string
  title: string
  image: string
  description: string
  date: Date
  lastModified: string
  category: string
  featuredImage: string
  author: string
  hero: boolean
}
export interface Author {
  _path: string
  headline: string
  image: Image
  subline: string
}

export interface Image {
  _path: string
  _dynamicUrl: string
}