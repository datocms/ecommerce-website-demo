"use strict";

if (typeof globalThis !== "undefined" && typeof globalThis.DOMException !== "undefined") {
	module.exports = globalThis.DOMException;
} else {
	class SimpleDOMException extends Error {
		constructor(message, name) {
			super(message);
			this.name = name || "DOMException";
		}
	}
	module.exports = SimpleDOMException;
}
