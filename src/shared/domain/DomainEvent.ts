import { UniqueIdentifier } from './UniqueIdentifier';

export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): UniqueIdentifier;
}

export abstract class DomainEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  private readonly aggregateId: UniqueIdentifier;

  constructor(aggregateId: UniqueIdentifier) {
    this.dateTimeOccurred = new Date();
    this.aggregateId = aggregateId;
  }

  public getAggregateId(): UniqueIdentifier {
    return this.aggregateId;
  }
}
