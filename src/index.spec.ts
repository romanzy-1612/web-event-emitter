import { describe, expect, test, jest } from '@jest/globals';

import { WebEventEmitter } from './index';

export type MyEventMap = {
  eventName: () => void;
  eventWithData: (arg1: string, arg2: string) => void;
};

let emitter: WebEventEmitter<MyEventMap>;
beforeEach(() => {
  emitter = new WebEventEmitter();
});

describe('Emitter events', () => {
  test('emitter can add and remove listeners', () => {
    const spyFunc = jest.fn();
    emitter.on('eventName', spyFunc);
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(1);

    spyFunc.mockClear();

    const spyFunc2 = jest.fn();
    emitter.on('eventName', spyFunc2);
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(1);
    expect(spyFunc2).toBeCalledTimes(1);

    spyFunc.mockClear();
    spyFunc2.mockClear();

    emitter.off('eventName', spyFunc2);
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(1);
    expect(spyFunc2).toBeCalledTimes(0);
  });

  test('emitter can remove multiple listeners', () => {
    const spyFunc = jest.fn();
    emitter.on('eventName', spyFunc);
    emitter.offAll('eventName');
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(0);

    spyFunc.mockClear();

    emitter.on('eventName', spyFunc);
    emitter.offAll();
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(0);
  });

  test('emitter can remove single listener', () => {
    const spyFunc = jest.fn();
    emitter.on('eventName', spyFunc);
    emitter.off('eventName', spyFunc);
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(0);

    spyFunc.mockClear();
  });

  test('emitter can emit once', () => {
    const spyFunc = jest.fn();
    emitter.once('eventName', spyFunc);
    emitter.emit('eventName');
    emitter.emit('eventName');
    expect(spyFunc).toBeCalledTimes(1);

    spyFunc.mockClear();
  });

  test('emitter can wait', () => {
    expect.assertions(1);

    emitter.waitFor('eventName').then((res) => {
      expect(res).toEqual([]);
    });
    emitter.emit('eventName');
  });
});

//branch testing
describe('Emitter methods returns correctly', () => {
  test('when emitting events', () => {
    expect(emitter.emit('eventName')).toEqual(false);
    emitter.on('eventName', () => {});
    expect(emitter.emit('eventName')).toEqual(true);
  });
  test('when subscribing', () => {
    expect(emitter.on('eventName', () => {})).toBe(emitter);
    expect(emitter.on('eventName', () => {})).toBe(emitter);
  });
  test('when unsubscribing', () => {
    expect(emitter.off('eventName', () => {})).toBe(emitter);
    expect(emitter.offAll('eventName')).toBe(emitter);
    expect(emitter.offAll()).toBe(emitter);
  });
});

describe('Emitter callback data', () => {
  const spyFunc = jest.fn();

  let cb;

  beforeEach(() => {
    spyFunc.mockClear();
    cb = (...args) => {
      spyFunc(args);
    };
  });

  test('is correct in on', () => {
    expect.assertions(2);
    emitter.on('eventWithData', cb);
    emitter.on('eventWithData', (arg1, arg2) => {
      expect(arg1).toEqual('arg1');
      expect(arg2).toEqual('arg2');
    });
    emitter.emit('eventWithData', 'arg1', 'arg2');
    // expect(spyFunc).toBeCalledWith(['arg1', 'arg2']);
  });

  test('is correct in once', () => {
    emitter.once('eventWithData', cb);
    emitter.emit('eventWithData', 'arg1', 'arg2');
    emitter.emit('eventWithData', 'arg1', 'arg2');
    expect(spyFunc).toBeCalledTimes(1); //not needed but why not
    expect(spyFunc).toBeCalledWith(['arg1', 'arg2']);

    // spyFunc.mockClear();
  });

  test('is correct in wait promise', () => {
    expect.assertions(2);

    emitter.waitFor('eventWithData').then((val) => {
      expect(val).toEqual(['arg1', 'arg2']);
    });

    const res = emitter.emit('eventWithData', 'arg1', 'arg2');
    expect(res).toBe(true);
  });

  test('is correct in async wait', async () => {
    expect.assertions(1);

    setTimeout(() => {
      emitter.emit('eventWithData', 'arg1', 'arg2');
    });

    const res = await emitter.waitFor('eventWithData');
    expect(res).toEqual(['arg1', 'arg2']);
  });

  // TODO
  test.skip('is rejected in wait when event is removed', () => {
    expect.assertions(2);

    emitter.waitFor('eventName').catch((val) => {
      expect(val).toEqual('event emitter destroyed');
    });

    const res = emitter.offAll('eventName');
    expect(res).toBe(true);
  });
});

// test('wait works correctly', async () => {
//   const spyFunc = jest.fn();
//   const emitter = new WebEventEmitter();
//   emitter.emit('eventName');

//   const result = await emitter.wait('eventName');

//   // emitter.once('eventName', spyFunc);
//   emitter.emit('eventName');
//   expect(spyFunc).toBeCalledTimes(1);

//   spyFunc.mockClear();
// });
