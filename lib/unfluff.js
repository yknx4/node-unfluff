"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter letiations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const cheerio_1 = __importDefault(require("cheerio"));
const extractor_1 = __importDefault(require("./extractor"));
const cleaner_1 = __importDefault(require("./cleaner"));
function unfluff(html, language) {
    var _a;
    const doc = cheerio_1.default.load(html);
    const lng = (_a = language !== null && language !== void 0 ? language : extractor_1.default.lang(doc)) !== null && _a !== void 0 ? _a : 'en';
    const pageData = {
        title: extractor_1.default.title(doc),
        softTitle: extractor_1.default.softTitle(doc),
        date: extractor_1.default.date(doc),
        author: extractor_1.default.author(doc),
        publisher: extractor_1.default.publisher(doc),
        copyright: extractor_1.default.copyright(doc),
        favicon: extractor_1.default.favicon(doc),
        description: extractor_1.default.description(doc),
        keywords: extractor_1.default.keywords(doc),
        lang: lng,
        canonicalLink: extractor_1.default.canonicalLink(doc),
        tags: extractor_1.default.tags(doc),
        image: extractor_1.default.image(doc),
    };
    // Step 1: Clean the doc
    cleaner_1.default(doc);
    // Step 2: Find the doc node with the best text
    const topNode = extractor_1.default.calculateBestNode(doc, lng);
    // Step 3: Extract text, videos, images, links
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'videos' does not exist on type '{ title:... Remove this comment to see the full error message
    pageData.videos = extractor_1.default.videos(doc, topNode);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'links' does not exist on type '{ title: ... Remove this comment to see the full error message
    pageData.links = extractor_1.default.links(doc, topNode, lng);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'text' does not exist on type '{ title: a... Remove this comment to see the full error message
    pageData.text = extractor_1.default.text(doc, topNode, lng);
    return pageData;
}
exports.default = unfluff;
// Allow access to document properties with lazy evaluation
unfluff.lazy = function (html, language) {
    let _parsedDoc = null;
    let _cleanedDoc = null;
    let _topNode = null;
    const getParsedDoc = (docHtml) => (_parsedDoc === null ? (_parsedDoc = cheerio_1.default.load(docHtml)) : _parsedDoc);
    const getCleanedDoc = (docHtml) => _cleanedDoc === null ? (_cleanedDoc = cleaner_1.default(getParsedDoc(docHtml))) : _cleanedDoc;
    const getTopNode = (doc, lng) => _topNode === null ? (_topNode = extractor_1.default.calculateBestNode(doc, lng)) : _topNode;
    let title_ = null;
    let softTitle_ = null;
    let date_ = null;
    let copyright_ = null;
    let author_ = null;
    let publisher_ = null;
    let text_ = null;
    let favicon_;
    let description_;
    let keywords_;
    let language_ = null;
    let canonicalLink_;
    let tags_ = null;
    let image_ = null;
    let links_ = null;
    let videos_ = null;
    return {
        title() {
            const doc = getParsedDoc(html);
            return title_ != null ? title_ : (title_ = extractor_1.default.title(doc));
        },
        softTitle() {
            const doc = getParsedDoc(html);
            return softTitle_ != null ? softTitle_ : (softTitle_ = extractor_1.default.softTitle(doc));
        },
        date() {
            const doc = getParsedDoc(html);
            return date_ != null ? date_ : (date_ = extractor_1.default.date(doc));
        },
        copyright() {
            const doc = getParsedDoc(html);
            return copyright_ != null ? copyright_ : (copyright_ = extractor_1.default.copyright(doc));
        },
        author() {
            const doc = getParsedDoc(html);
            return author_ != null ? author_ : (author_ = extractor_1.default.author(doc));
        },
        publisher() {
            const doc = getParsedDoc(html);
            return publisher_ != null ? publisher_ : (publisher_ = extractor_1.default.publisher(doc));
        },
        favicon() {
            const doc = getParsedDoc(html);
            return favicon_ != null ? favicon_ : (favicon_ = extractor_1.default.favicon(doc));
        },
        description() {
            const doc = getParsedDoc(html);
            return description_ != null ? description_ : (description_ = extractor_1.default.description(doc));
        },
        keywords() {
            const doc = getParsedDoc(html);
            return keywords_ != null ? keywords_ : (keywords_ = extractor_1.default.keywords(doc));
        },
        lang() {
            const doc = getParsedDoc(html);
            return language_ != null ? language_ : (language_ = language !== null && language !== void 0 ? language : extractor_1.default.lang(doc));
        },
        canonicalLink() {
            const doc = getParsedDoc(html);
            return canonicalLink_ != null ? canonicalLink_ : (canonicalLink_ = extractor_1.default.canonicalLink(doc));
        },
        tags() {
            const doc = getParsedDoc(html);
            return tags_ != null ? tags_ : (tags_ = extractor_1.default.tags(doc));
        },
        image() {
            const doc = getParsedDoc(html);
            return image_ != null ? image_ : (image_ = extractor_1.default.image(doc));
        },
        videos() {
            var _a;
            if (videos_ != null) {
                return videos_;
            }
            const doc = getCleanedDoc(html);
            const topNode = getTopNode(doc, (_a = this.lang()) !== null && _a !== void 0 ? _a : 'en');
            return (videos_ = extractor_1.default.videos(doc, topNode));
        },
        text() {
            var _a, _b;
            if (text_ != null) {
                return text_;
            }
            const doc = getCleanedDoc(html);
            const topNode = getTopNode(doc, (_a = this.lang()) !== null && _a !== void 0 ? _a : 'en');
            return (text_ = extractor_1.default.text(doc, topNode, (_b = this.lang()) !== null && _b !== void 0 ? _b : 'en'));
        },
        links() {
            var _a, _b;
            if (links_ != null) {
                return links_;
            }
            const doc = getCleanedDoc(html);
            const topNode = getTopNode(doc, (_a = this.lang()) !== null && _a !== void 0 ? _a : 'en');
            return (links_ = extractor_1.default.links(doc, topNode, (_b = this.lang()) !== null && _b !== void 0 ? _b : 'en'));
        },
    };
};
//# sourceMappingURL=unfluff.js.map