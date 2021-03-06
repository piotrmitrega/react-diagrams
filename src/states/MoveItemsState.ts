import { CanvasEngine } from '../CanvasEngine';
import {
  AbstractDisplacementState,
  AbstractDisplacementStateEvent,
} from '../core-state/AbstractDisplacementState';
import { Point } from '../geometry';
import { BaseModel } from '../core-models/BaseModel';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { State } from '../core-state/State';
import { BasePositionModel } from '../core-models/BasePositionModel';

export class MoveItemsState<
  E extends CanvasEngine = CanvasEngine
> extends AbstractDisplacementState<E> {
  initialPositions: {
    [id: string]: {
      point: Point;
      item: BaseModel;
    };
  };

  constructor() {
    super({
      name: 'move-items',
    });
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<React.MouseEvent>) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);
          if (!element) {
            return;
          }
          if (!element.isSelected()) {
            this.engine.getModel().clearSelection();
          }
          element.setSelected(true);
          this.engine.repaintCanvas();
        },
      }),
    );
  }

  activated(previous: State) {
    super.activated(previous);
    this.initialPositions = {};
  }

  fireMouseMoved(event: AbstractDisplacementStateEvent) {
    const items = this.engine.getModel().getSelectedEntities();
    const model = this.engine.getModel();
    for (const item of items) {
      if (item instanceof BasePositionModel) {
        if (item.isLocked()) {
          continue;
        }
        if (!this.initialPositions[item.getID()]) {
          this.initialPositions[item.getID()] = {
            point: item.getPosition(),
            item: item,
          };
        }

        const pos = this.initialPositions[item.getID()].point;
        item.setPosition(
          model.getGridPosition(pos.x + event.virtualDisplacementX),
          model.getGridPosition(pos.y + event.virtualDisplacementY),
        );
      }
    }
    this.engine.repaintCanvas();
  }
}
