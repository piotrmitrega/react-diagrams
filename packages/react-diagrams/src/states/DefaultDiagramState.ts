import { MouseEvent } from 'react';
import { PortModel } from '../entities/port/PortModel';
import { DragNewLinkState } from './DragNewLinkState';
import { DiagramEngine } from '../DiagramEngine';
import { DragDiagramItemsState } from './DragDiagramItemsState';
import { State } from '../core-state/State';
import { DragCanvasState } from './DragCanvasState';
import { SelectingState } from './SelectingState';
import { Action, ActionEvent, InputType } from '../core-actions/Action';

export class DefaultDiagramState extends State<DiagramEngine> {
  dragCanvas: DragCanvasState;
  dragNewLink: DragNewLinkState;
  dragItems: DragDiagramItemsState;

  constructor() {
    super({
      name: 'default-diagrams',
    });
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState({ allowLooseLinks: false });
    this.dragItems = new DragDiagramItemsState();

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          }
          // initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          }
          // move the items (and potentially link points)
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        },
      }),
    );
  }
}
