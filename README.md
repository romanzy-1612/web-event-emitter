# @romanzy/web-event-emitter

Browser based event emitter with full typescript support.

# Installation

```bash
npm i @romanzy/web-event-emitter
```

# Usage

Create an event map

```typescript
export type MyEventMap = {
  ready: () => void;
  error: (message: string) => void;
};
```

Extend your class from `WebEventEmitter`. Now all events are typed.

```typescript
export class MyClass extends WebEventEmitter<MyEventMap> {}
```

Additionally provides `waitFor` method. It works the same way as `once`, but returns a promise instead

## API

```typescript
  /**
   * Emits an event
   * @param event Event name
   * @param args Arguments to emit with
   */
  public emit<E extends keyof Events>(event: E, ...args: Arguments<Events[E]>): boolean

  /**
   * Subscribes to an event
   * @param event Event name
   * @param listener Callback function to execute when event is emitted
   * @returns
   */
  public on<E extends keyof Events>(event: E, listener: Events[E]): this

  /**
   * Subscribes to event once
   * @param event Event name
   * @param listener Callback function to execute when event is emitted
   * @returns
   */
  public once<E extends keyof Events>(event: E, listener: Events[E]): this

  /**
   * Waits for event to complete, currently never rejects
   * @param event Event name
   * @returns In async context returns event data as an array
   */
  public async waitFor<E extends keyof Events>(event: E): Promise<Arguments<Events[E]>>

  /**
   * Unsubscribes from event
   * @param event Event name
   * @param listener Callback function used when subscribed
   */
  public off<E extends keyof Events>(event: E, listener: Events[E]): this

  /**
   * Unsubscribes all from event. If no arguments are passed,
   * all events with given name are removed
   * @param event Event name
   * @returns
   */
  public offAll<E extends keyof Events>(event?: E): this
```

# TODO

- [ ] add "asIterator" method. useful to be used as

# Credits

Event emitter from [peer-light](https://github.com/skyllo/peer-lite) was used as base for this package
