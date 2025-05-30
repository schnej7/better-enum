import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

import BetterEnum, { InitEnum } from '../src/index.ts';
import npmPackage from '../src/index.ts';

describe('NPM Package', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof npmPackage, 'function');
  });
});

@InitEnum()
class Status extends BetterEnum<Status> {
  static readonly ON = new Status(true);

  static readonly OFF = new Status(false);

  isOn: boolean;

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

  it('values should return all values', () => {
    const values = Status.values();
    for (let value of values) {
      value.getIsOn();
      assert.deepStrictEqual(typeof value.getIsOn(), 'boolean');
    }
    assert.deepStrictEqual(Status.values(), [ Status.ON, Status.OFF ]);
  });

  it('values methods should return the correct result', () => {
    assert.deepStrictEqual(Status.ON.getIsOn(), true);
    assert.deepStrictEqual(Status.OFF.getIsOn(), false);
  });

  it('toString methods should return the static member name', () => {
    assert.deepStrictEqual(Status.ON.toString(), 'ON');
    assert.deepStrictEqual(Status.OFF.toString(), 'OFF');
  });

  it('fromString should return the correct result', () => {
    assert.deepStrictEqual(Status.fromString('ON'), Status.ON);
    assert.deepStrictEqual(Status.fromString('OFF'), Status.OFF);
    assert.deepStrictEqual(Status.fromString('ABSENT'), undefined);
  });
});
