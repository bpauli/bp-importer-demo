import author from './author.js';
import blogPosts from './blogPosts.js';
import code from './code.js';
import contentFragments from './contentFragments';
import metadata from './metadata.js';
import quote from './quote.js';
import relatedPosts from './relatedPosts.js';
import table from './table.js';
import tags from './tags.js';
import title from './title.js';
import morph from './accessibility.js';
import carousel from './carousel.js';

export const transformers = [
  table,
  metadata,
  author,
  title,
  tags,
  relatedPosts,
  blogPosts,
  quote,
  code,
  contentFragments,
  morph,
  carousel,
];
