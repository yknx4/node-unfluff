/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'suite'. Do you need to install t... Remove this comment to see the full error message
suite('Cleaner', function() {
  const cleaner = require("../src/cleaner");
  const cheerio = require("cheerio");

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('exists', () => ok(cleaner));

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes body classes', function() {
    const html = fs.readFileSync("./fixtures/test_businessWeek1.html").toString();
    const origDoc = cheerio.load(html);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(origDoc("body").attr("class").trim(), "magazine");

    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("body").attr("class"), '');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes article attrs', function() {
    const html = fs.readFileSync("./fixtures/test_gizmodo1.html").toString();
    const origDoc = cheerio.load(html);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(origDoc("article").attr("class").trim(), "row post js_post_item status-published commented js_amazon_module");

    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("article").attr("class"), undefined);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes em tag from image-less ems', function() {
    const html = fs.readFileSync("./fixtures/test_gizmodo1.html").toString();
    const origDoc = cheerio.load(html);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(origDoc("em").length, 6);

    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("em").length, 0);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes scripts', function() {
    const html = fs.readFileSync("./fixtures/test_businessWeek1.html").toString();
    const origDoc = cheerio.load(html);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(origDoc("script").length, 40);

    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("script").length, 0);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes comments', function() {
    const html = fs.readFileSync("./fixtures/test_gizmodo1.html").toString();
    const origDoc = cheerio.load(html);
    let comments = origDoc('*').contents().filter(function() {
      
      return this.type === "comment";
    });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(comments.length, 15);

    const newDoc = cleaner(origDoc);
    comments = newDoc('*').contents().filter(function() {
      
      return this.type === "comment";
    });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(comments.length, 0);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('replaces childless divs with p tags', function() {
    const origDoc = cheerio.load("<html><body><div>text1</div></body></html>");
    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(newDoc("div").length, 0);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(newDoc("p").length, 1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("p").text(), "text1");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('replaces u tags with plain text', function() {
    const origDoc = cheerio.load("<html><body><u>text1</u></body></html>");
    const newDoc = cleaner(origDoc);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(newDoc("u").length, 0);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(newDoc("body").html(), "text1");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes divs by re (ex: /caption/)', function() {
    const html = fs.readFileSync("./fixtures/test_aolNews.html").toString();
    const origDoc = cheerio.load(html);
    let captions = origDoc('div.caption');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(captions.length, 1);

    const newDoc = cleaner(origDoc);
    captions = newDoc('div.caption');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(captions.length, 0);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes naughty elms by re (ex: /caption/)', function() {
    const html = fs.readFileSync("./fixtures/test_issue28.html").toString();
    const origDoc = cheerio.load(html);
    let naughty_els = origDoc('.retweet');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(naughty_els.length, 2);

    const newDoc = cleaner(origDoc);
    naughty_els = newDoc('.retweet');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(naughty_els.length, 0);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('removes trash line breaks that wouldn\'t be rendered by the browser', function() {
    const html = fs.readFileSync("./fixtures/test_sec1.html").toString();
    const origDoc = cheerio.load(html);
    const newDoc = cleaner(origDoc);

    const pEls = newDoc('p');
    const cleanedParaText = pEls[9].children[0].data;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(cleanedParaText.trim(), "“This transaction would not only strengthen our global presence, but also demonstrate our commitment to diversify and expand our U.S. commercial portfolio with meaningful new therapies,” said Russell Cox, executive vice president and chief operating officer of Jazz Pharmaceuticals plc. “We look forward to ongoing discussions with the FDA as we continue our efforts toward submission of an NDA for defibrotide in the U.S. Patients in the U.S. with severe VOD have a critical unmet medical need, and we believe that defibrotide has the potential to become an important treatment option for these patients.”");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  return test('inlines code blocks as test', function() {
    const html = fs.readFileSync("./fixtures/test_github1.html").toString();
    const origDoc = cheerio.load(html);
    let codeEls = origDoc('code');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(codeEls.length, 26);

    const newDoc = cleaner(origDoc);
    codeEls = newDoc('code');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(codeEls.length, 0);

    // This is a code block that should still be present in the doc after cleaning
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ok'.
    return ok(newDoc('body').text().indexOf("extractor = require('unfluff');") > 0);
  });
});
