/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import stopwords from './stopwords'
import map from 'lodash/map'
import filter from 'lodash/filter'

export default function formatter(doc: cheerio.Root, topNode: cheerio.Cheerio, language: 'en' | 'es') {
  removeNegativescoresNodes(doc, topNode)
  linksToText(doc, topNode)
  addNewlineToBr(doc, topNode)
  replaceWithText(doc, topNode)
  removeFewwordsParagraphs(doc, topNode, language)
  return convertToText(doc, topNode)
}

function linksToText(doc: cheerio.Root, topNode: cheerio.Cheerio) {
  const nodes = topNode.find('a')

  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).html() ?? '')
  })
}

function ulToText(doc: cheerio.Root, node: cheerio.Cheerio) {
  const nodes = node.find('li')
  let txt = ''

  nodes.each(function (_, e) {
    return (txt = txt + `\n * ${doc(e).text()}`)
  })

  txt = txt + '\n'
  return txt
}

function replaceWithText(doc: cheerio.Root, topNode: cheerio.Cheerio) {
  const nodes = topNode.find('b, strong, i, br, sup')
  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).text())
  })
}

function cleanParagraphText(rawText: string) {
  const txt = rawText.trim()
  txt.replace(/[\s\t]+/g, ' ')
  return txt
}

// Turn an html element (and children) into nicely formatted text
function convertToText(doc: cheerio.Root, topNode: cheerio.Cheerio) {
  let txts: any = []
  const nodes = topNode.contents()

  // To hold any text fragments that end up in text nodes outside of
  // html elements
  let hangingText = ''

  nodes.each(function (_, e) {
    let txt
    const node = doc(e)
    const nodeType = node[0].type
    const nodeName = node[0].name

    // Handle top level text nodes by adding them to a running list
    // and then treating all the hanging nodes as one paragraph tag
    if (nodeType === 'text') {
      hangingText += node.text()
      // Same as 'continue'
      return true
    } else if (nodeName === 'ul') {
      hangingText += ulToText(doc, node)
      return true
    }

    // If we hit a real node and still have extra acculated text,
    // pop it out as if it was a paragraph tag
    if (hangingText.length > 0) {
      txt = cleanParagraphText(hangingText)
      txts = txts.concat(txt.split(/\r?\n/))
      hangingText = ''
    }

    txt = cleanParagraphText(node.text())
    txt = txt.replace(/(\w+\.)([A-Z]+)/, '$1 $2')
    return (txts = txts.concat(txt.split(/\r?\n/)))
  })

  // Catch any left-over hanging text nodes
  if (hangingText.length > 0) {
    const txt = cleanParagraphText(hangingText)
    txts = txts.concat(txt.split(/\r?\n/))
  }

  txts = map(txts, (txt: any) => txt.trim())

  // Make sure each text chunk includes at least one text character or number.
  // This supports multiple languages words using XRegExp to generate the
  // regex that matches wranges of unicode characters used in words.
  const regex = /[\d\w]/gu
  txts = filter(txts, (txt: any) => regex.test(txt))

  return txts.join('\n\n')
}

function addNewlineToBr(doc: cheerio.Root, topNode: cheerio.Cheerio) {
  const brs = topNode.find('br')
  return brs.each(function (_, e) {
    const br = doc(e)
    return br.replaceWith('\n\n')
  })
}

// Remove nodes with a negative score because they are probably trash
function removeNegativescoresNodes(doc: cheerio.Root, topNode: cheerio.Cheerio) {
  const gravityItems = topNode.find('*[gravityScore]')

  return gravityItems.each(function (_, e) {
    const item = doc(e)
    const score = parseInt(item.attr('gravityScore') ?? '0') ?? 0

    if (score < 1) {
      return doc(item).remove()
    }
  })
}

// remove paragraphs that have less than x number of words,
// would indicate that it's some sort of link
function removeFewwordsParagraphs(doc: cheerio.Root, topNode: cheerio.Cheerio, language: 'en' | 'es') {
  const allNodes = topNode.find('*')

  return allNodes.each(function (_, e) {
    const el = doc(e)
    const tag = el[0].name
    const text = el.text()

    const stopWords = stopwords(text, language)
    if (
      (tag !== 'br' || text !== '\\r') &&
      stopWords.stopwordCount < 3 &&
      el.find('object').length === 0 &&
      el.find('embed').length === 0
    ) {
      return doc(el).remove()
    } else {
      const trimmed = text.trim()
      if (trimmed[0] === '(' && trimmed[trimmed.length - 1] === ')') {
        return doc(el).remove()
      }
    }
  })
}
