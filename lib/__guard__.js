"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csLegacyGuard = void 0;
function csLegacyGuard(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
exports.csLegacyGuard = csLegacyGuard;
//# sourceMappingURL=__guard__.js.map