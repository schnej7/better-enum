type SubclassRegistry = {
  forward: Map<string, BetterEnum>;
  reverse: Map<BetterEnum, string>;
};

/**
 * Class decorator that automatically registers enum instances after class definition is complete.
 * This eliminates the need for queueMicrotask in the constructor.
 */
export function RegisterEnum<T extends new (...args: any[]) => BetterEnum>(constructor: T): T {
  // Register all static enum instances immediately after class definition
  const subclassRegistry = BetterEnum.initSubclassRegistry(constructor as any);
  
  for (const [key, value] of Object.entries(constructor)) {
    if (value instanceof BetterEnum && !subclassRegistry.forward.has(key)) {
      subclassRegistry.forward.set(key, value);
      subclassRegistry.reverse.set(value, key);
    }
  }
  
  return constructor;
}

export default abstract class BetterEnum {
  private static _registry = new Map<Function, SubclassRegistry>();

  toString(): string {
    const subclassRegistry = (this.constructor as typeof BetterEnum).getSubclassRegistry();
    if (subclassRegistry) {
      const str = subclassRegistry.reverse.get(this);
      if (str) return str;
      throw new Error(`this (${this}) not found in subclassRegistry`);
    }
    throw new Error(`subclassRegistry not found`);
  }

  static fromString<T extends typeof BetterEnum>(this: T, key: string): InstanceType<T> | undefined {
    return this.getSubclassRegistry()?.forward.get(key) as InstanceType<T> | undefined;
  }

  static values<T extends typeof BetterEnum>(this: T): InstanceType<T>[] {
    return [...(this.getSubclassRegistry()?.forward.values() ?? [])] as InstanceType<T>[];
  }

  private static getSubclassRegistry() {
    return this._registry.get(this);
  }

  static initSubclassRegistry(subclass: typeof BetterEnum) {
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
