/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import each from 'lodash/each'
import { stopWordsData } from './stopwordsdata'

const cache: Record<string, string[]> = {}

// Given a language, loads a list of stop words for that language
// and then returns which of those words exist in the given content
export default function stopwords(content: string, language?: 'en' | 'es') {
  if (language == null) {
    language = 'en'
  }
  let stopWords = stopWordsData[language]

  if (stopWords === undefined) {
    console.error(`WARNING: No stopwords file found for '${language}' - defaulting to English!`)
    stopWords = stopWordsData.en
  }

  // eslint-disable-next-line no-prototype-builtins
  if (cache.hasOwnProperty(language)) {
    stopWords = cache[language]
  } else {
    cache[language] = stopWords
  }

  const strippedInput = removePunctuation(content)
  const words = candiateWords(strippedInput)
  const overlappingStopwords: string[] = []

  let count = 0

  each(words, function (w: string) {
    count += 1
    if (stopWords.includes(w.toLowerCase())) {
      return overlappingStopwords.push(w.toLowerCase())
    }
  })

  return {
    wordCount: count,
    stopwordCount: overlappingStopwords.length,
    stopWords: overlappingStopwords,
  }
}

function removePunctuation(content: string) {
  return content.replace(/[\|\@\<\>\[\]\"\'\.,-\/#\?!$%\^&\*\+;:{}=\-_`~()]/g, '')
}

function candiateWords(strippedInput: string) {
  return strippedInput.split(' ')
}
