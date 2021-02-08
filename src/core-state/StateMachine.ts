import { State } from './State';
import { CanvasEngine } from '../CanvasEngine';
import { BaseEvent, BaseListener, BaseObserver } from '../core/BaseObserver';
import last from 'lodash/last';

export interface StateMachineListener extends BaseListener {
  stateChanged?: (event: BaseEvent & { newState: State }) => any;
}

export class StateMachine extends BaseObserver<StateMachineListener> {
  protected currentState: State;
  protected stateStack: State[];
  protected engine: CanvasEngine;

  constructor(engine: CanvasEngine) {
    super();
    this.engine = engine;
    this.stateStack = [];
  }

  getCurrentState() {
    return this.currentState;
  }

  pushState(state: State) {
    this.stateStack.push(state);
    this.setState(state);
  }

  popState() {
    this.stateStack.pop();
    this.setState(last(this.stateStack));
  }

  setState(state: State) {
    state.setEngine(this.engine);

    // if no state object, get the initial state
    if (this.currentState) {
      this.currentState.deactivated(state);
    }
    const old = this.currentState;
    this.currentState = state;
    if (this.currentState) {
      this.currentState.activated(old);
      this.fireEvent<'stateChanged'>(
        {
          newState: state,
        },
        'stateChanged',
      );
    }
  }
}
