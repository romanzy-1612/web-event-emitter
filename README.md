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

# Credits

Event emitter from (peer-light)[https://github.com/romanzy-1612/peer-lite] was used as base for this package
