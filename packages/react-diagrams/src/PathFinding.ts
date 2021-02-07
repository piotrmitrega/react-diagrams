import * as PF from 'pathfinding';
import { Point } from './geometry';
import { GridFactory } from './entities/path/GridFactory';
import { GridModel } from './entities/path/GridModel';

/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/

export const Grid = PF.Grid;

const pathFinderInstance = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.Never,
  avoidStaircase: true,
  turnPenalty: 5,
});

export class PathFinding {
  instance: any;

  constructor() {
    this.instance = pathFinderInstance;
  }

  calculateDirectPath(
    from: Point,
    to: Point,
    gridModel: GridModel,
  ): number[][] {
    const path = pathFinderInstance.findPath(
      gridModel.translateRoutingX(
        Math.floor(from.x / GridFactory.SCALING_FACTOR),
      ),
      gridModel.translateRoutingY(
        Math.floor(from.y / GridFactory.SCALING_FACTOR),
      ),
      gridModel.translateRoutingX(
        Math.floor(to.x / GridFactory.SCALING_FACTOR),
      ),
      gridModel.translateRoutingY(
        Math.floor(to.y / GridFactory.SCALING_FACTOR),
      ),
      gridModel.getOptions().grid,
    );

    const mappedPath = path.map((coords) => [
      gridModel.translateRoutingX(coords[0], true),
      gridModel.translateRoutingY(coords[1], true),
    ]);

    return PF.Util.compressPath(mappedPath);
  }
}
