/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let stopwords
import each from 'lodash/each'
import { stopWordsData } from './stopwordsdata'

const cache = {}

// Given a language, loads a list of stop words for that language
// and then returns which of those words exist in the given content
export default stopwords = function (content: string, language: 'en' | 'es') {
  if (language == null) {
    language = 'en'
  }
  let stopWords = stopWordsData[language]

  if (!stopWords) {
    console.error(`WARNING: No stopwords file found for '${language}' - defaulting to English!`)
    stopWords = stopWordsData['en']
  }

  if (cache.hasOwnProperty(language)) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    stopWords = cache[language]
  } else {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cache[language] = stopWords
  }

  const strippedInput = removePunctuation(content)
  const words = candiateWords(strippedInput)
  const overlappingStopwords: any = []

  let count = 0

  each(words, function (w: any) {
    count += 1
    if (stopWords.indexOf(w.toLowerCase()) > -1) {
      return overlappingStopwords.push(w.toLowerCase())
    }
  })

  return {
    wordCount: count,
    stopwordCount: overlappingStopwords.length,
    stopWords: overlappingStopwords
  }
}

var removePunctuation = (content: string) => content.replace(/[\|\@\<\>\[\]\"\'\.,-\/#\?!$%\^&\*\+;:{}=\-_`~()]/g, '')

var candiateWords = (strippedInput: string) => strippedInput.split(' ')
