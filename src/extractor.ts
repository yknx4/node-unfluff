/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter letiations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import each from 'lodash/each'
import uniq from 'lodash/uniq'
import stopwords from './stopwords'
import formatter from './formatter'
import { csLegacyGuard } from './__guard__'

export default {
  // Grab the date of an html doc
  date(doc: cheerio.Root) {
    const dateCandidates = doc(`meta[property='article:published_time'], \
meta[itemprop*='datePublished'], meta[name='dcterms.modified'], \
meta[name='dcterms.date'], \
meta[name='DC.date.issued'],  meta[name='dc.date.issued'], \
meta[name='dc.date.modified'], meta[name='dc.date.created'], \
meta[name='DC.date'], \
meta[name='DC.Date'], \
meta[name='dc.date'], \
meta[name='date'], \
time[itemprop*='pubDate'], \
time[itemprop*='pubdate'], \
span[itemprop*='datePublished'], \
span[property*='datePublished'], \
p[itemprop*='datePublished'], \
p[property*='datePublished'], \
div[itemprop*='datePublished'], \
div[property*='datePublished'], \
li[itemprop*='datePublished'], \
li[property*='datePublished'], \
time, \
span[class*='date'], \
p[class*='date'], \
div[class*='date']`)

    const firstCandidate = dateCandidates.first()
    const firstResult = firstCandidate.attr('content') ?? firstCandidate.attr('datetime') ?? firstCandidate.text()
    return firstResult.trim()
  },

  // Grab the copyright line
  copyright(doc: cheerio.Root) {
    const copyrightCandidates = doc(`p[class*='copyright'], div[class*='copyright'], span[class*='copyright'], li[class*='copyright'], \
p[id*='copyright'], div[id*='copyright'], span[id*='copyright'], li[id*='copyright']`)
    let text = csLegacyGuard(
      copyrightCandidates != null ? copyrightCandidates.first() : undefined,
      (x: cheerio.Cheerio) => x.text(),
    )
    if (text === undefined) {
      // try to find the copyright in the text
      text = doc('body')
        .text()
        .replace(/\s*[\r\n]+\s*/g, '. ')
      if (!(text.indexOf('©') > 0)) {
        return null
      }
    }
    const copyright = text.replace(/.*?©(\s*copyright)?([^,;:.|\r\n]+).*/gi, '$2').trim()
    return cleanText(copyright)
  },

  // Grab the author of an html doc
  author(doc: cheerio.Root) {
    const authorCandidates = doc(`meta[property='article:author'], \
meta[property='og:article:author'], meta[name='author'], \
meta[name='dcterms.creator'], \
meta[name='DC.creator'], \
meta[name='DC.Creator'], \
meta[name='dc.creator'], \
meta[name='creator']`)
    const authorList: string[] = []
    authorCandidates.each(function (_, e) {
      const author = doc(e).attr('content')
      if (author !== undefined) {
        return authorList.push(author.trim())
      }
    })
    // fallback to a named author div
    if (authorList.length === 0) {
      const fallbackAuthor =
        csLegacyGuard(doc("span[class*='author']").first(), (x: cheerio.Cheerio) => x.text()) ??
        csLegacyGuard(doc("p[class*='author']").first(), (x1: cheerio.Cheerio) => x1.text()) ??
        csLegacyGuard(doc("div[class*='author']").first(), (x2: cheerio.Cheerio) => x2.text()) ??
        csLegacyGuard(doc("span[class*='byline']").first(), (x3: cheerio.Cheerio) => x3.text()) ??
        csLegacyGuard(doc("p[class*='byline']").first(), (x4: cheerio.Cheerio) => x4.text()) ??
        csLegacyGuard(doc("div[class*='byline']").first(), (x5: cheerio.Cheerio) => x5.text())
      if (fallbackAuthor != null) {
        authorList.push(cleanText(fallbackAuthor))
      }
    }

    return authorList
  },

  // Grab the publisher of the page/site
  publisher(doc: cheerio.Root) {
    const publisherCandidates = doc(`meta[property='og:site_name'], \
meta[itemprop=name], \
meta[name='dc.publisher'], \
meta[name='DC.publisher'], \
meta[name='DC.Publisher']`)
    const firstCandidate = publisherCandidates.first()
    const candidateStr = firstCandidate.attr('content')
    return candidateStr != null ? candidateStr.trim() : null
  },

  // Grab the title of an html doc (excluding junk)
  // Hard-truncates titles containing colon or spaced dash
  title(doc: cheerio.Root) {
    const titleText = rawTitle(doc)
    return cleanTitle(titleText, ['|', ' - ', '»', ':'])
  },

  // Grab the title with soft truncation
  softTitle(doc: cheerio.Root) {
    const titleText = rawTitle(doc)
    return cleanTitle(titleText, ['|', ' - ', '»'])
  },

  // Grab the 'main' text chunk
  text(doc: cheerio.Root, topNode: cheerio.Cheerio | null | undefined, lang: 'es' | 'en') {
    if (topNode != null) {
      topNode = postCleanup(doc, topNode, lang)
      return formatter(doc, topNode, lang)
    } else {
      return ''
    }
  },

  // Grab an image for the page
  image(doc: cheerio.Root) {
    const images = doc(`meta[property='og:image'], \
meta[property='og:image:url'], \
meta[itemprop=image], \
meta[name='twitter:image:src'], \
meta[name='twitter:image'], \
meta[name='twitter:image0']`)

    if (images.length > 0) {
      return images.first().attr('content')
    }

    return null
  },

  // Find any links in the doc
  links(doc: cheerio.Root, topNode: cheerio.Cheerio, lang: 'es' | 'en') {
    const links: Array<{ text: string; href: any }> = []
    const gatherLinks = function (doc: cheerio.Root, topNode: cheerio.Cheerio) {
      const nodes = topNode.find('a')
      return nodes.each(function (_, e) {
        const href = doc(e).attr('href')

        const text = doc(e).html()
        if (href != null && text != null) {
          return links.push({
            text,
            href,
          })
        }
      })
    }

    if (topNode != null) {
      topNode = postCleanup(doc, topNode, lang)
      gatherLinks(doc, topNode)
    }
    return links
  },

  // Find any embedded videos in the doc
  videos(doc: cheerio.Root, topNode: cheerio.Cheerio) {
    const videoList: Array<{
      src: string | undefined
      height: string | undefined
      width: string | undefined
    } | null> = []
    const candidates = doc(topNode).find('iframe, embed, object, video')

    candidates.each(function (_, e) {
      const candidate = doc(e)
      const tag = candidate[0].name

      if (tag === 'embed') {
        if (candidate.parent() != null && candidate.parent()[0].name === 'object') {
          return videoList.push(getObjectTag(doc, candidate))
        } else {
          return videoList.push(getVideoAttrs(doc, candidate))
        }
      } else if (tag === 'object') {
        return videoList.push(getObjectTag(doc, candidate))
      } else if (tag === 'iframe' || tag === 'video') {
        return videoList.push(getVideoAttrs(doc, candidate))
      }
    })

    // Filter out junky or duplicate videos
    const urls: string[] = []
    const results: Array<{ src: string; height: string; width: string }> = []
    each(videoList, function (vid) {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (vid != null && vid.height != null && vid.width != null && vid.src != null && !urls.includes(vid.src)) {
        results.push(
          vid as {
            src: string
            height: string
            width: string
          },
        )
        return urls.push(vid.src)
      }
    })

    return results
  },

  // Grab the favicon from an html doc
  favicon(doc: cheerio.Root) {
    const tag = doc('link').filter(function (_, e) {
      return csLegacyGuard(doc(e).attr('rel'), (x: string) => x.toLowerCase()) === 'shortcut icon'
    })
    return tag.attr('href')
  },

  // Determine the language of an html doc
  lang(doc: cheerio.Root): 'es' | 'en' | null {
    // Check the <html> tag
    let l = csLegacyGuard(doc('html'), (x: cheerio.Cheerio) => x.attr('lang'))

    if (l == null) {
      // Otherwise look up for a content-language in meta
      const tag = doc('meta[name=lang]') ?? doc('meta[http-equiv=content-language]')
      l = tag != null ? tag.attr('content') : undefined
    }

    if (l != null) {
      // Just return the 2 letter ISO language code with no country
      const value = l.slice(0, 2)
      if (/^[A-Za-z]{2}$/.test(value)) {
        return value.toLowerCase() as 'en' | 'es'
      }
    }

    return null
  },

  // Get the meta description of an html doc
  description(doc: cheerio.Root) {
    const tag = doc("meta[name=description], meta[property='og:description']")
    const firstTag = tag.first()
    const tagContent = firstTag.attr('content')
    return tagContent != null ? tagContent.trim() : undefined
  },

  // Get the meta keywords of an html doc
  keywords(doc: cheerio.Root) {
    const tag = doc('meta[name=keywords]')
    return tag.attr('content')
  },

  // Get the canonical link of an html doc
  canonicalLink(doc: cheerio.Root) {
    const tag = doc('link[rel=canonical]')
    return tag.attr('href')
  },

  // Get any tags or keywords from an html doc
  tags(doc: cheerio.Root) {
    let elements = doc("a[rel='tag']")

    if (elements.length === 0) {
      elements = doc("a[href*='/tag/'], a[href*='/tags/'], a[href*='/topic/'], a[href*='?keyword=']")
      if (elements.length === 0) {
        return []
      }
    }

    const tags: string[] = []
    elements.each(function (_, e) {
      const el = doc(e)

      const tag = el.text().trim()
      tag.replace(/[\s\t\n]+/g, '')

      if (tag.length > 0) {
        return tags.push(tag)
      }
    })

    return uniq(tags)
  },

  // Walk the document's text nodes and find the most 'texty' node in the doc
  calculateBestNode(doc: cheerio.Root, lang: 'es' | 'en') {
    let topNode: cheerio.Cheerio | null = null
    const nodesToCheck = doc('p, pre, td')

    let startingBoost = 1.0
    let cnt = 0
    let i = 0
    const parentNodes: cheerio.Element[] = []
    const nodesWithText: cheerio.Cheerio[] = []

    // Walk all the p, pre and td nodes
    nodesToCheck.each(function (_, e) {
      const node = doc(e)

      const textNode = node.text()
      const wordStats = stopwords(textNode, lang)
      const highLinkDensity = isHighlinkDensity(doc, node)

      // If a node contains multiple common words and isn't just a bunch
      // of links, it's worth consideration of being 'texty'
      if (wordStats.stopwordCount > 2 && !highLinkDensity) {
        return nodesWithText.push(node)
      }
    })

    const nodesNumber = nodesWithText.length
    const negativeScoring = 0
    const bottomNegativescoreNodes = nodesNumber * 0.25

    // Walk all the potentially 'texty' nodes
    each(nodesWithText, function (node) {
      let boostScore = 0.0

      // If this node has nearby nodes that contain
      // some good text, give the node some boost points
      if (isBoostable(doc, node, lang)) {
        if (cnt >= 0) {
          boostScore = (1.0 / startingBoost) * 50
          startingBoost += 1
        }
      }

      if (nodesNumber > 15) {
        if (nodesNumber - i <= bottomNegativescoreNodes) {
          const booster = bottomNegativescoreNodes - (nodesNumber - i)
          boostScore = -1.0 * Math.pow(booster, 2)
          const negscore = Math.abs(boostScore) + negativeScoring

          if (negscore > 40) {
            boostScore = 5.0
          }
        }
      }

      // Give the current node a score of how many common words
      // it contains plus any boost
      const textNode = node.text()
      const wordStats = stopwords(textNode, lang)
      const upscore = Math.floor(wordStats.stopwordCount + boostScore)

      // Propigate the score upwards
      const parentNode = node.parent()
      updateScore(parentNode, upscore)
      updateNodeCount(parentNode, 1)

      if (!parentNodes.includes(parentNode[0])) {
        parentNodes.push(parentNode[0])
      }

      const parentParentNode = parentNode.parent()

      if (parentParentNode != null) {
        updateNodeCount(parentParentNode, 1)
        updateScore(parentParentNode, upscore / 2)

        if (!parentNodes.includes(parentParentNode[0])) {
          parentNodes.push(parentParentNode[0])
        }
      }

      cnt += 1
      return (i += 1)
    })

    let topNodeScore = 0

    // Walk each parent and parent-parent and find the one that
    // contains the highest sum score of 'texty' child nodes.
    // That's probably out best node!
    each(parentNodes, function (e: any) {
      const score = getScore(doc(e))

      if (score > topNodeScore) {
        topNode = e
        topNodeScore = score
      }

      if (topNode === null) {
        return (topNode = e)
      }
    })

    return doc(topNode)
  },
}

const getVideoAttrs = function (doc: cheerio.Root, node: any) {
  let data
  const el = doc(node)
  return (data = {
    src: el.attr('src'),
    height: el.attr('height'),
    width: el.attr('width'),
  })
}

const getObjectTag = function (doc: cheerio.Root, node: cheerio.Cheerio) {
  const srcNode = node.find('param[name=movie]')
  if (!(srcNode.length > 0)) {
    return null
  }

  const src = srcNode.attr('value')
  const video = getVideoAttrs(doc, node)
  video.src = src
  return video
}

// Find the biggest chunk of text in the title
const biggestTitleChunk = function (title: string, splitter: string) {
  let largeTextLength = 0
  let largeTextIndex = 0

  const titlePieces = title.split(splitter)

  // find the largest substring
  each(titlePieces, function (piece, i) {
    if (piece.length > largeTextLength) {
      largeTextLength = piece.length
      return (largeTextIndex = i)
    }
  })

  return titlePieces[largeTextIndex]
}

// Given a text node, check all previous siblings.
// If the sibling node looks 'texty' and isn't too many
// nodes away, it's probably some yummy text
const isBoostable = function (doc: cheerio.Root, node: cheerio.Cheerio, lang: 'es' | 'en') {
  let stepsAway = 0
  const minimumStopwordCount = 5
  const maxStepsawayFromNode = 3

  const nodes = node.prevAll()

  let boostable = false

  nodes.each(function (_, e) {
    const currentNode = doc(e)
    const currentNodeTag = currentNode[0].name

    if (currentNodeTag === 'p') {
      // Make sure the node isn't more than 3 hops away
      if (stepsAway >= maxStepsawayFromNode) {
        boostable = false
        return false
      }

      const paraText = currentNode.text()
      const wordStats = stopwords(paraText, lang)

      // Check if the node contains more than 5 common words
      if (wordStats.stopwordCount > minimumStopwordCount) {
        boostable = true
        return false
      }

      return (stepsAway += 1)
    }
  })

  return boostable
}

const addSiblings = function (doc: cheerio.Root, topNode: cheerio.Cheerio, lang: 'es' | 'en') {
  const baselinescoreSiblingsPara = getSiblingsScore(doc, topNode, lang)
  const sibs = topNode.prevAll()

  sibs.each(function (_, e) {
    const currentNode = doc(e)
    const ps = getSiblingsContent(doc, lang, currentNode, baselinescoreSiblingsPara)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-base-to-string
    return each(ps, (p) => topNode.prepend(`<p>${p}</p>`))
  })
  return topNode
}

const getSiblingsContent = function (
  doc: cheerio.Root,
  lang: 'es' | 'en',
  currentSibling: cheerio.Cheerio,
  baselinescoreSiblingsPara: number,
) {
  if (currentSibling[0].name === 'p' && currentSibling.text().length > 0) {
    return [currentSibling]
  } else {
    const potentialParagraphs = currentSibling.find('p')
    if (potentialParagraphs === null) {
      return null
    } else {
      const ps: string[] = []
      potentialParagraphs.each(function (_, e) {
        const firstParagraph = doc(e)
        const txt = firstParagraph.text()

        if (txt.length > 0) {
          const wordStats = stopwords(txt, lang)
          const paragraphScore = wordStats.stopwordCount
          const siblingBaselineScore = 0.3
          const highLinkDensity = isHighlinkDensity(doc, firstParagraph)
          const score = baselinescoreSiblingsPara * siblingBaselineScore

          if (score < paragraphScore && !highLinkDensity) {
            return ps.push(txt)
          }
        }
      })

      return ps
    }
  }
}

const getSiblingsScore = function (doc: cheerio.Root, topNode: cheerio.Cheerio, lang: 'es' | 'en') {
  let base = 100000
  let paragraphsNumber = 0
  let paragraphsScore = 0
  const nodesToCheck = topNode.find('p')

  nodesToCheck.each(function (_, e) {
    const node = doc(e)
    const textNode = node.text()
    const wordStats = stopwords(textNode, lang)
    const highLinkDensity = isHighlinkDensity(doc, node)

    if (wordStats.stopwordCount > 2 && !highLinkDensity) {
      paragraphsNumber += 1
      return (paragraphsScore += wordStats.stopwordCount)
    }
  })

  if (paragraphsNumber > 0) {
    base = paragraphsScore / paragraphsNumber
  }

  return base
}

// Keep track of a node's score with a gravityScore attribute
const updateScore = function (node: cheerio.Cheerio, addToScore: number) {
  let currentScore = 0
  const scoreString = node.attr('gravityScore')
  if (scoreString !== undefined) {
    currentScore = parseInt(scoreString)
  }

  const newScore = currentScore + addToScore
  return node.attr('gravityScore', newScore.toString())
}

// Keep track of # of 'texty' child nodes under this node with
// graveityNodes attribute
const updateNodeCount = function (node: cheerio.Cheerio, addToCount: number) {
  let currentScore = 0
  const countString = node.attr('gravityNodes')
  if (countString !== undefined) {
    currentScore = parseInt(countString)
  }

  const newScore = currentScore + addToCount
  return node.attr('gravityNodes', newScore.toString())
}

// Check the ratio of links to words in a node.
// If the ratio is high, this node is probably trash.
const isHighlinkDensity = function (doc: cheerio.Root, node: cheerio.Cheerio) {
  const links = node.find('a')
  if (!(links.length > 0)) {
    return false
  }

  const txt = node.text()
  const words = txt.split(' ')
  const numberOfWords = words.length

  const sb: any = []
  links.each(function (_, e) {
    return sb.push(doc(e).text())
  })

  const linkText = sb.join(' ')
  const linkWords = linkText.split(' ')
  const numberOfLinkWords = linkWords.length
  const numberOfLinks = links.length
  const percentLinkWords = numberOfLinkWords / numberOfWords
  const score = percentLinkWords * numberOfLinks

  return score >= 1.0
}

// Return a node's gravity score (amount of texty-ness under it)
const getScore = function (node: cheerio.Cheerio) {
  const grvScoreString = node.attr('gravityScore')
  if (grvScoreString === undefined) {
    return 0
  } else {
    return parseInt(grvScoreString)
  }
}

const isTableAndNoParaExist = function (doc: cheerio.Root, e: any) {
  const subParagraphs = e.find('p')

  subParagraphs.each(function (_: any, e: any) {
    const p = doc(e)
    const txt = p.text()

    if (txt.length < 25) {
      return doc(p).remove()
    }
  })

  const subParagraphs2 = e.find('p')
  if (subParagraphs2.length === 0 && !['td', 'ul', 'ol'].includes(e[0].name)) {
    return true
  } else {
    return false
  }
}

const isNodescoreThresholdMet = function (doc: cheerio.Root, node: any, e: any) {
  const topNodeScore = getScore(node)
  const currentNodeScore = getScore(e)
  const thresholdScore = topNodeScore * 0.08

  if (currentNodeScore < thresholdScore && !['td', 'ul', 'ol', 'blockquote'].includes(e[0].name)) {
    return false
  } else {
    return true
  }
}

// Remove any remaining trash nodes (clusters of nodes with little/no content)
const postCleanup = function (doc: cheerio.Root, targetNode: any, lang: 'es' | 'en') {
  const node = addSiblings(doc, targetNode, lang)

  node.children().each(function (_, el) {
    const e = doc(el)
    const eTag = e[0].name
    if (!['p', 'a'].includes(eTag)) {
      if (isHighlinkDensity(doc, e) || isTableAndNoParaExist(doc, e) || !isNodescoreThresholdMet(doc, node, e)) {
        return doc(e).remove()
      }
    }
  })

  return node
}
function cleanNull(text: string): string
function cleanNull(text: null | undefined): undefined
function cleanNull(text: string | null | undefined) {
  return text != null ? text.replace(/^null$/g, '') : undefined
}

function cleanText(text: string): string
function cleanText(text: null | undefined): undefined
function cleanText(text: any) {
  return typeof text === 'string'
    ? text
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/<!--.+?-->/g, '')
        .replace(/�/g, '')
        .trim()
    : undefined
}

const cleanTitle = function (title: string | null | undefined, delimiters: string[]) {
  let titleText = title ?? ''
  let usedDelimeter = false
  each(delimiters, function (c: any) {
    if (titleText.includes(c) && !usedDelimeter) {
      titleText = biggestTitleChunk(titleText, c)
      return (usedDelimeter = true)
    }
  })
  return cleanText(titleText)
}

const rawTitle = function (doc: cheerio.Root) {
  let gotTitle = false
  let titleText = ''
  // The first h1 or h2 is a useful fallback
  each(
    [
      csLegacyGuard(
        csLegacyGuard(doc("meta[property='og:title']"), (x1: cheerio.Cheerio) => x1.first()),
        (x: cheerio.Cheerio) => x.attr('content'),
      ),
      csLegacyGuard(
        csLegacyGuard(doc("h1[class*='title']"), (x3: cheerio.Cheerio) => x3.first()),
        (x2: cheerio.Cheerio) => x2.text(),
      ),
      csLegacyGuard(
        csLegacyGuard(doc('title'), (x5: cheerio.Cheerio) => x5.first()),
        (x4: cheerio.Cheerio) => x4.text(),
      ),
      csLegacyGuard(
        csLegacyGuard(doc('h1'), (x7: cheerio.Cheerio) => x7.first()),
        (x6: cheerio.Cheerio) => x6.text(),
      ),
      csLegacyGuard(
        csLegacyGuard(doc('h2'), (x9: cheerio.Cheerio) => x9.first()),
        (x8: cheerio.Cheerio) => x8.text(),
      ),
    ],
    function (candidate: string | undefined) {
      if (candidate !== undefined && !gotTitle) {
        titleText = candidate.trim()
        return (gotTitle = true)
      }
    },
  )

  return titleText
}
