import { PathFinding } from '../../PathFinding';
import {
  Direction,
  RightAngleLinkPathDirections,
} from '../link/RightAngleLinkPathDirections';
import { GridFactory } from './GridFactory';
import Path from 'paths-js/path';
import { GridModel } from './GridModel';
import {
  AbstractModelFactory,
  GenerateModelEvent,
} from '../../core/AbstractModelFactory';
import { PathModel } from './PathModel';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkType } from '../link/LinkType';
import { Point } from '../../geometry';
import { getRightAnglePoint } from '../link/RightAngleLinkModel';
import { PortModel } from '../port/PortModel';

export class RightAnglePathFactory extends AbstractModelFactory<
  PathModel,
  DiagramEngine
> {
  private pathFinding: PathFinding;
  private gridFactory: GridFactory;

  constructor() {
    super(LinkType.RIGHT_ANGLE);

    this.gridFactory = new GridFactory();
    this.pathFinding = new PathFinding();
  }

  setDiagramEngine(engine: DiagramEngine) {
    super.setDiagramEngine(engine);

    this.gridFactory.setDiagramEngine(engine);
  }

  getFallbackPathCoords = (startPoint: Point, endPoint: Point) => {
    const middlePoint = getRightAnglePoint(startPoint, endPoint);

    return [startPoint, middlePoint, endPoint];
  };

  findPath(startPoint: Point, endPoint: Point, grid: GridModel): Point[] {
    const directPathCoords = this.pathFinding.calculateDirectPath(
      startPoint,
      endPoint,
      grid,
    );

    if (!directPathCoords || !directPathCoords.length) {
      return [];
    }

    const directPathPoints = this.generateDynamicPathPoints(directPathCoords);

    // replace start and end point since they might get a bit of offset due to
    // converting to pathfinding coordinates and being rescaled
    const calculatedPathPoints = directPathPoints
      .slice(1, directPathCoords.length - 1)
      .map((p) => new Point(p[0], p[1]));

    const path = [startPoint, ...calculatedPathPoints, endPoint];

    this.alignPath(path);

    return path;
  }

  generateDynamicPathPoints(pathCoords: number[][]): number[][] {
    let path = Path();
    path = path.moveto(
      pathCoords[0][0] * GridFactory.SCALING_FACTOR,
      pathCoords[0][1] * GridFactory.SCALING_FACTOR,
    );
    pathCoords.slice(1).forEach((coords) => {
      path = path.lineto(
        coords[0] * GridFactory.SCALING_FACTOR,
        coords[1] * GridFactory.SCALING_FACTOR,
      );
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

  generateModel(event: GenerateModelEvent): PathModel {
    const sourcePort: PortModel = event.initialConfig.sourcePort;
    const targetPort: PortModel = event.initialConfig.targetPort;

    const grid = this.gridFactory.generateModel(event);

    const calculatedPath = this.findPath(
      sourcePort.getOffsetPosition(),
      targetPort.getOffsetPosition(),
      grid,
    );

    if (!calculatedPath.length) {
      const fallbackPath = this.getFallbackPathCoords(
        sourcePort.getOffsetPosition(),
        targetPort.getOffsetPosition(),
      );

      return new PathModel({ points: fallbackPath });
    }

    return new PathModel({ points: calculatedPath });
  }
}
