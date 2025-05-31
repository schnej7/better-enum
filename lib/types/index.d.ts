export default abstract class BetterEnum {
    private static _registry;
    constructor(..._: any[]);
    toString(): string;
    static fromString<T extends typeof BetterEnum>(this: T, key: string): InstanceType<T> | undefined;
    static values<T extends typeof BetterEnum>(this: T): InstanceType<T>[];
    private static getSubclassRegistry;
    private static initSubclassRegistry;
}
//# sourceMappingURL=index.d.ts.map