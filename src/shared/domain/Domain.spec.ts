import { describe, it, expect, vi } from 'vitest';
import { UniqueIdentifier } from './UniqueIdentifier';
import { Entity } from './Entity';
import { ValueObject } from './ValueObject';
import { Result } from '../result/Result';
import { InMemoryEventBus } from '../infrastructure/events/InMemoryEventBus';
import { DomainEvent } from './DomainEvent';

class TestId extends UniqueIdentifier {}

interface TestEntityProps {
  name: string;
}

class TestEntity extends Entity<TestEntityProps> {
  get name(): string {
    return this.props.name;
  }
}

interface SampleVoProps {
  lat: number;
  lng: number;
}

class SampleLocationVo extends ValueObject<SampleVoProps> {}

class SampleDomainEvent extends DomainEvent {}

describe('Phase 1 Core Domain & Infrastructure Verification', () => {
  it('should generate valid UniqueIdentifiers and compare equality correctly', () => {
    const id1 = new UniqueIdentifier();
    const id2 = new UniqueIdentifier(id1.toValue());
    const id3 = new UniqueIdentifier();

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });

  it('should enforce entity equality based on UniqueIdentifier', () => {
    const id = new UniqueIdentifier();
    const entity1 = new TestEntity({ name: 'Alpha' }, id);
    const entity2 = new TestEntity({ name: 'Beta' }, id);

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.name).toBe('Alpha');
  });

  it('should evaluate ValueObject structural equality', () => {
    const loc1 = new SampleLocationVo({ lat: 37.7749, lng: -122.4194 });
    const loc2 = new SampleLocationVo({ lat: 37.7749, lng: -122.4194 });
    const loc3 = new SampleLocationVo({ lat: 40.7128, lng: -74.006 });

    expect(loc1.equals(loc2)).toBe(true);
    expect(loc1.equals(loc3)).toBe(false);
  });

  it('should handle Result pattern success and failure states', () => {
    const successResult = Result.ok<string>('Data Loaded');
    const failureResult = Result.fail<string>('Invalid Parameter');

    expect(successResult.isSuccess).toBe(true);
    expect(successResult.getValue()).toBe('Data Loaded');

    expect(failureResult.isFailure).toBe(true);
    expect(failureResult.error).toBe('Invalid Parameter');
    expect(() => failureResult.getValue()).toThrow();
  });

  it('should publish and receive domain events via InMemoryEventBus', async () => {
    const bus = InMemoryEventBus.getInstance();
    const mockHandler = vi.fn();

    bus.subscribe('SampleDomainEvent', mockHandler);

    const event = new SampleDomainEvent(new UniqueIdentifier());
    await bus.publish(event);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(event);
  });
});
