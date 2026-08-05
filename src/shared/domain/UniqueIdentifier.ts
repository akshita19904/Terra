import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UniqueIdentifier {
  private readonly value: string;

  constructor(id?: string) {
    if (id && !uuidValidate(id)) {
      throw new Error(`Invalid UniqueIdentifier format: ${id}`);
    }
    this.value = id || uuidv4();
  }

  public toString(): string {
    return this.value;
  }

  public equals(id?: UniqueIdentifier): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof UniqueIdentifier)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  public toValue(): string {
    return this.value;
  }
}
