/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'suite'. Do you need to install t... Remove this comment to see the full error message
suite('Stop words', function() {
  const stopwords = require('../src/stopwords');

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('exists', function() {
    const s = stopwords;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ok'.
    return ok(s);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('counts stopwords', function() {
    const data = stopwords('this is silly', 'en');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.wordCount, 3);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.stopwordCount, 2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'arrayEq'.
    return arrayEq(data.stopWords, [ 'this', 'is' ]);
});

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('strips punctuation', function() {
    const data = stopwords('this! is?? silly....', 'en');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.wordCount, 3);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.stopwordCount, 2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'arrayEq'.
    return arrayEq(data.stopWords, [ 'this', 'is' ]);
});

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('defaults to english', function() {
    const data = stopwords('this is fun');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.wordCount, 3);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.stopwordCount, 2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'arrayEq'.
    return arrayEq(data.stopWords, [ 'this', 'is' ]);
});

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('handles spanish', function() {
    const data = stopwords('este es rico', 'es');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.wordCount, 3);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.stopwordCount, 2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'arrayEq'.
    return arrayEq(data.stopWords, [ 'este', 'es' ]);
});

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  return test('Safely handles a bad language by falling back to english', function() {
    const data = stopwords('this is fun', 'fake-language-to-test-fallbacks');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.wordCount, 3);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'eq'.
    eq(data.stopwordCount, 2);
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'arrayEq'. Did you mean 'Array'?
    return arrayEq(data.stopWords, [ 'this', 'is' ]);
});
});
