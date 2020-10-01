/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import formatter from '../src/formatter'
import cheerio from 'cheerio'
// @dummy-directive ts-migrate(2582) FIXME: Cannot find name 'suite'. Do you need to install t... Remove this comment to see the full error message
suite('Formatter', function () {
  // @dummy-directive ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('exists', () => ok(formatter))

  // @dummy-directive ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('replaces links with plain text', function () {
    const html = fs.readFileSync('./fixtures/test_businessWeek1.html').toString()
    const origDoc = cheerio.load(html, { normalizeWhitespace: true })

    // @dummy ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(origDoc('a').length, 223)

    formatter(origDoc, origDoc('body'), 'en')
    // @dummy ts-migrate(2304) FIXME: Cannot find name 'eq'.
    return eq(origDoc('a').length, 0)
  })

  // @dummy-directive ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  return test("doesn't drop text nodes accidentally", function () {
    let html = fs.readFileSync('./fixtures/test_wikipedia1.html').toString()
    const doc = cheerio.load(html)

    formatter(doc, doc('body'), 'en')
    html = doc.html()
    // This text was getting dropped by the formatter
    // @dummy ts-migrate(2304) FIXME: Cannot find name 'ok'.
    return ok(/is a thirteen episode anime series directed by Akitaro Daichi and written by Hideyuki Kurata/.test(html))
  })
})
