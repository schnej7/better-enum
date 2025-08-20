"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterEnum = RegisterEnum;
/**
 * Class decorator that automatically registers enum instances after class definition is complete.
 * This eliminates the need for queueMicrotask in the constructor.
 */
function RegisterEnum(constructor) {
    // Register all static enum instances immediately after class definition
    const subclassRegistry = BetterEnum.initSubclassRegistry(constructor);
    for (const [key, value] of Object.entries(constructor)) {
        if (value instanceof BetterEnum && !subclassRegistry.forward.has(key)) {
            subclassRegistry.forward.set(key, value);
            subclassRegistry.reverse.set(value, key);
        }
    }
    return constructor;
}
class BetterEnum {
    static _registry = new Map();
    toString() {
        const subclassRegistry = this.constructor.getSubclassRegistry();
        if (subclassRegistry) {
            const str = subclassRegistry.reverse.get(this);
            if (str)
                return str;
            throw new Error(`this (${this}) not found in subclassRegistry`);
        }
        throw new Error(`subclassRegistry not found`);
    }
    static fromString(key) {
        return this.getSubclassRegistry()?.forward.get(key);
    }
    static values() {
        return [...(this.getSubclassRegistry()?.forward.values() ?? [])];
    }
    static getSubclassRegistry() {
        return this._registry.get(this);
    }
    static initSubclassRegistry(subclass) {
        let subclassRegistry = BetterEnum._registry.get(subclass);
        if (!subclassRegistry) {
            subclassRegistry = {
                forward: new Map(),
                reverse: new Map(),
            };
            BetterEnum._registry.set(subclass, subclassRegistry);
        }
        return subclassRegistry;
    }
}
exports.default = BetterEnum;
