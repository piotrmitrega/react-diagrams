import {
  DiagramEngine,
  PathModel,
  PortModel,
} from '@piotrmitrega/react-diagrams-core';
import {
  AbstractModelFactory,
  GenerateModelEvent,
} from '@piotrmitrega/react-canvas-core';
import { PathFinding } from '../engine/PathFinding';
import { getRightAnglePoint, RightAngleLinkFactory } from '..';
import { Point } from '@piotrmitrega/geometry';
import {
  Direction,
  RightAngleLinkPathDirections,
} from '../link/RightAngleLinkPathDirections';
import { GridFactory } from './GridFactory';
import * as Path from 'paths-js/path';
import { GridModel } from './GridModel';

export class RightAnglePathFactory extends AbstractModelFactory<
  PathModel,
  DiagramEngine
> {
  private pathFinding: PathFinding;
  private gridFactory: GridFactory;

  constructor() {
    super(RightAngleLinkFactory.NAME);

    this.gridFactory = new GridFactory();
    this.pathFinding = new PathFinding();
  }

  setDiagramEngine(engine: DiagramEngine) {
    super.setDiagramEngine(engine);

    this.gridFactory.setDiagramEngine(engine);
  }

  getFallbackPathCoords = (startPoint: Point, endPoint: Point) => {
    const middlePoint = getRightAnglePoint(startPoint, endPoint);

    return [startPoint, middlePoint, endPoint].map((point) => [
      point.x,
      point.y,
    ]);
  };

  findPath(startPoint: Point, endPoint: Point, grid: GridModel): number[][] {
    const directPathCoords = [];
    this.pathFinding.calculateDirectPath(startPoint, endPoint, grid);

    if (!directPathCoords || !directPathCoords.length) {
      const fallbackPathCoords = this.getFallbackPathCoords(
        startPoint,
        endPoint,
      );

      return this.generateDynamicPathPoints(fallbackPathCoords);
    }

    return this.generateDynamicPathPoints(
      directPathCoords,
      GridFactory.SCALING_FACTOR,
    );
  }

  generateDynamicPathPoints(
    pathCoords: number[][],
    scalingFactor = 1,
  ): number[][] {
    let path = Path();
    path = path.moveto(
      pathCoords[0][0] * scalingFactor,
      pathCoords[0][1] * scalingFactor,
    );
    pathCoords.slice(1).forEach((coords) => {
      path = path.lineto(coords[0] * scalingFactor, coords[1] * scalingFactor);
    });

    return path.points();
  }

  alignPoint(
    referencePoint: Point,
    targetPoint: Point,
    direction: Direction,
  ): void {
    if (direction === Direction.X) {
      targetPoint.y = referencePoint.y;
    } else {
      targetPoint.x = referencePoint.x;
    }
  }

  //align coordinates of pathfinding path to match first and last point
  alignPath(path: Point[]): void {
    const directions = new RightAngleLinkPathDirections(path);

    for (let i = path.length - 1; i >= 1; i--) {
      if (directions.isDirectionChangedBeforePoint(i)) {
        const direction = directions.getPathDirection(i);
        this.alignPoint(path[i], path[i - 1], direction);
      } else {
        const direction = directions.getPathDirection(i);

        this.alignPoint(path[0], path[i - 1], direction);
      }
    }
  }

  removePointsInBetween(path: Point[]) {
    const toRemove = [];

    for (let i = 0; i < path.length - 1; i += path.length - 3) {
      try {
        const points = [path[i], path[i + 1], path[i + 2]];

        const xPositions = points.map((point) => point.x);
        const yPositions = points.map((point) => point.y);

        if (xPositions.every((x) => x === xPositions[0])) {
          if (
            (points[1].y > points[0].y && points[2].y < points[0].y) ||
            (points[1].y < points[0].y && points[2].y > points[0].y)
          ) {
            toRemove.push(i);
          }
        }

        if (yPositions.every((y) => y === yPositions[0])) {
          if (
            (points[1].x > points[0].x && points[2].x < points[0].x) ||
            (points[1].x < points[0].x && points[2].x > points[0].x)
          ) {
            toRemove.push(i);
          }
        }
      } catch (e) {
        console.log(i, path, length, e);
      }
    }

    const result = [...path];
    toRemove.reverse().forEach((index) => {
      result.splice(index, 1);
    });

    return result;
  }

  generateModel(event: GenerateModelEvent): PathModel {
    const sourcePort: PortModel = event.initialConfig.sourcePort;
    const targetPort: PortModel = event.initialConfig.targetPort;

    const grid = this.gridFactory.generateModel(event);

    const calculatedPath = this.findPath(
      sourcePort.getOffsetPosition(),
      targetPort.getOffsetPosition(),
      grid,
    );

    // replace start and end point since they might get a bit of offset due to
    // converting to pathfinding coordinates and being rescaled
    const fullPath = [
      sourcePort.getOffsetPosition(),
      ...calculatedPath
        .slice(1, calculatedPath.length - 1)
        .map((p) => new Point(p[0], p[1])),
      targetPort.getOffsetPosition(),
    ];

    this.alignPath(fullPath);

    return new PathModel({ points: fullPath });
  }
}
