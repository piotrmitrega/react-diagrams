import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { Action, ActionEvent, InputType } from './Action';
import { KeyboardEvent, MouseEvent } from 'react';
import { CanvasEngine } from '../CanvasEngine';
import { BaseModel } from '../core-models/BaseModel';

export class ActionEventBus {
  protected actions: { [id: string]: Action };
  protected engine: CanvasEngine;
  protected keys: { [key: string]: boolean };

  constructor(engine: CanvasEngine) {
    this.actions = {};
    this.engine = engine;
    this.keys = {};
  }

  getKeys(): string[] {
    console.log(keys);
    return keys(this.keys);
  }

  registerAction(action: Action): () => void {
    action.setEngine(this.engine);
    this.actions[action.id] = action;
    return () => {
      this.deregisterAction(action);
    };
  }

  deregisterAction(action: Action) {
    action.setEngine(null);
    delete this.actions[action.id];
  }

  getActionsForType(type: InputType): Action[] {
    return filter(this.actions, (action) => action.options.type === type);
  }

  getModelForEvent(actionEvent: ActionEvent<MouseEvent>): BaseModel {
    if (actionEvent.model) {
      return actionEvent.model;
    }
    return this.engine.getMouseElement(actionEvent.event);
  }

  getActionsForEvent(actionEvent: ActionEvent): Action[] {
    const { event } = actionEvent;
    if (event.type === 'mousedown') {
      return this.getActionsForType(InputType.MOUSE_DOWN);
    } else if (event.type === 'mouseup') {
      return this.getActionsForType(InputType.MOUSE_UP);
    } else if (event.type === 'keydown') {
      if (typeof (event as KeyboardEvent).key !== 'string') {
        return [];
      }
      // store the recorded key
      this.keys[(event as KeyboardEvent).key.toLowerCase()] = true;
      return this.getActionsForType(InputType.KEY_DOWN);
    } else if (event.type === 'keyup') {
      if (typeof (event as KeyboardEvent).key !== 'string') {
        return [];
      }
      // delete the recorded key
      delete this.keys[(event as KeyboardEvent).key.toLowerCase()];
      return this.getActionsForType(InputType.KEY_UP);
    } else if (event.type === 'mousemove') {
      return this.getActionsForType(InputType.MOUSE_MOVE);
    } else if (event.type === 'wheel') {
      return this.getActionsForType(InputType.MOUSE_WHEEL);
    }
    return [];
  }

  fireAction(actionEvent: ActionEvent) {
    const actions = this.getActionsForEvent(actionEvent);
    for (const action of actions) {
      action.options.fire(actionEvent as any);
    }
  }
}
