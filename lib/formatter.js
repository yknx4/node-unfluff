"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const stopwords_1 = __importDefault(require("./stopwords"));
const map_1 = __importDefault(require("lodash/map"));
const filter_1 = __importDefault(require("lodash/filter"));
function formatter(doc, topNode, language) {
    removeNegativescoresNodes(doc, topNode);
    linksToText(doc, topNode);
    addNewlineToBr(doc, topNode);
    replaceWithText(doc, topNode);
    removeFewwordsParagraphs(doc, topNode, language);
    return convertToText(doc, topNode);
}
exports.default = formatter;
function linksToText(doc, topNode) {
    const nodes = topNode.find('a');
    return nodes.each(function (_, e) {
        var _a;
        return doc(e).replaceWith((_a = doc(e).html()) !== null && _a !== void 0 ? _a : '');
    });
}
function ulToText(doc, node) {
    const nodes = node.find('li');
    let txt = '';
    nodes.each(function (_, e) {
        return (txt = txt + `\n * ${doc(e).text()}`);
    });
    txt = txt + '\n';
    return txt;
}
function replaceWithText(doc, topNode) {
    const nodes = topNode.find('b, strong, i, br, sup');
    return nodes.each(function (_, e) {
        return doc(e).replaceWith(doc(e).text());
    });
}
function cleanParagraphText(rawText) {
    const txt = rawText.trim();
    txt.replace(/[\s\t]+/g, ' ');
    return txt;
}
// Turn an html element (and children) into nicely formatted text
function convertToText(doc, topNode) {
    let txts = [];
    const nodes = topNode.contents();
    // To hold any text fragments that end up in text nodes outside of
    // html elements
    let hangingText = '';
    nodes.each(function (_, e) {
        let txt;
        const node = doc(e);
        const nodeType = node[0].type;
        const nodeName = node[0].name;
        // Handle top level text nodes by adding them to a running list
        // and then treating all the hanging nodes as one paragraph tag
        if (nodeType === 'text') {
            hangingText += node.text();
            // Same as 'continue'
            return true;
        }
        else if (nodeName === 'ul') {
            hangingText += ulToText(doc, node);
            return true;
        }
        // If we hit a real node and still have extra acculated text,
        // pop it out as if it was a paragraph tag
        if (hangingText.length > 0) {
            txt = cleanParagraphText(hangingText);
            txts = txts.concat(txt.split(/\r?\n/));
            hangingText = '';
        }
        txt = cleanParagraphText(node.text());
        txt = txt.replace(/(\w+\.)([A-Z]+)/, '$1 $2');
        return (txts = txts.concat(txt.split(/\r?\n/)));
    });
    // Catch any left-over hanging text nodes
    if (hangingText.length > 0) {
        const txt = cleanParagraphText(hangingText);
        txts = txts.concat(txt.split(/\r?\n/));
    }
    txts = map_1.default(txts, (txt) => txt.trim());
    // Make sure each text chunk includes at least one text character or number.
    // This supports multiple languages words using XRegExp to generate the
    // regex that matches wranges of unicode characters used in words.
    const regex = /[\d\w]/gu;
    txts = filter_1.default(txts, (txt) => {
        regex.lastIndex = 0;
        return regex.test(txt);
    });
    return txts.join('\n\n');
}
function addNewlineToBr(doc, topNode) {
    const brs = topNode.find('br');
    return brs.each(function (_, e) {
        const br = doc(e);
        return br.replaceWith('\n\n');
    });
}
// Remove nodes with a negative score because they are probably trash
function removeNegativescoresNodes(doc, topNode) {
    const gravityItems = topNode.find('*[gravityScore]');
    return gravityItems.each(function (_, e) {
        var _a, _b;
        const item = doc(e);
        const score = (_b = parseInt((_a = item.attr('gravityScore')) !== null && _a !== void 0 ? _a : '0')) !== null && _b !== void 0 ? _b : 0;
        if (score < 1) {
            return doc(item).remove();
        }
    });
}
// remove paragraphs that have less than x number of words,
// would indicate that it's some sort of link
function removeFewwordsParagraphs(doc, topNode, language) {
    const allNodes = topNode.find('*');
    return allNodes.each(function (_, e) {
        const el = doc(e);
        const tag = el[0].name;
        const text = el.text();
        const stopWords = stopwords_1.default(text, language);
        if ((tag !== 'br' || text !== '\\r') &&
            stopWords.stopwordCount < 3 &&
            el.find('object').length === 0 &&
            el.find('embed').length === 0) {
            return doc(el).remove();
        }
        else {
            const trimmed = text.trim();
            if (trimmed[0] === '(' && trimmed[trimmed.length - 1] === ')') {
                return doc(el).remove();
            }
        }
    });
}
//# sourceMappingURL=formatter.js.map