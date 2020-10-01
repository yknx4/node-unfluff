/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let unfluff;
const cheerio = require("cheerio");
const extractor = require("./extractor");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cleaner'.
const cleaner = require("./cleaner");

module.exports = (unfluff = function(html: any, language: any) {
  const doc = cheerio.load(html);
  const lng = language || extractor.lang(doc);

  const pageData = {
    title: extractor.title(doc),
    softTitle: extractor.softTitle(doc),
    date: extractor.date(doc),
    author: extractor.author(doc),
    publisher: extractor.publisher(doc),
    copyright: extractor.copyright(doc),
    favicon: extractor.favicon(doc),
    description: extractor.description(doc),
    keywords: extractor.keywords(doc),
    lang: lng,
    canonicalLink: extractor.canonicalLink(doc),
    tags: extractor.tags(doc),
    image: extractor.image(doc)
  };

  // Step 1: Clean the doc
  // @ts-expect-error ts-migrate(7005) FIXME: Variable 'cleaner' implicitly has an 'any' type.
  cleaner(doc);

  // Step 2: Find the doc node with the best text
  const topNode = extractor.calculateBestNode(doc, lng);

  // Step 3: Extract text, videos, images, links
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'videos' does not exist on type '{ title:... Remove this comment to see the full error message
  pageData.videos = extractor.videos(doc, topNode);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'links' does not exist on type '{ title: ... Remove this comment to see the full error message
  pageData.links = extractor.links(doc, topNode, lng);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'text' does not exist on type '{ title: a... Remove this comment to see the full error message
  pageData.text = extractor.text(doc, topNode, lng);

  return pageData;
});

// Allow access to document properties with lazy evaluation
// @ts-expect-error ts-migrate(2339) FIXME: Property 'lazy' does not exist on type '(html: any... Remove this comment to see the full error message
unfluff.lazy = function(html: any, language: any) {
  return {
    // @ts-expect-error ts-migrate(7023) FIXME: 'title' implicitly has return type 'any' because i... Remove this comment to see the full error message
    title() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'title_' does not exist on type '{ title(... Remove this comment to see the full error message
      return this.title_ != null ? this.title_ : (this.title_ = extractor.title(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'softTitle' implicitly has return type 'any' becau... Remove this comment to see the full error message
    softTitle() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'softTitle_' does not exist on type '{ ti... Remove this comment to see the full error message
      return this.softTitle_ != null ? this.softTitle_ : (this.softTitle_ = extractor.softTitle(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'date' implicitly has return type 'any' because it... Remove this comment to see the full error message
    date() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'date_' does not exist on type '{ title()... Remove this comment to see the full error message
      return this.date_ != null ? this.date_ : (this.date_ = extractor.date(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'copyright' implicitly has return type 'any' becau... Remove this comment to see the full error message
    copyright() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'copyright_' does not exist on type '{ ti... Remove this comment to see the full error message
      return this.copyright_ != null ? this.copyright_ : (this.copyright_ = extractor.copyright(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'author' implicitly has return type 'any' because ... Remove this comment to see the full error message
    author() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'author_' does not exist on type '{ title... Remove this comment to see the full error message
      return this.author_ != null ? this.author_ : (this.author_ = extractor.author(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'publisher' implicitly has return type 'any' becau... Remove this comment to see the full error message
    publisher() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'publisher_' does not exist on type '{ ti... Remove this comment to see the full error message
      return this.publisher_ != null ? this.publisher_ : (this.publisher_ = extractor.publisher(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'favicon' implicitly has return type 'any' because... Remove this comment to see the full error message
    favicon() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'favicon_' does not exist on type '{ titl... Remove this comment to see the full error message
      return this.favicon_ != null ? this.favicon_ : (this.favicon_ = extractor.favicon(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'description' implicitly has return type 'any' bec... Remove this comment to see the full error message
    description() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'description_' does not exist on type '{ ... Remove this comment to see the full error message
      return this.description_ != null ? this.description_ : (this.description_ = extractor.description(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'keywords' implicitly has return type 'any' becaus... Remove this comment to see the full error message
    keywords() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'keywords_' does not exist on type '{ tit... Remove this comment to see the full error message
      return this.keywords_ != null ? this.keywords_ : (this.keywords_ = extractor.keywords(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'lang' implicitly has return type 'any' because it... Remove this comment to see the full error message
    lang() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'language_' does not exist on type '{ tit... Remove this comment to see the full error message
      return this.language_ != null ? this.language_ : (this.language_ = language || extractor.lang(doc));
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'canonicalLink' implicitly has return type 'any' b... Remove this comment to see the full error message
    canonicalLink() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'canonicalLink_' does not exist on type '... Remove this comment to see the full error message
      return this.canonicalLink_ != null ? this.canonicalLink_ : (this.canonicalLink_ = extractor.canonicalLink(doc));
    },

    tags() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'tags_' does not exist on type '{ title()... Remove this comment to see the full error message
      return this.tags_ != null ? this.tags_ : (this.tags_ = extractor.tags(doc));
    },

    image() {
      const doc = getParsedDoc.call(this, html);
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'image_' does not exist on type '{ title(... Remove this comment to see the full error message
      return this.image_ != null ? this.image_ : (this.image_ = extractor.image(doc));
    },

    videos() {
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'videos_' does not exist on type '{ title... Remove this comment to see the full error message
      if (this.videos_ != null) { return this.videos_; }
      const doc = getCleanedDoc.call(this, html);
      const topNode = getTopNode.call(this, doc, this.lang());
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'videos_' does not exist on type '{ title... Remove this comment to see the full error message
      return this.videos_ = extractor.videos(doc, topNode);
    },

    text() {
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'text_' does not exist on type '{ title()... Remove this comment to see the full error message
      if (this.text_ != null) { return this.text_; }
      const doc = getCleanedDoc.call(this, html);
      const topNode = getTopNode.call(this, doc, this.lang());
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'text_' does not exist on type '{ title()... Remove this comment to see the full error message
      return this.text_ = extractor.text(doc, topNode, this.lang());
    },

    // @ts-expect-error ts-migrate(7023) FIXME: 'links' implicitly has return type 'any' because i... Remove this comment to see the full error message
    links() {
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'links_' does not exist on type '{ title(... Remove this comment to see the full error message
      if (this.links_ != null) { return this.links_; }
      const doc = getCleanedDoc.call(this, html);
      // @ts-expect-error ts-migrate(7022) FIXME: 'topNode' implicitly has type 'any' because it doe... Remove this comment to see the full error message
      const topNode = getTopNode.call(this, doc, this.lang());
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'links_' does not exist on type '{ title(... Remove this comment to see the full error message
      return this.links_ = extractor.links(doc, topNode, this.lang());
    }
  };
};

// Load the doc in cheerio and cache it
var getParsedDoc = function(html: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  return this.doc_ != null ? this.doc_ : (this.doc_ = cheerio.load(html));
};

// Cached version of calculateBestNode
var getTopNode = function(doc: any, lng: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  return this.topNode_ != null ? this.topNode_ : (this.topNode_ = extractor.calculateBestNode(doc, lng));
};

// Cached version of the cleaned doc
var getCleanedDoc = function(html: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  if (this.cleanedDoc_ != null) { return this.cleanedDoc_; }
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  const doc = getParsedDoc.call(this, html);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.cleanedDoc_ = cleaner(doc);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  return this.cleanedDoc_;
};
