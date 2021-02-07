import forEach from 'lodash/forEach';
import { PointModel } from '../entities/link/PointModel';
import { DiagramEngine } from '../DiagramEngine';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent } from 'react';
import { LinkModel } from '../entities/link/LinkModel';
import { MoveItemsState } from './MoveItemsState';
import { Action, ActionEvent, InputType } from '../core-actions/Action';

export class DragDiagramItemsState extends MoveItemsState<DiagramEngine> {
  constructor() {
    super();
    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: ActionEvent<MouseEvent>) => {
          const item = this.engine.getMouseElement(event.event);
          if (item instanceof PortModel) {
            forEach(this.initialPositions, (position) => {
              if (position.item instanceof PointModel) {
                const link = position.item.getParent() as LinkModel;

                // only care about the last links
                if (link.getLastPoint() !== position.item) {
                  return;
                }
                if (link.getSourcePort().canLinkToPort(item)) {
                  link.setTargetPort(item);
                  this.engine.repaintCanvas();
                }
              }
            });
          }
        },
      }),
    );
  }
}
