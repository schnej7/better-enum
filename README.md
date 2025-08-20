# BetterEnum

**BetterEnum** is a lightweight TypeScript utility class for defining extensible, object-oriented enums with behavior. It enables enum-like static fields that retain their identity, support reverse lookups by name, and allow for rich custom behavior through class instances.

## ✨ Features

* Enum-like static fields with rich instance behavior
* Reverse lookup from string name (`fromString`)
* Forward serialization to string (`toString`)
* Enumeration of defined values (`values`)
* Fully type-safe and extensible

## 🚀 Installation

```bash
npm install better-enum
```

Or with Yarn:

```bash
yarn add better-enum
```

## 🧠 Why?

JavaScript/TypeScript `enum`s are limited: they can't hold methods, complex data, or behavior. `BetterEnum` allows you to define classes with static members that behave like enums *and* objects — think Java-style enums with methods and fields.

---

## 📦 Usage

### Define a Custom Enum

```ts
import BetterEnum, { RegisterEnum } from 'better-enum';

@RegisterEnum
class Status extends BetterEnum {
  static LOADING = new Status(true);
  static READY = new Status(false);

  private isBlocked: boolean;

  constructor(isBlocked: boolean) {
    super();
    this.isBlocked = isBlocked;
  }

  getIsBlocked() {
    return this.isBlocked;
  }
}
```

### Access Enum Values

```ts
Status.LOADING.getIsBlocked(); // true
Status.READY.getIsBlocked();   // false
```

### Get All Values

```ts
Status.values(); // [Status.LOADING, Status.READY]
```

### Convert to and from Strings

```ts
Status.LOADING.toString(); // "LOADING"
Status.fromString("READY") === Status.READY; // true
```

---

## 🎓 Advanced Example

```ts
@RegisterEnum
class RCMascot extends BetterEnum {
  public static readonly SNAP = Object.freeze(new RCMascot({
    name: 'Snap',
    doMath: (a, b) => a + b,
  }));

  public static readonly CRACKLE = Object.freeze(new RCMascot({
    name: 'Crackle',
    doMath: (a, b) => a - b,
  }));

  public static readonly POP = Object.freeze(new RCMascot({
    name: 'Pop',
    doMath: (a, b) => a * b,
  }));

  private name: string;
  private doMathImpl: (a: number, b: number) => number;

  constructor(args: { name: string, doMath: (a: number, b: number) => number }) {
    super();
    this.name = args.name;
    this.doMathImpl = args.doMath;
  }

  getName() {
    return this.name;
  }

  doMath(a: number, b: number) {
    return this.doMathImpl(a, b);
  }
}
```

```ts
RCMascot.SNAP.getName(); // "Snap"
RCMascot.POP.doMath(2, 3); // 6
RCMascot.fromString("CRACKLE") === RCMascot.CRACKLE; // true
RCMascot.values(); // [SNAP, CRACKLE, POP]
```

---

## 📘 API

### `class BetterEnum`

Base class to extend when creating enum-like classes.

---

### `static values(): T[]`

Returns all enum values defined as static members on the subclass.

---

### `static fromString(key: string): T | undefined`

Returns the instance matching the given string name. Returns `undefined` if not found.

---

### `toString(): string`

Returns the string name of the enum instance based on its static member name.

---

## 🧪 Tests

The package includes thorough test coverage using Node's native `test` module and `assert`.

Run tests:

```bash
node --test
```

---

## ⚙️ Configuration

To use the `@RegisterEnum` decorator, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## ⚠️ Caveats

* Classes extending `BetterEnum` must use the `@RegisterEnum` decorator for automatic registration.
* Static fields must be declared *before* runtime use for registration to succeed.
* The `@RegisterEnum` decorator requires TypeScript with `experimentalDecorators: true` in your `tsconfig.json`.

---

## 🙌 Acknowledgments

Inspired by Java-style enums with an ergonomic TypeScript twist.

