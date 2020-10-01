/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let cleaner;
import each from "lodash/each";

export default cleaner = function(doc: any) {
  removeBodyClasses(doc);
  cleanArticleTags(doc);
  cleanEmTags(doc);
  cleanCodeBlocks(doc);
  removeDropCaps(doc);
  removeScriptsStyles(doc);
  cleanBadTags(doc);
  removeNodesRegex(doc, /^caption$/);
  removeNodesRegex(doc, / google /);
  removeNodesRegex(doc, /^[^entry-]more.*$/);
  removeNodesRegex(doc, /[^-]facebook/);
  removeNodesRegex(doc, /facebook-broadcasting/);
  removeNodesRegex(doc, /[^-]twitter/);
  cleanParaSpans(doc);
  cleanUnderlines(doc);
  cleanErrantLinebreaks(doc);
  divToPara(doc, 'div');
  divToPara(doc, 'span');
  return doc;
};

var removeBodyClasses = (doc: any) => doc("body").removeClass();

var cleanArticleTags = function(doc: any) {
  const articles = doc("article");
  return articles.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    doc(this).removeAttr('id');
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    doc(this).removeAttr('name');
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return doc(this).removeAttr('class');
  });
};

var cleanEmTags = function(doc: any) {
  const ems = doc("em");
  return ems.each(function() {
    const images = ems.find("img");
    if (images.length === 0) {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      return doc(this).replaceWith(doc(this).html());
    }
  });
};

var cleanCodeBlocks = function(doc: any) {
  const nodes = doc("[class*='highlight-'], pre code, code, pre, ul.task-list");
  return nodes.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return doc(this).replaceWith(doc(this).text());
  });
};

var removeDropCaps = function(doc: any) {
  const nodes = doc("span[class~=dropcap], span[class~=drop_cap]");
  return nodes.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return doc(this).replaceWith(doc(this).html());
  });
};

var removeScriptsStyles = function(doc: any) {
  doc("script").remove();
  doc("style").remove();

  const comments = doc('*').contents().filter(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return this.type === "comment";
  });

  return doc(comments).remove();
};

var cleanBadTags = function(doc: any) {
  const removeNodesRe = "^side$|combx|retweet|mediaarticlerelated|menucontainer|navbar|partner-gravity-ad|video-full-transcript|storytopbar-bucket|utility-bar|inline-share-tools|comment|PopularQuestions|contact|foot|footer|Footer|footnote|cnn_strycaptiontxt|cnn_html_slideshow|cnn_strylftcntnt|links|meta$|shoutbox|sponsor|tags|socialnetworking|socialNetworking|cnnStryHghLght|cnn_stryspcvbx|^inset$|pagetools|post-attributes|welcome_form|contentTools2|the_answers|communitypromo|runaroundLeft|subscribe|vcard|articleheadings|date|^print$|popup|author-dropdown|tools|socialtools|byline|konafilter|KonaFilter|breadcrumbs|^fn$|wp-caption-text|legende|ajoutVideo|timestamp|js_replies";
  const re = new RegExp(removeNodesRe, "i");

  const toRemove = doc('*').filter(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return __guard__(doc(this).attr('id'), (x: any) => x.match(re)) || __guard__(doc(this).attr('class'), (x1: any) => x1.match(re)) || __guard__(doc(this).attr('name'), (x2: any) => x2.match(re));
  });

  return doc(toRemove).remove();
};

var removeNodesRegex = function(doc: any, pattern: any) {
  const toRemove = doc('div').filter(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return __guard__(doc(this).attr('id'), (x: any) => x.match(pattern)) || __guard__(doc(this).attr('class'), (x1: any) => x1.match(pattern));
  });

  return doc(toRemove).remove();
};

var cleanParaSpans = function(doc: any) {
  const nodes = doc("p span");
  return nodes.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return doc(this).replaceWith(doc(this).html());
  });
};

var cleanUnderlines = function(doc: any) {
  const nodes = doc("u");
  return nodes.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return doc(this).replaceWith(doc(this).html());
  });
};

const getReplacementNodes = function(doc: any, div: any) {
  let replacementText: any = [];
  const nodesToReturn = [];
  const nodesToRemove: any = [];
  const childs = div.contents();

  childs.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    const kid = doc(this);

    // node is a p
    // and already have some replacement text
    if ((kid[0].name === 'p') && (replacementText.length > 0)) {
      const txt = replacementText.join('');
      nodesToReturn.push(txt);
      replacementText = [];
      return nodesToReturn.push(doc(kid).html());

    // node is a text node
    } else if (kid[0].type === 'text') {
      const kidTextNode = kid;
      const kidText = kid.text();
      const replaceText = kidText.replace(/\n/g, "\n\n").replace(/\t/g, "").replace(/^\s+$/g, "");

      if((replaceText.length) > 1) {
        let outer;
        let previousSiblingNode = kidTextNode.prev();

        while (previousSiblingNode[0] && (previousSiblingNode[0].name === "a") && (previousSiblingNode.attr('grv-usedalready') !== 'yes')) {
          outer = " " + doc.html(previousSiblingNode) + " ";
          replacementText.push(outer);
          nodesToRemove.push(previousSiblingNode);
          previousSiblingNode.attr('grv-usedalready', 'yes');
          previousSiblingNode = previousSiblingNode.prev();
        }

        replacementText.push(replaceText);

        let nextSiblingNode = kidTextNode.next();

        return (() => {
          const result = [];
          while (nextSiblingNode[0] && (nextSiblingNode[0].name === "a") && (nextSiblingNode.attr('grv-usedalready') !== 'yes')) {
            outer = " " + doc.html(nextSiblingNode) + " ";
            replacementText.push(outer);
            nodesToRemove.push(nextSiblingNode);
            nextSiblingNode.attr('grv-usedalready', 'yes');
            result.push(nextSiblingNode = nextSiblingNode.next());
          }
          return result;
        })();
      }

    // otherwise
    } else {
      return nodesToReturn.push(doc(kid).html());
    }
  });

  // flush out anything still remaining
  if (replacementText.length > 0) {
    const txt = replacementText.join('');
    nodesToReturn.push(txt);
    replacementText = [];
  }

  each(nodesToRemove, (n: any) => doc(n).remove());

  return nodesToReturn;
};

const replaceWithPara = function(doc: any, div: any) {
  const divContent = doc(div).html();
  return doc(div).replaceWith(`<p>${divContent}</p>`);
};

var divToPara = function(doc: any, domType: any) {
  const divs = doc(domType);
  const lastCount = divs.length + 1;

  const tags = ['a', 'blockquote', 'dl', 'div', 'img', 'ol', 'p', 'pre', 'table', 'ul'];

  return divs.each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    const div = doc(this);

    const items = div.find(tags.join(", "));

    if (items.length === 0) {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      return replaceWithPara(doc, this);
    } else {
      const replaceNodes = getReplacementNodes(doc, div);

      let html = "";
      each(replaceNodes, function(node: any) {
        if (node !== '') {
          return html += `<p>${node}</p>`;
        }
      });

      div.empty();
      return doc(div).replaceWith(`${html}`);
    }
  });
};

// For plain text nodes directly inside of p tags that contain random single
// line breaks, remove those junky line breaks. They would never be rendered
// by a browser anyway.
var cleanErrantLinebreaks = (doc: any) => doc("p").each(function() {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  const node = doc(this);
  const c = node.contents();

  return doc(c).each(function() {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    const n = doc(this);
    if (n[0].type === 'text') {
      return n.replaceWith(n.text().replace(/([^\n])\n([^\n])/g, "$1 $2"));
    }
  });
});