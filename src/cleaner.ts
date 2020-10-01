/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import each from 'lodash/each'

export default function cleaner(doc: cheerio.Root) {
  removeBodyClasses(doc)
  cleanArticleTags(doc)
  cleanEmTags(doc)
  cleanCodeBlocks(doc)
  removeDropCaps(doc)
  removeScriptsStyles(doc)
  cleanBadTags(doc)
  removeNodesRegex(doc, /^caption$/)
  removeNodesRegex(doc, / google /)
  removeNodesRegex(doc, /^[^entry-]more.*$/)
  removeNodesRegex(doc, /[^-]facebook/)
  removeNodesRegex(doc, /facebook-broadcasting/)
  removeNodesRegex(doc, /[^-]twitter/)
  cleanParaSpans(doc)
  cleanUnderlines(doc)
  cleanErrantLinebreaks(doc)
  divToPara(doc, 'div')
  divToPara(doc, 'span')
  return doc
}

const removeBodyClasses = (doc: cheerio.Root) => doc('body').removeClass()

const cleanArticleTags = function (doc: cheerio.Root) {
  const articles = doc('article')
  return articles.each(function (_, e) {
    doc(e).removeAttr('id')

    doc(e).removeAttr('name')

    return doc(e).removeAttr('class')
  })
}

const cleanEmTags = function (doc: cheerio.Root) {
  const ems = doc('em')
  return ems.each(function (_, e) {
    const images = ems.find('img')
    if (images.length === 0) {
      return doc(e).replaceWith(doc(e).html() ?? '')
    }
  })
}

const cleanCodeBlocks = function (doc: cheerio.Root) {
  const nodes = doc("[class*='highlight-'], pre code, code, pre, ul.task-list")
  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).text())
  })
}

const removeDropCaps = function (doc: cheerio.Root) {
  const nodes = doc('span[class~=dropcap], span[class~=drop_cap]')
  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).html() ?? '')
  })
}

const removeScriptsStyles = function (doc: cheerio.Root) {
  doc('script').remove()
  doc('style').remove()

  const comments = doc('*')
    .contents()
    .filter(function (_, e) {
      return e.type === 'comment'
    })

  return doc(comments).remove()
}

const cleanBadTags = function (doc: cheerio.Root) {
  const removeNodesRe =
    '^side$|combx|retweet|mediaarticlerelated|menucontainer|navbar|partner-gravity-ad|video-full-transcript|storytopbar-bucket|utility-bar|inline-share-tools|comment|PopularQuestions|contact|foot|footer|Footer|footnote|cnn_strycaptiontxt|cnn_html_slideshow|cnn_strylftcntnt|links|meta$|shoutbox|sponsor|tags|socialnetworking|socialNetworking|cnnStryHghLght|cnn_stryspcvbx|^inset$|pagetools|post-attributes|welcome_form|contentTools2|the_answers|communitypromo|runaroundLeft|subscribe|vcard|articleheadings|date|^print$|popup|author-dropdown|tools|socialtools|byline|konafilter|KonaFilter|breadcrumbs|^fn$|wp-caption-text|legende|ajoutVideo|timestamp|js_replies'
  const re = new RegExp(removeNodesRe, 'gi')

  const toRemove = doc('*').filter(function (_, e) {
    re.lastIndex = 0
    const tCheerio = doc(e)
    const toMatch = [tCheerio.attr('id'), tCheerio.attr('class'), tCheerio.attr('name')].filter(
      (t) => t != null,
    ) as string[]
    return toMatch.some((t) => re.test(t))
  })

  return doc(toRemove).remove()
}

const removeNodesRegex = function (doc: cheerio.Root, pattern: RegExp) {
  const toRemove = doc('div').filter(function (_, e) {
    pattern.lastIndex = 0
    const tCheerio = doc(e)
    const toMatch = [tCheerio.attr('id'), tCheerio.attr('class')].filter((t) => t != null) as string[]
    return toMatch.some((t) => pattern.test(t))
  })

  return doc(toRemove).remove()
}

const cleanParaSpans = function (doc: cheerio.Root) {
  const nodes = doc('p span')
  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).html() ?? '')
  })
}

const cleanUnderlines = function (doc: cheerio.Root) {
  const nodes = doc('u')
  return nodes.each(function (_, e) {
    return doc(e).replaceWith(doc(e).html() ?? '')
  })
}

const getReplacementNodes = function (doc: cheerio.Root, div: cheerio.Cheerio) {
  let replacementText: string[] = []
  const nodesToReturn: string[] = []
  const nodesToRemove: cheerio.Cheerio[] = []
  const childs = div.contents()

  childs.each(function (_, e) {
    const kid = doc(e)

    // node is a p
    // and already have some replacement text
    if (kid[0].name === 'p' && replacementText.length > 0) {
      const txt = replacementText.join('')
      nodesToReturn.push(txt)
      replacementText = []
      return nodesToReturn.push(doc(kid).html() ?? '')

      // node is a text node
    } else if (kid[0].type === 'text') {
      const kidTextNode = kid
      const kidText = kid.text()
      const replaceText = kidText.replace(/\n/g, '\n\n').replace(/\t/g, '').replace(/^\s+$/g, '')

      if (replaceText.length > 1) {
        let outer
        let previousSiblingNode = kidTextNode.prev()

        while (previousSiblingNode[0]?.name === 'a' && previousSiblingNode.attr('grv-usedalready') !== 'yes') {
          outer = ' ' + doc.html(previousSiblingNode) + ' '
          replacementText.push(outer)
          nodesToRemove.push(previousSiblingNode)
          previousSiblingNode.attr('grv-usedalready', 'yes')
          previousSiblingNode = previousSiblingNode.prev()
        }

        replacementText.push(replaceText)

        let nextSiblingNode = kidTextNode.next()

        return (() => {
          const result = []
          while (nextSiblingNode[0]?.name === 'a' && nextSiblingNode.attr('grv-usedalready') !== 'yes') {
            outer = ' ' + doc.html(nextSiblingNode) + ' '
            replacementText.push(outer)
            nodesToRemove.push(nextSiblingNode)
            nextSiblingNode.attr('grv-usedalready', 'yes')
            result.push((nextSiblingNode = nextSiblingNode.next()))
          }
          return result
        })()
      }

      // otherwise
    } else {
      return nodesToReturn.push(doc(kid).html() ?? '')
    }
  })

  // flush out anything still remaining
  if (replacementText.length > 0) {
    const txt = replacementText.join('')
    nodesToReturn.push(txt)
    replacementText = []
  }

  each(nodesToRemove, (n: cheerio.Cheerio) => doc(n).remove())

  return nodesToReturn
}

const replaceWithPara = function (doc: cheerio.Root, div: cheerio.Element) {
  const divContent = doc(div).html()
  return doc(div).replaceWith(`<p>${divContent ?? ''}</p>`)
}

const divToPara = function (doc: cheerio.Root, domType: string) {
  const divs = doc(domType)
  const lastCount = divs.length + 1

  const tags = ['a', 'blockquote', 'dl', 'div', 'img', 'ol', 'p', 'pre', 'table', 'ul']

  return divs.each(function (_, e) {
    const div = doc(e)

    const items = div.find(tags.join(', '))

    if (items.length === 0) {
      return replaceWithPara(doc, e)
    } else {
      const replaceNodes = getReplacementNodes(doc, div)

      let html = ''
      each(replaceNodes, function (node: string) {
        if (node !== '') {
          return (html += `<p>${node}</p>`)
        }
      })

      div.empty()
      return doc(div).replaceWith(`${html}`)
    }
  })
}

// For plain text nodes directly inside of p tags that contain random single
// line breaks, remove those junky line breaks. They would never be rendered
// by a browser anyway.
const cleanErrantLinebreaks = (doc: cheerio.Root) =>
  doc('p').each(function (_, e) {
    const node = doc(e)
    const c = node.contents()

    return doc(c).each(function (_, e) {
      const n = doc(e)
      if (n[0].type === 'text') {
        return n.replaceWith(n.text().replace(/([^\n])\n([^\n])/g, '$1 $2'))
      }
    })
  })
