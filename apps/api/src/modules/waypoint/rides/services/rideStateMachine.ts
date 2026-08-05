import { AppError } from '../../../../platform/middleware/errorHandler.js';

export type RideLifecycleState =
  | 'CREATED'
  | 'SEARCHING'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'DRIVER_EN_ROUTE'
  | 'PASSENGER_PICKED_UP'
  | 'RIDE_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

const VALID_TRANSITIONS: Record<RideLifecycleState, RideLifecycleState[]> = {
  CREATED: ['SEARCHING', 'CANCELLED'],
  SEARCHING: ['MATCHED', 'EXPIRED', 'CANCELLED'],
  MATCHED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['DRIVER_EN_ROUTE', 'CANCELLED'],
  DRIVER_EN_ROUTE: ['PASSENGER_PICKED_UP', 'CANCELLED'],
  PASSENGER_PICKED_UP: ['RIDE_IN_PROGRESS', 'CANCELLED'],
  RIDE_IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [], // Terminal
  CANCELLED: [], // Terminal
  EXPIRED: [],   // Terminal
};

export class RideStateMachine {
  static validateTransition(currentState: RideLifecycleState, nextState: RideLifecycleState): void {
    const allowed = VALID_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        `Cannot transition ride state from '${currentState}' to '${nextState}'. Allowed next states: [${allowed.join(', ')}]`
      );
    }
  }

  static canCancel(currentState: RideLifecycleState): boolean {
    return VALID_TRANSITIONS[currentState]?.includes('CANCELLED') ?? false;
  }
}
