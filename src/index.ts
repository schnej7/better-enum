type SubclassRegistry = {
  forward: Map<string, BetterEnum>;
  reverse: Map<BetterEnum, string>;
};

type EnumConstructorSignature<T extends BetterEnum> = new (...args: any[]) => T;

type EnumConstructor<T extends BetterEnum> = EnumConstructorSignature<T> & {
  getSubclassRegistry(): SubclassRegistry | undefined;
};

/**
 * Class decorator that automatically registers enum instances after class definition is complete.
 * This eliminates the need for queueMicrotask in the constructor.
 */
export function RegisterEnum<T extends EnumConstructorSignature<BetterEnum>>(constructor: T): T {
  // Register all static enum instances immediately after class definition
  const subclassRegistry = BetterEnum.initSubclassRegistry(constructor as unknown as typeof BetterEnum);

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

export default abstract class BetterEnum {
  private static _registry = new Map<typeof BetterEnum, SubclassRegistry>();

  toString(): string {
    const EnumClass = this.constructor as typeof BetterEnum;
    const subclassRegistry = EnumClass.getSubclassRegistry();
    if (subclassRegistry) {
      const str = subclassRegistry.reverse.get(this);
      if (str) return str;
      throw new Error(`Enum instance not found in registry: ${this.constructor.name}`);
    }
    throw new Error(`Registry not found for enum class: ${this.constructor.name}`);
  }

  static fromString<T extends BetterEnum>(this: EnumConstructor<T>, key: string): T | undefined {
    const registry = this.getSubclassRegistry();
    return registry ? registry.forward.get(key) as T | undefined : undefined;
  }

  static values<T extends BetterEnum>(this: EnumConstructor<T>): readonly T[] {
    const registry = this.getSubclassRegistry();
    return registry ? [...registry.forward.values()] as T[] : [];
  }

  static getSubclassRegistry(): SubclassRegistry | undefined {
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
