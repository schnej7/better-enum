"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BetterEnum {
    static _registry = new Map();
    constructor(..._) {
        const subclass = new.target;
        // Delay execution so all static fields are initialized
        queueMicrotask(() => {
            const subclassRegistry = BetterEnum.initSubclassRegistry(subclass);
            for (const [key, value] of Object.entries(subclass)) {
                if (value === this && !subclassRegistry.forward.has(key)) {
                    subclassRegistry.forward.set(key, this);
                    subclassRegistry.reverse.set(this, key);
                    break;
                }
            }
        });
    }
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
