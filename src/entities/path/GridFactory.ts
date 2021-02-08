import defer from 'lodash/defer';
import values from 'lodash/values';
import flatMap from 'lodash/flatMap';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import concat from 'lodash/concat';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import { GridArea, GridModel } from './GridModel';
import {
  AbstractModelFactory,
  GenerateModelEvent,
} from '../../core/AbstractModelFactory';
import { DiagramEngine } from '../../DiagramEngine';
import { AbstractDisplacementState } from '../../core-state/AbstractDisplacementState';
import { Action, InputType } from '../../core-actions/Action';
import { PortModel } from '../port/PortModel';
import { BasePositionModel } from '../../core-models/BasePositionModel';
import { Grid } from '../../PathFinding';

type GridDimensions = {
  width: number;
  hAdjustmentFactor: number;
  height: number;
  vAdjustmentFactor: number;
};

export class GridFactory extends AbstractModelFactory<
  GridModel,
  DiagramEngine
> {
  static SCALING_FACTOR = 5;
  static NODE_GRID_OFFSET = 10;

  dimensions: GridDimensions;

  constructor() {
    super('grid');
  }

  setDiagramEngine(engine: DiagramEngine): void {
    super.setDiagramEngine(engine);

    // requestAnimationFrame(() => {
    // 	engine.getCanvas().appendChild(this.gridVisualizerElement);
    // });

    // listen for drag changes
    engine.getStateMachine().registerListener({
      stateChanged: (event) => {
        if (event.newState instanceof AbstractDisplacementState) {
          const deRegister = engine.getActionEventBus().registerAction(
            new Action<DiagramEngine>({
              type: InputType.MOUSE_UP,
              fire: () => {
                this.calculateGridDimensions();
                engine.repaintCanvas();
                deRegister();
              },
            }),
          );
        }
      },
    });

    engine.registerListener({
      canvasReady: () => {
        defer(() => {
          this.calculateGridDimensions();
          engine.repaintCanvas();
        });
      },
    });
  }

  calculateGridDimensions = (): void => {
    const allNodesCoords = values(this.engine.getModel().getNodes()).map(
      (item) => ({
        x: item.getX(),
        width: item.getWidth(),
        y: item.getY(),
        height: item.getHeight(),
      }),
    );

    const allLinks = values(this.engine.getModel().getLinks());
    const allPortsCoords = flatMap(
      allLinks.map((link) => [link.getSourcePort(), link.getTargetPort()]),
    )
      .filter((port) => port !== null)
      .map((item) => ({
        x: item.getX(),
        width: item.getWidth(),
        y: item.getY(),
        height: item.getHeight(),
      }));

    const sumProps = (object, props) =>
      reduce(props, (acc, prop) => acc + get(object, prop, 0), 0);

    const canvas = this.engine.getCanvas() as HTMLDivElement;
    const concatedCoords = concat(allNodesCoords, allPortsCoords);
    const minX =
      Math.floor(
        Math.min(get(minBy(concatedCoords, 'x'), 'x', 0), 0) /
          GridFactory.SCALING_FACTOR,
      ) * GridFactory.SCALING_FACTOR;
    const maxXElement = maxBy(concatedCoords, (item) =>
      sumProps(item, ['x', 'width']),
    );
    const maxX = Math.max(
      sumProps(maxXElement, ['x', 'width']),
      canvas.offsetWidth,
    );
    const minYCoords = minBy(concatedCoords, 'y');
    const minY =
      Math.floor(
        Math.min(get(minYCoords, 'y', 0), 0) / GridFactory.SCALING_FACTOR,
      ) * GridFactory.SCALING_FACTOR;
    const maxYElement = maxBy(concatedCoords, (item) =>
      sumProps(item, ['y', 'height']),
    );
    const maxY = Math.max(
      sumProps(maxYElement, ['y', 'height']),
      canvas.offsetHeight,
    );

    this.dimensions = {
      width: Math.ceil(Math.abs(minX) + maxX),
      hAdjustmentFactor: Math.abs(minX) / GridFactory.SCALING_FACTOR + 1,
      height: Math.ceil(Math.abs(minY) + maxY),
      vAdjustmentFactor: Math.abs(minY) / GridFactory.SCALING_FACTOR + 1,
    };
  };

  getModelArea = (model: BasePositionModel, offset = 0): GridArea => {
    const startX = Math.floor(
      (model.getX() - offset) / GridFactory.SCALING_FACTOR,
    );
    const endX = Math.ceil(
      (model.getX() + offset + model.getWidth()) / GridFactory.SCALING_FACTOR,
    );
    const startY = Math.floor(
      (model.getY() - offset) / GridFactory.SCALING_FACTOR,
    );
    const endY = Math.ceil(
      (model.getY() + offset + model.getHeight()) / GridFactory.SCALING_FACTOR,
    );

    return {
      startX,
      endX,
      startY,
      endY,
    };
  };

  generateModel(event: GenerateModelEvent): GridModel {
    const sourcePort: PortModel = event.initialConfig.sourcePort;
    const targetPort: PortModel = event.initialConfig.targetPort;

    const {
      width,
      height,
      hAdjustmentFactor,
      vAdjustmentFactor,
    } = this.dimensions;

    const grid = new Grid(width, height);

    const model = new GridModel({
      grid,
      hAdjustmentFactor,
      vAdjustmentFactor,
    });

    const sourceNodeArea = this.getModelArea(
      sourcePort.getNode(),
      GridFactory.NODE_GRID_OFFSET,
    );
    const targetNodeArea = this.getModelArea(
      targetPort.getNode(),
      GridFactory.NODE_GRID_OFFSET,
    );

    const targetPortArea = this.getModelArea(targetPort);

    model.markArea(sourceNodeArea, false);
    model.markArea(targetNodeArea, false);
    model.markArea(targetPortArea, true);

    return model;
  }
}
