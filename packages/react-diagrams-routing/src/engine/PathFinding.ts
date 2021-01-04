import * as PF from 'pathfinding';
import { DiagonalMovement } from 'pathfinding';
import { PathFindingLinkFactory } from '../link/PathFindingLinkFactory';
import { Point } from '@piotrmitrega/geometry';

/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/

const pathFinderInstance = new PF.BiBestFirstFinder({
	diagonalMovement: DiagonalMovement.Never,
	avoidStaircase: true,
	turnPenalty: 1,
});
// const pathFinderInstance = new PF.JumpPointFinder({
// 	heuristic: PF.Heuristic.manhattan,
// 	diagonalMovement: PF.DiagonalMovement.Never
// });

export default class PathFinding {
	instance: any;
	factory: PathFindingLinkFactory;
	routingGrid: PF.Grid;

	constructor(factory: PathFindingLinkFactory) {
		this.instance = pathFinderInstance;
		this.factory = factory;
	}

	/**
	 * Taking as argument a fully unblocked walking matrix, this method
	 * finds a direct path from point A to B.
	 */
	calculateDirectPath(from: Point, to: Point): number[][] {
		const matrix = this.factory.getRoutingMatrix();
		const grid = new PF.Grid(matrix);

		// console.log(this.factory.drawOnMatrix(matrix, [
		// 	[this.factory.translateRoutingX(Math.floor(from.x / this.factory.ROUTING_SCALING_FACTOR)),
		// 		this.factory.translateRoutingY(Math.floor(from.y / this.factory.ROUTING_SCALING_FACTOR))],
		// 	[this.factory.translateRoutingX(Math.floor(to.x / this.factory.ROUTING_SCALING_FACTOR)),
		// 		this.factory.translateRoutingY(Math.floor(to.y / this.factory.ROUTING_SCALING_FACTOR))]
		// ]));

		const path = pathFinderInstance.findPath(
			this.factory.translateRoutingX(Math.floor(from.x / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingY(Math.floor(from.y / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingX(Math.floor(to.x / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingY(Math.floor(to.y / this.factory.ROUTING_SCALING_FACTOR)),
			grid
		);

		const mappedPath = path.map((coords) => [
			this.factory.translateRoutingX(coords[0], true),
			this.factory.translateRoutingY(coords[1], true)
		]);
		// console.log(path, mappedPath)
		return PF.Util.compressPath(mappedPath);
		// return mappedPath;
	}

	/**
	 * Using @link{#calculateDirectPath}'s result as input, we here
	 * determine the first walkable point found in the matrix that includes
	 * blocked paths.
	 */
	calculateLinkStartEndCoords(
		matrix: number[][],
		path: number[][]
	): {
		start: {
			x: number;
			y: number;
		};
		end: {
			x: number;
			y: number;
		};
		pathToStart: number[][];
		pathToEnd: number[][];
	} {
		const startIndex = path.findIndex((point) => {
			if (matrix[point[1]]) return matrix[point[1]][point[0]] === 0;
			else return false;
		});
		const endIndex =
			path.length -
			1 -
			path
				.slice()
				.reverse()
				.findIndex((point) => {
					if (matrix[point[1]]) return matrix[point[1]][point[0]] === 0;
					else return false;
				});

		// are we trying to create a path exclusively through blocked areas?
		// if so, let's fallback to the linear routing
		if (startIndex === -1 || endIndex === -1) {
			return undefined;
		}

		const pathToStart = path.slice(0, startIndex);
		const pathToEnd = path.slice(endIndex);

		return {
			start: {
				x: path[startIndex][0],
				y: path[startIndex][1]
			},
			end: {
				x: path[endIndex][0],
				y: path[endIndex][1]
			},
			pathToStart,
			pathToEnd
		};
	}

	//
	// calc(		routingMatrix: number[][],
	// 				 start: {
	// 					 x: number;
	// 					 y: number;
	// 				 },
	// 				 end: {
	// 					 x: number;
	// 					 y: number;
	// 				 },
	// ) {
	// 	const grid = new PF.Grid(routingMatrix);
	// 	const dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);
	//
	// }
	/**
	 * Puts everything together: merges the paths from/to the centre of the ports,
	 * with the path calculated around other elements.
	 */
	calculateDynamicPath(
		routingMatrix: number[][],
		start: {
			x: number;
			y: number;
		},
		end: {
			x: number;
			y: number;
		},
		pathToStart: number[][],
		pathToEnd: number[][]
	) {
		// generate the path based on the matrix with obstacles
		const grid = new PF.Grid(routingMatrix);

		// for (let y = 0; y < grid.height; y++) {
		// 	for (let x  = 0; x < grid.width; x++) {
		// 		grid.setWalkableAt(x,y, !Boolean(routingMatrix[y][x]));
		// 	}
		// }

		console.log(grid);
		console.log(start, end);
		const dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);

		console.log(grid.isWalkableAt(start.x, start.y));
		console.log(grid.isWalkableAt(end.x, end.y));

		console.log('didi', dynamicPath);
		console.log(this.factory.drawOnMatrix(routingMatrix, dynamicPath));

		// aggregate everything to have the calculated path ready for rendering
		const pathCoords =
			// pathToStart
			// .concat(dynamicPath, pathToEnd)
			[start, end]
				.map((coords) => [
					this.factory.translateRoutingX(coords[0], true),
					this.factory.translateRoutingY(coords[1], true)
				]);
		// return PF.Util.compressPath(pathCoords);
		console.log('didi2', pathCoords);

		return pathCoords;
		// return PF.Util.compressPath(pathCoords);
	}
}

export { PathFinding };