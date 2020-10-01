/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter letiations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import cheerio from 'cheerio'
import extractor from './extractor'
import cleaner from './cleaner'
import { Link, Video } from './definitions'
let unfluff

module.exports = unfluff = function (html: string, language?: 'es' | 'en') {
  const doc = cheerio.load(html)
  const lng: 'es' | 'en' = language ?? (extractor.lang(doc) as 'en' | 'es') ?? 'en'

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
    image: extractor.image(doc),
  }

  // Step 1: Clean the doc
  cleaner(doc)

  // Step 2: Find the doc node with the best text
  const topNode = extractor.calculateBestNode(doc, lng)

  // Step 3: Extract text, videos, images, links
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'videos' does not exist on type '{ title:... Remove this comment to see the full error message
  pageData.videos = extractor.videos(doc, topNode)
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'links' does not exist on type '{ title: ... Remove this comment to see the full error message
  pageData.links = extractor.links(doc, topNode, lng)
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'text' does not exist on type '{ title: a... Remove this comment to see the full error message
  pageData.text = extractor.text(doc, topNode, lng)

  return pageData
}

// Allow access to document properties with lazy evaluation
// @ts-expect-error ts-migrate(2339) FIXME: Property 'lazy' does not exist on type '(html: any... Remove this comment to see the full error message
unfluff.lazy = function (html: string, language?: 'es' | 'en') {
  let _parsedDoc: cheerio.Root | null = null
  let _cleanedDoc: cheerio.Root | null = null
  let _topNode: cheerio.Cheerio | null = null
  const getParsedDoc = (docHtml: string) => (_parsedDoc === null ? (_parsedDoc = cheerio.load(docHtml)) : _parsedDoc)
  const getCleanedDoc = (docHtml: string) =>
    _cleanedDoc === null ? (_cleanedDoc = cleaner(getParsedDoc(docHtml))) : _cleanedDoc
  const getTopNode = (doc: cheerio.Root, lng: 'es' | 'en') =>
    _topNode === null ? (_topNode = extractor.calculateBestNode(doc, lng)) : _topNode
  let title_: string | null = null
  let softTitle_: string | null = null
  let date_: string | null = null
  let copyright_: string | null = null
  let author_: string[] | null = null
  let publisher_: string | null = null
  let text_: string | null = null
  let favicon_: string | undefined
  let description_: string | undefined
  let keywords_: string | undefined
  let language_: 'es' | 'en' | null = null
  let canonicalLink_: string | undefined
  let tags_: string[] | null = null
  let image_: string | null | undefined = null
  let links_: Link[] | null = null
  let videos_: Video[] | null = null
  return {
    title() {
      const doc = getParsedDoc(html)
      return title_ != null ? title_ : (title_ = extractor.title(doc))
    },

    softTitle() {
      const doc = getParsedDoc(html)
      return softTitle_ != null ? softTitle_ : (softTitle_ = extractor.softTitle(doc))
    },

    date() {
      const doc = getParsedDoc(html)
      return date_ != null ? date_ : (date_ = extractor.date(doc))
    },

    copyright() {
      const doc = getParsedDoc(html)
      return copyright_ != null ? copyright_ : (copyright_ = extractor.copyright(doc))
    },

    author() {
      const doc = getParsedDoc(html)
      return author_ != null ? author_ : (author_ = extractor.author(doc))
    },

    publisher() {
      const doc = getParsedDoc(html)
      return publisher_ != null ? publisher_ : (publisher_ = extractor.publisher(doc))
    },

    favicon() {
      const doc = getParsedDoc(html)
      return favicon_ != null ? favicon_ : (favicon_ = extractor.favicon(doc))
    },

    description() {
      const doc = getParsedDoc(html)
      return description_ != null ? description_ : (description_ = extractor.description(doc))
    },

    keywords() {
      const doc = getParsedDoc(html)
      return keywords_ != null ? keywords_ : (keywords_ = extractor.keywords(doc))
    },

    lang(): 'es' | 'en' | null {
      const doc = getParsedDoc(html)
      return language_ != null ? language_ : (language_ = language ?? extractor.lang(doc))
    },

    canonicalLink() {
      const doc = getParsedDoc(html)
      return canonicalLink_ != null ? canonicalLink_ : (canonicalLink_ = extractor.canonicalLink(doc))
    },

    tags() {
      const doc = getParsedDoc(html)
      return tags_ != null ? tags_ : (tags_ = extractor.tags(doc))
    },

    image() {
      const doc = getParsedDoc(html)
      return image_ != null ? image_ : (image_ = extractor.image(doc))
    },

    videos() {
      if (videos_ != null) {
        return videos_
      }
      const doc = getCleanedDoc(html)
      const topNode = getTopNode(doc, this.lang() ?? 'en')
      return (videos_ = extractor.videos(doc, topNode))
    },

    text() {
      if (text_ != null) {
        return text_
      }
      const doc = getCleanedDoc(html)
      const topNode = getTopNode(doc, this.lang() ?? 'en')
      return (text_ = extractor.text(doc, topNode, this.lang() ?? 'en'))
    },
    links() {
      if (links_ != null) {
        return links_
      }
      const doc = getCleanedDoc(html)
      const topNode = getTopNode(doc, this.lang() ?? 'en')
      return (links_ = extractor.links(doc, topNode, this.lang() ?? 'en'))
    },
  }
}
