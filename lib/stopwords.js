"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const each_1 = __importDefault(require("lodash/each"));
const stopwordsdata_1 = require("./stopwordsdata");
const cache = {};
// Given a language, loads a list of stop words for that language
// and then returns which of those words exist in the given content
function stopwords(content, language) {
    if (language == null) {
        language = 'en';
    }
    let stopWords = stopwordsdata_1.stopWordsData[language];
    if (stopWords === undefined) {
        console.error(`WARNING: No stopwords file found for '${language}' - defaulting to English!`);
        stopWords = stopwordsdata_1.stopWordsData.en;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (cache.hasOwnProperty(language)) {
        stopWords = cache[language];
    }
    else {
        cache[language] = stopWords;
    }
    const strippedInput = removePunctuation(content);
    const words = candiateWords(strippedInput);
    const overlappingStopwords = [];
    let count = 0;
    each_1.default(words, function (w) {
        count += 1;
        if (stopWords.includes(w.toLowerCase())) {
            return overlappingStopwords.push(w.toLowerCase());
        }
    });
    return {
        wordCount: count,
        stopwordCount: overlappingStopwords.length,
        stopWords: overlappingStopwords,
    };
}
exports.default = stopwords;
function removePunctuation(content) {
    return content.replace(/[\|\@\<\>\[\]\"\'\.,-\/#\?!$%\^&\*\+;:{}=\-_`~()]/g, '');
}
function candiateWords(strippedInput) {
    return strippedInput.split(' ');
}
//# sourceMappingURL=stopwords.js.map