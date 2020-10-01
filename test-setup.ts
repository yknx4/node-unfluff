/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const util = require('util');
const fs = require('fs');
const deepEqual = require('deep-equal');

const object = require('assert');
// @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
for (let name in object) { const func = object[name]; global[name] = func; }

// See http://wiki.ecmascript.org/doku.php?id=harmony:egal
const egal = function(a: any, b: any) {
  if (a === b) {
    return (a !== 0) || ((1/a) === (1/b));
  } else {
    return (a !== a) && (b !== b);
  }
};

// A recursive functional equivalence helper; uses egal for testing equivalence.
var arrayEgal = function(a: any, b: any) {
  if (egal(a, b)) { return true;
  } else if ((Array.isArray(a)) && Array.isArray(b)) {
    if (a.length !== b.length) { return false; }
    for (let idx = 0; idx < a.length; idx++) { const el = a[idx]; if (!arrayEgal(el, b[idx])) { return false; } }
    return true;
  }
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'inspect' does not exist on type 'Global ... Remove this comment to see the full error message
global.inspect = (o: any) => util.inspect(o, false, 2, true);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'eq' does not exist on type 'Global & typ... Remove this comment to see the full error message
global.eq      = (a: any, b: any, msg: any) => ok(egal(a, b), msg != null ? msg : `${inspect(a)} === ${inspect(b)}`);
// @ts-expect-error ts-migrate(2551) FIXME: Property 'arrayEq' does not exist on type 'Global ... Remove this comment to see the full error message
global.arrayEq = (a: any, b: any, msg: any) => ok(arrayEgal(a, b), msg != null ? msg : `${inspect(a)} === ${inspect(b)}`);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'deepEq' does not exist on type 'Global &... Remove this comment to see the full error message
global.deepEq  = (a: any, b: any, msg: any) => ok(deepEqual(a, b), msg != null ? msg : `${inspect(a)} === ${inspect(b)}`);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Global & typ... Remove this comment to see the full error message
global.fs = fs;

const object1 = require('./');
// @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
for (let k of Object.keys(object1 || {})) { const v = object1[k]; global[k] = v; }
