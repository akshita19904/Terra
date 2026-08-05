import { UniqueIdentifier } from './UniqueIdentifier';

export abstract class Entity<T> {
  protected readonly _id: UniqueIdentifier;
  public readonly props: T;

  constructor(props: T, id?: UniqueIdentifier) {
    this._id = id ? id : new UniqueIdentifier();
    this.props = props;
  }

  get id(): UniqueIdentifier {
    return this._id;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
