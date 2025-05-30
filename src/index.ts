type SubclassRegistry = {
  forward: Map<string, BetterEnum>;
  reverse: Map<BetterEnum, string>;
};

export default abstract class BetterEnum {
  private static _registry = new Map<Function, SubclassRegistry>();

  constructor(..._: any[]) {
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

  private static initSubclassRegistry(subclass: typeof BetterEnum) {
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
