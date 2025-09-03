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
    let registeredCount = 0;
    for (const [key, value] of Object.entries(constructor)) {
        if (value instanceof BetterEnum && !subclassRegistry.forward.has(key)) {
            subclassRegistry.forward.set(key, value);
            subclassRegistry.reverse.set(value, key);
            registeredCount++;
        }
    }
    if (registeredCount === 0) {
        console.warn(`No enum instances found for ${constructor.name}. Make sure static instances are defined.`);
    }
    return constructor;
}
class BetterEnum {
    static _registry = new Map();
    toString() {
        const EnumClass = this.constructor;
        const subclassRegistry = EnumClass.getSubclassRegistry();
        if (subclassRegistry) {
            const str = subclassRegistry.reverse.get(this);
            if (str)
                return str;
            throw new Error(`Enum instance not found in registry: ${this.constructor.name}`);
        }
        throw new Error(`Registry not found for enum class: ${this.constructor.name}`);
    }
    static fromString(key) {
        const registry = this.getSubclassRegistry();
        return registry ? registry.forward.get(key) : undefined;
    }
    static values() {
        const registry = this.getSubclassRegistry();
        return registry ? [...registry.forward.values()] : [];
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
