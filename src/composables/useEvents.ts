/**
 * Events that can be subscribed to:
 * user-login - when a user logs in
 * user-logout - when a user logs out
 */
type Event = 'user-login' | 'user-logout';
type EventData = Record<string, unknown>;
type SubscriberCallback<T extends EventData> = (data?: T) => Promise<void> | void;
type Subscribers<T extends EventData> = Map<number, SubscriberCallback<T>>;

const events: Map<Event, Subscribers<EventData>> = new Map();

/**
 * Generates a unique ID for each subscriber
 * @yields a unique ID
 */
function* generateId() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const idGenerator = generateId();

/**
 * Composable to handle subscribing/unsubscribing to and publishing events
 * @returns Functions to subscribe, unsubscribe, and publish events
 */
function useEvents() {
  /**
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when the event is published
   * @returns ID of the subscriber
   */
  function subscribe<T extends EventData = EventData>(
    eventName: Event,
    callback: SubscriberCallback<T>,
  ): number {
    const ID = idGenerator.next().value;

    if (ID === undefined) {
      throw new Error('Could not generate an id');
    }

    if (!events.has(eventName)) {
      const subscribers = new Map<number, SubscriberCallback<T>>();

      subscribers.set(ID, callback);
      events.set(eventName, subscribers as Subscribers<EventData>);
      return ID;
    }

    const subscribers = events.get(eventName);
    subscribers?.set(ID, callback as SubscriberCallback<EventData>);

    return ID;
  }

  /**
   * Unsubscribes a subscriber from an event
   * @param eventName Event to unsubscribe from
   * @param id ID of the subscriber to remove
   */
  function unsubscribe(eventName: Event, id: number) {
    const subscribers = events.get(eventName);

    if (!subscribers) return;

    subscribers.delete(id);
  }

  /**
   * Publishes an event to all subscribers
   * @param eventName Name of event
   * @param data Payload to send to subscribers
   */
  async function publish(eventName: Event, data?: EventData) {
    const subscribers = events.get(eventName);

    if (!subscribers) return;

    const subscriberPromises: (Promise<void> | void)[] = [];

    for (const subscriber of subscribers.values()) {
      subscriberPromises.push(subscriber(data));
    }

    await Promise.all(subscriberPromises);
  }

  return {
    subscribe,
    publish,
    unsubscribe,
  };
}

export { useEvents };
