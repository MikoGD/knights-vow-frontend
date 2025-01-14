type Event = 'user-login' | 'user-logout';
type EventData = Record<string, unknown>;
type SubscriberCallback = (event: Event, data?: EventData) => Promise<void> | void;
type Subscribers = Map<number, SubscriberCallback>;

const events: Map<Event, Subscribers> = new Map();

function* generateId() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const idGenerator = generateId();

function useEvents() {
  /**
   * 
   * @param eventName 
   * @param callback 
   * @returns 
   */
  function subscribe(eventName: Event, callback: SubscriberCallback): number {
    const ID = idGenerator.next().value;

    if (ID === undefined) {
      throw new Error('Could not generate an id');
    };

    if (!events.has(eventName)) {
      const subscribers = new Map<number, SubscriberCallback>();

      subscribers.set(ID, callback);
      events.set(eventName, subscribers);
      return ID
    }

    const subscribers = events.get(eventName);
    subscribers?.set(ID, callback);

    return ID
  }

  function unsubscribe(eventName: Event, id: number) {
    const subscribers = events.get(eventName);

    if (!subscribers) return;

    subscribers.delete(id);
  }

  async function publish(eventName: Event, data?: EventData) {
    const subscribers = events.get(eventName);

    if (!subscribers) return;

    const subscriberPromises: (Promise<void> | void)[] = [];

    for (const subscriber of subscribers.values()) {
      subscriberPromises.push(subscriber(eventName, data));
    }

    await Promise.all(subscriberPromises);
  }

  return {
    subscribe,
    publish,
    unsubscribe
  };
}

export {
  useEvents
}