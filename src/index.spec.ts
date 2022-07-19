import { describe, expect, test, jest } from '@jest/globals';

import { WebEventEmitter } from './index';

let emitter: WebEventEmitter<any>;
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

  test('in on', () => {
    emitter.on('eventName', cb);
    emitter.emit('eventName', 'arg1', 'arg2');
    expect(spyFunc).toBeCalledWith(['arg1', 'arg2']);

    // spyFunc.mockClear();
  });

  test('in once', () => {
    emitter.once('eventName', cb);
    emitter.emit('eventName', 'arg1', 'arg2');
    emitter.emit('eventName', 'arg1', 'arg2');
    expect(spyFunc).toBeCalledTimes(1); //not needed but why not
    expect(spyFunc).toBeCalledWith(['arg1', 'arg2']);

    // spyFunc.mockClear();
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
