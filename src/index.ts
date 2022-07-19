export type Arguments<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];

type EventName = string;

type BaseEventMap = {
  [key: EventName]: ListenerFunction;
};

type InternalEventMap = {
  [key: EventName]: ListenerFunction[];
};

type ListenerFunction = (...args: any[]) => void;

export class WebEventEmitter<Events extends BaseEventMap> {
  private eventMap: InternalEventMap | any = {} as InternalEventMap;

  /**
   * Emits an event
   * @param event Event name
   * @param args Arguments to emit with
   */
  public emit<E extends keyof Events>(event: E, ...args: Arguments<Events[E]>): boolean {
    const listeners = this.eventMap[event];
    if (!listeners) return false;
    listeners.forEach((callback) => {
      callback(...args);
    });
    return true;
  }

  /**
   * Subscribes to an event
   * @param event Event name
   * @param listener Callback function to execute when event is emitted
   * @returns
   */
  public on<E extends keyof Events>(event: E, listener: Events[E]): this {
    if (!this.eventMap[event]) this.eventMap[event] = [];
    // this.eventMap[event] = this.eventMap[event] ?? [];
    this.eventMap[event].push(listener);
    return this;
  }

  /**
   * Subscribes to event once
   * @param event Event name
   * @param listener Callback function to execute when event is emitted
   * @returns
   */
  public once<E extends keyof Events>(event: E, listener: Events[E]): this {
    // FIX this will not be cleaned up if offAll is used
    const sub = (...args) => {
      this.off(event, sub as any);

      // eslint-disable-next-line prefer-rest-params
      // listener.apply(this, args);
      listener(...args);
    };

    this.on(event, sub as any);

    return this;
  }

  /**
   * Waits for event to complete once
   * @param event Event name
   * @param listener Callback function to execute when event is emitted
   * @returns
   */
  public async wait<E extends keyof Events>(event: E): Promise<Events[E]> {
    // FIX this will not be cleaned up if offAll is used
    // For now the event in hanging forever

    return new Promise((resolve, _reject) => {
      const sub = (...args) => {
        this.off(event, sub as any);

        // eslint-disable-next-line prefer-rest-params
        // listener.apply(this, args);
        resolve(args as any);
      };

      this.on(event, sub as any);
    });
  }

  /**
   * Unsubscribes from event
   * @param event Event name
   * @param listener Callback function used when subscribed
   */
  public off<E extends keyof Events>(event: E, listener: Events[E]): this {
    const listeners = this.eventMap[event];
    if (!listeners) return this;

    if (!listener) {
      delete this.eventMap[event];
      return this;
    }

    for (let i = listeners.length - 1; i >= 0; i -= 1) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
    return this;
  }

  /**
   * Unsubscribes all from event. If no arguments are passed,
   * all events with given name are removed
   * @param event Event name
   * @returns
   */
  public offAll<E extends keyof Events>(event?: E): this {
    if (event) {
      const listeners = this.eventMap[event];
      if (!listeners) return this;
      delete this.eventMap[event];
    } else {
      this.eventMap = {};
    }
    return this;
  }
}
