export default abstract class BetterEnum<T extends BetterEnum<T>> {
  private static _registry = new Map<Function, Map<string, BetterEnum<any>>>();

  private name!: string;

  private static getSubclassRegistry() {
    return this._registry.get(this.constructor);
  }

  protected constructor() {
  }

  static initEnum<T extends BetterEnum<T>>(enumClass: any): void {
    let subclassRegistry = this.getSubclassRegistry();
    if (!subclassRegistry) {
      subclassRegistry = new Map();
      this._registry.set(this.constructor, subclassRegistry);
    } else {
      console.error(`(${enumClass}) initEnum called multiple times`);
    }

    for (const [key, value] of Object.entries(enumClass)) {
      if (value instanceof enumClass) {
        const typedValue = value as T;
        typedValue.name = key;
        subclassRegistry?.set(key, typedValue);
      }
    }
  }

  static values<T extends BetterEnum<T>>(): T[] {
    return [...(this.getSubclassRegistry()?.values()) || []] as T[];
  }

  static fromString<T extends BetterEnum<T>>(key: string): T {
    return this.getSubclassRegistry()?.get(key) as T;
  }

  toString(): string {
    return this.name;
  }
}

// Decorator: Automatically calls initEnum at class definition time
export function InitEnum(): ClassDecorator {
  return (target) => {
    // Delay to ensure all static fields are defined
    BetterEnum.initEnum(target);
  };
}
