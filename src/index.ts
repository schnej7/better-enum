export default abstract class BetterEnum {
  private static _registry = new Map<Function, Map<string, BetterEnum>>();

  private name!: string;

  private static getSubclassRegistry() {
    return this._registry.get(this.constructor);
  }

  constructor(..._: any[]) {
  }

  static initEnum<T extends typeof BetterEnum>(enumClass: T): void {
    let subclassRegistry = this.getSubclassRegistry();
    if (!subclassRegistry) {
      subclassRegistry = new Map();
      this._registry.set(this.constructor, subclassRegistry);
    } else {
      console.error(`(${enumClass}) initEnum called multiple times`);
    }

    for (const [key, value] of Object.entries(enumClass)) {
      if (value instanceof enumClass) {
        value.name = key;
        subclassRegistry?.set(key, value);
      }
    }
  }

  static values<T extends typeof BetterEnum>(this: T): InstanceType<T>[] {
    return [...(this.getSubclassRegistry()?.values()) || []] as InstanceType<T>[];
  }

  static fromString<T extends typeof BetterEnum>(this: T, key: string): InstanceType<T> | undefined {
    return this.getSubclassRegistry()?.get(key) as InstanceType<T> | undefined;
  }

  toString(): string {
    return this.name;
  }
}

// Decorator: Automatically calls initEnum at class definition time
export function InitEnum(): ClassDecorator {
  return (target) => {
    if (target.prototype instanceof BetterEnum) {
      BetterEnum.initEnum(target as unknown as typeof BetterEnum);
    } else {
      console.error('InitEnum decorating non-enum class', target);
    }
  };
}
