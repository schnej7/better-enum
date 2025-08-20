type SubclassRegistry = {
    forward: Map<string, BetterEnum>;
    reverse: Map<BetterEnum, string>;
};
/**
 * Class decorator that automatically registers enum instances after class definition is complete.
 * This eliminates the need for queueMicrotask in the constructor.
 */
export declare function RegisterEnum<T extends new (...args: any[]) => BetterEnum>(constructor: T): T;
export default abstract class BetterEnum {
    private static _registry;
    toString(): string;
    static fromString<T extends typeof BetterEnum>(this: T, key: string): InstanceType<T> | undefined;
    static values<T extends typeof BetterEnum>(this: T): InstanceType<T>[];
    private static getSubclassRegistry;
    static initSubclassRegistry(subclass: typeof BetterEnum): SubclassRegistry;
}
export {};
//# sourceMappingURL=index.d.ts.map