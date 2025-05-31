import { describe, it } from 'node:test';
import assert from 'node:assert';

import BetterEnum from '../src/index.ts';

class Status extends BetterEnum {
  static readonly ON = Object.freeze(new Status(true));

  static readonly OFF = Object.freeze(new Status(false));

  private isOn: boolean;

  constructor(isOn: boolean) {
    super();
    this.isOn = isOn;
  }

  getIsOn() {
    return this.isOn;
  }
}

type MathFunc = (a: number, b: number) => number;

class RCMascot extends BetterEnum {
  public static readonly SNAP = new RCMascot({
    name: 'Snap',
    doMath: (a: number, b: number) => a + b,
  });

  public static readonly CRACKLE = new RCMascot({
    name: 'Crackle',
    doMath: (a: number, b: number) => a - b,
  });

  public static readonly POP = new RCMascot({
    name: 'Pop',
    doMath: (a: number, b: number) => a * b,
  });

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
    this.doMathImpl(a, b);
  }
}

describe('BetterEnum Class', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof BetterEnum, 'function');
  });

  it('value methods', () => {
    assert.deepStrictEqual(Status.ON.getIsOn(), true);
    assert.deepStrictEqual(Status.OFF.getIsOn(), false);

    assert.deepStrictEqual(RCMascot.SNAP.getName(), 'Snap');
    assert.deepStrictEqual(RCMascot.CRACKLE.getName(), 'Crackle');
    assert.deepStrictEqual(RCMascot.POP.getName(), 'Pop');
  });

  it('static values()', () => {
    for (let value of Status.values()) {
      assert.deepStrictEqual(typeof value.getIsOn(), 'boolean');
    }
    assert.deepStrictEqual(Status.values(), [ Status.ON, Status.OFF ]);

    for (let value of RCMascot.values()) {
      assert.deepStrictEqual(typeof value.getName(), 'string');
    }
    assert.deepStrictEqual(RCMascot.values(), [ RCMascot.SNAP, RCMascot.CRACKLE, RCMascot.POP ]);
  });

  it('static toString()', () => {
    assert.deepStrictEqual(Status.ON.toString(), 'ON');
    assert.deepStrictEqual(Status.OFF.toString(), 'OFF');
    assert.deepStrictEqual("" + Status.ON, 'ON');
    assert.deepStrictEqual("" + Status.OFF, 'OFF');

    assert.deepStrictEqual(RCMascot.SNAP.toString(), 'SNAP');
    assert.deepStrictEqual(RCMascot.CRACKLE.toString(), 'CRACKLE');
    assert.deepStrictEqual(RCMascot.POP.toString(), 'POP');
    assert.deepStrictEqual("" + RCMascot.SNAP, 'SNAP');
    assert.deepStrictEqual("" + RCMascot.CRACKLE, 'CRACKLE');
    assert.deepStrictEqual("" + RCMascot.POP, 'POP');
  });

  it('static fromString()', () => {
    const ON = Status.fromString('ON');
    assert.deepStrictEqual(ON, Status.ON);
    assert.deepStrictEqual(ON?.getIsOn(), true);
    const OFF = Status.fromString('OFF');
    assert.deepStrictEqual(OFF, Status.OFF);
    assert.deepStrictEqual(OFF?.getIsOn(), false);
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
