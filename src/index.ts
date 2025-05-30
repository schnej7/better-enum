export default abstract class BetterEnum<T extends BetterEnum<T>> {
  private static _registry = new Map<Function, Map<string, BetterEnum<any>>>();

  private name!: string;

  private static getSubclassRegistry() {
    return this._registry.get(this.constructor);
  }

  constructor(..._: any[]) {
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

  static values<T extends typeof BetterEnum<any>>(this: T): InstanceType<T>[] {
    return [...(this.getSubclassRegistry()?.values()) || []] as InstanceType<T>[];
  }

  static fromString<T extends typeof BetterEnum<any>>(this: T, key: string): InstanceType<T> | undefined {
    return this.getSubclassRegistry()?.get(key) as InstanceType<T> | undefined;
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
