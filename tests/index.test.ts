import { describe, it } from 'node:test';
import assert from 'node:assert';

import BetterEnum from '../src/index.ts';
import npmPackage from '../src/index.ts';

describe('NPM Package', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof npmPackage, 'function');
  });
});

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

describe('BetterEnum Class', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof BetterEnum, 'function');
  });

  it('value methods', () => {
    assert.deepStrictEqual(Status.ON.getIsOn(), true);
    assert.deepStrictEqual(Status.OFF.getIsOn(), false);
  });

  it('static values()', () => {
    const values = Status.values();
    for (let value of values) {
      assert.deepStrictEqual(typeof value.getIsOn(), 'boolean');
    }
    assert.deepStrictEqual(Status.values(), [ Status.ON, Status.OFF ]);
  });

  it('static toString()', () => {
    assert.deepStrictEqual(Status.ON.toString(), 'ON');
    assert.deepStrictEqual(Status.OFF.toString(), 'OFF');
    assert.deepStrictEqual("" + Status.ON, 'ON');
    assert.deepStrictEqual("" + Status.OFF, 'OFF');
  });

  it('static fromString()', () => {
    const ON = Status.fromString('ON');
    assert.deepStrictEqual(ON, Status.ON);
    assert.deepStrictEqual(ON?.getIsOn(), true);
    const OFF = Status.fromString('OFF');
    assert.deepStrictEqual(OFF, Status.OFF);
    assert.deepStrictEqual(OFF?.getIsOn(), false);
    assert.deepStrictEqual(Status.fromString('ABSENT'), undefined);
  });
});
