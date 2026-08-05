import { Entity } from './Entity';
import { IDomainEvent } from './DomainEvent';
import { UniqueIdentifier } from './UniqueIdentifier';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
