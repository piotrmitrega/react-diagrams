import { State, StateOptions } from './State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { CanvasEngine } from '../CanvasEngine';

export type VirtualDisplacement = {
  virtualDisplacementX: number;
  virtualDisplacementY: number;
};
export type AbstractDisplacementStateEvent = VirtualDisplacement & {
  displacementX: number;
  displacementY: number;
  event: React.MouseEvent;
};

export abstract class AbstractDisplacementState<
  E extends CanvasEngine = CanvasEngine
> extends State<E> {
  initialX: number;
  initialY: number;
  initialXRelative: number;
  initialYRelative: number;

  constructor(options: StateOptions) {
    super(options);
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
          this.initialX = actionEvent.event.clientX;
          this.initialY = actionEvent.event.clientY;
          const rel = this.engine.getRelativePoint(
            actionEvent.event.clientX,
            actionEvent.event.clientY,
          );
          this.initialXRelative = rel.x;
          this.initialYRelative = rel.y;
        },
      }),
    );
    this.registerAction(
      new Action({
        type: InputType.MOUSE_MOVE,
        fire: (actionEvent: ActionEvent<React.MouseEvent>) => {
          const { event } = actionEvent;

          if (event.buttons === 0) {
            // If buttons is 0, it means the mouse is not down, the user may have released it
            // outside of the canvas, then we eject the state
            this.eject();

            return;
          }

          this.fireMouseMoved({
            displacementX: event.clientX - this.initialX,
            displacementY: event.clientY - this.initialY,
            event: event,
            ...this.calculateVirtualDisplacement(event.clientX, event.clientY),
          });
        },
      }),
    );
    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: ActionEvent<React.MouseEvent>) => {
          // when the mouse if up, we eject this state
          this.eject();
        },
      }),
    );
  }

  calculateVirtualDisplacement(x: number, y: number): VirtualDisplacement {
    return {
      virtualDisplacementX:
        (x - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0),
      virtualDisplacementY:
        (y - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0),
    };
  }

  abstract fireMouseMoved(event: AbstractDisplacementStateEvent);
}
