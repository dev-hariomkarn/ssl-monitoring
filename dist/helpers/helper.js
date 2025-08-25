"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readableDate = void 0;
const readableDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
exports.readableDate = readableDate;
