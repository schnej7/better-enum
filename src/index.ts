export default abstract class BetterEnum {
  private static _registry = new Map<Function, Map<string, BetterEnum>>();

  private name!: string;

  constructor(..._: any[]) {
    const subclass = new.target;

    // Delay execution so all static fields are initialized
    queueMicrotask(() => {
      const subclassRegistry = BetterEnum.initSubclassRegistry(subclass);
      for (const [key, value] of Object.entries(subclass)) {
        if (value === this && !subclassRegistry.has(key)) {
          this.name = key;
          Object.freeze(this);
          subclassRegistry.set(key, this);
          break;
        }
      }
    });
  }

  toString(): string {
    return this.name;
  }

  static fromString<T extends typeof BetterEnum>(this: T, key: string): InstanceType<T> | undefined {
    return this.getSubclassRegistry()?.get(key) as InstanceType<T> | undefined;
  }

  static values<T extends typeof BetterEnum>(this: T): InstanceType<T>[] {
    return [...(this.getSubclassRegistry()?.values() ?? [])] as InstanceType<T>[];
  }

  private static getSubclassRegistry() {
    return this._registry.get(this);
  }

  private static initSubclassRegistry(subclass: typeof BetterEnum) {
    let subclassRegistry = BetterEnum._registry.get(subclass);
    if (!subclassRegistry) {
      subclassRegistry = new Map();
      BetterEnum._registry.set(subclass, subclassRegistry);
    }
    return subclassRegistry;
  }
}

