import { describe, it } from 'node:test';
import assert from 'node:assert';

import BetterEnum from '../src/index.ts';

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

type MathFunc = (a: number, b: number) => number;

class RCMascot extends BetterEnum {
  public static readonly SNAP = Object.freeze(new RCMascot({
    name: 'Snap',
    doMath: (a: number, b: number) => a + b,
  }));

  public static readonly CRACKLE = Object.freeze(new RCMascot({
    name: 'Crackle',
    doMath: (a: number, b: number) => a - b,
  }));

  public static readonly POP = Object.freeze(new RCMascot({
    name: 'Pop',
    doMath: (a: number, b: number) => a * b,
  }));

  private name: string;

  private doMathImpl: MathFunc;

  constructor(args: { name: string, doMath: MathFunc }) {
    super();
    this.name = args.name;
    this.doMathImpl = args.doMath;
  }

  getName() {
    return this.name;
  }

  doMath(a: number, b: number) {
    console.log('Functionality consistent across all values here');
    return this.doMathImpl(a, b);
  }
}

describe('BetterEnum Class', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof BetterEnum, 'function');
  });

  it('value methods', () => {
    assert.deepStrictEqual(Status.LOADING.getIsBlocked(), true);
    assert.deepStrictEqual(Status.READY.getIsBlocked(), false);

    assert.deepStrictEqual(RCMascot.SNAP.getName(), 'Snap');
    assert.deepStrictEqual(RCMascot.CRACKLE.getName(), 'Crackle');
    assert.deepStrictEqual(RCMascot.POP.getName(), 'Pop');

    assert.deepStrictEqual(RCMascot.SNAP.doMath(1,2), 3);
    assert.deepStrictEqual(RCMascot.CRACKLE.doMath(1,2), -1);
    assert.deepStrictEqual(RCMascot.POP.doMath(1,2), 2);
  });

  it('static values()', () => {
    for (let value of Status.values()) {
      assert.deepStrictEqual(typeof value.getIsBlocked(), 'boolean');
    }
    assert.deepStrictEqual(Status.values(), [ Status.LOADING, Status.READY ]);

    for (let value of RCMascot.values()) {
      assert.deepStrictEqual(typeof value.getName(), 'string');
    }
    assert.deepStrictEqual(RCMascot.values(), [ RCMascot.SNAP, RCMascot.CRACKLE, RCMascot.POP ]);
  });

  it('static toString()', () => {
    assert.deepStrictEqual(Status.LOADING.toString(), 'LOADING');
    assert.deepStrictEqual(Status.READY.toString(), 'READY');
    assert.deepStrictEqual("" + Status.LOADING, 'LOADING');
    assert.deepStrictEqual("" + Status.READY, 'READY');

    assert.deepStrictEqual(RCMascot.SNAP.toString(), 'SNAP');
    assert.deepStrictEqual(RCMascot.CRACKLE.toString(), 'CRACKLE');
    assert.deepStrictEqual(RCMascot.POP.toString(), 'POP');
    assert.deepStrictEqual("" + RCMascot.SNAP, 'SNAP');
    assert.deepStrictEqual("" + RCMascot.CRACKLE, 'CRACKLE');
    assert.deepStrictEqual("" + RCMascot.POP, 'POP');
  });

  it('static fromString()', () => {
    const LOADING = Status.fromString('LOADING');
    assert.deepStrictEqual(LOADING, Status.LOADING);
    assert.deepStrictEqual(LOADING.getIsBlocked(), true);
    const READY = Status.fromString('READY');
    assert.deepStrictEqual(READY, Status.READY);
    assert.deepStrictEqual(READY.getIsBlocked(), false);
    assert.deepStrictEqual(Status.fromString('ABSENT'), undefined);

    const SNAP = RCMascot.fromString('SNAP');
    assert.deepStrictEqual(SNAP, RCMascot.SNAP);
    assert.deepStrictEqual(SNAP.getName(), 'Snap');
    const CRACKLE = RCMascot.fromString('CRACKLE');
    assert.deepStrictEqual(CRACKLE, RCMascot.CRACKLE);
    assert.deepStrictEqual(CRACKLE.getName(), 'Crackle');
    const POP = RCMascot.fromString('POP');
    assert.deepStrictEqual(POP, RCMascot.POP);
    assert.deepStrictEqual(POP.getName(), 'Pop');
    assert.deepStrictEqual(RCMascot.fromString('ABSENT'), undefined);
  });
});
