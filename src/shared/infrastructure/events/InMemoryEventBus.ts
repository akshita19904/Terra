import { IDomainEvent } from '../../domain/DomainEvent';
import { logger } from '../logging/logger';

export type EventHandler<T extends IDomainEvent = IDomainEvent> = (event: T) => Promise<void> | void;

export interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void;
}

export class InMemoryEventBus implements IEventBus {
  private static instance: InMemoryEventBus;
  private handlers: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  public subscribe<T extends IDomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler as EventHandler);
    logger.debug(`Subscribed handler to domain event [${eventName}]`);
  }

  public async publish<T extends IDomainEvent>(event: T): Promise<void> {
    const eventName = event.constructor.name;
    const registeredHandlers = this.handlers.get(eventName) || [];

    logger.info(`Publishing Domain Event [${eventName}] to ${registeredHandlers.length} handlers`, {
      aggregateId: event.getAggregateId().toValue(),
      occurredOn: event.dateTimeOccurred,
    });

    for (const handler of registeredHandlers) {
      try {
        await handler(event);
      } catch (error) {
        logger.error(`Error handling domain event [${eventName}]`, { error, event });
      }
    }
  }
}

export const eventBus = InMemoryEventBus.getInstance();
