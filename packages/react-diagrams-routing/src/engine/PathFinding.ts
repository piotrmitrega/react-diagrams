import * as PF from 'pathfinding';
import { DiagonalMovement } from 'pathfinding';
import { Point } from '@piotrmitrega/geometry';
import { GridModel } from '../path/GridModel';
import { GridFactory } from '../path/GridFactory';

/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/

export const Grid = PF.Grid;

const pathFinderInstance = new PF.BestFirstFinder({
	diagonalMovement: DiagonalMovement.Never,
	avoidStaircase: true,
	turnPenalty: 5
});

export class PathFinding {
	instance: any;

	constructor() {
		this.instance = pathFinderInstance;
	}

	calculateDirectPath(from: Point, to: Point, gridModel: GridModel): number[][] {
		const path = pathFinderInstance.findPath(
			gridModel.translateRoutingX(Math.floor(from.x / GridFactory.SCALING_FACTOR)),
			gridModel.translateRoutingY(Math.floor(from.y / GridFactory.SCALING_FACTOR)),
			gridModel.translateRoutingX(Math.floor(to.x / GridFactory.SCALING_FACTOR)),
			gridModel.translateRoutingY(Math.floor(to.y / GridFactory.SCALING_FACTOR)),
			gridModel.getOptions().grid
		);

		const mappedPath = path.map((coords) => [
			gridModel.translateRoutingX(coords[0], true),
			gridModel.translateRoutingY(coords[1], true)
		]);

		return PF.Util.compressPath(mappedPath);
	}
}