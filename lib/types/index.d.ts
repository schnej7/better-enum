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
export declare function RegisterEnum<T extends EnumConstructorSignature<BetterEnum>>(constructor: T): T;
export default abstract class BetterEnum {
    private static _registry;
    toString(): string;
    static fromString<T extends BetterEnum>(this: EnumConstructor<T>, key: string): T | undefined;
    static values<T extends BetterEnum>(this: EnumConstructor<T>): readonly T[];
    static getSubclassRegistry(): SubclassRegistry | undefined;
    static initSubclassRegistry(subclass: typeof BetterEnum): SubclassRegistry;
}
export {};
//# sourceMappingURL=index.d.ts.map