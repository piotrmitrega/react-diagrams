import { DiagramEngine, PathModel, PortModel } from '@piotrmitrega/react-diagrams-core';
import { AbstractModelFactory, GenerateModelEvent } from '@piotrmitrega/react-canvas-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory, RightAngleLinkFactory } from '..';
import { Point } from '@piotrmitrega/geometry';
import { Direction, RightAngleLinkPathDirections } from '../link/RightAngleLinkPathDirections';

export class RightAnglePathFactory extends AbstractModelFactory<PathModel, DiagramEngine> {
	private pathFinding: PathFinding;
	private pathFindingFactory: PathFindingLinkFactory;

	constructor(pathFindingFactory: PathFindingLinkFactory) {
		super(RightAngleLinkFactory.NAME);

		this.pathFindingFactory = pathFindingFactory;
		this.pathFinding = new PathFinding(this.pathFindingFactory);
	}

	findPath(startPoint: Point, endPoint: Point): Point[] {
		const directPathCoords = this.pathFinding.calculateDirectPath(
			startPoint,
			endPoint
		);
		//
		// console.log('direct', startPoint, endPoint, directPathCoords)
		// const routingMatrix = this.pathFindingFactory.getRoutingMatrix();
		// console.log('routing', routingMatrix);
		// console.log('routing with direct path', this.pathFindingFactory.drawOnMatrix(routingMatrix, directPathCoords));
		//
		// const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
		// const { start, end, pathToStart, pathToEnd } = smartLink;
		//
		// console.log(smartLink)
		// const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
		// // const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, [[]], [[]]);
		// console.log('routing with simple path', this.pathFindingFactory.drawOnMatrix(routingMatrix, simplifiedPath));
		const points = this.pathFindingFactory.generateDynamicPathPoints(directPathCoords);
		// // remove first point since it's known
		// points.splice(0, 1);
		// // we know the last point and for some reason it is duplicated, that's why removing 2
		// points.splice(points.length - 1, 1);

		return points.map(p => new Point(p[0], p[1]));
	}

	alignPoint(referencePoint: Point, targetPoint: Point, direction: Direction): Point {
		return direction === Direction.X
			? new Point(targetPoint.x, referencePoint.y)
			: new Point(referencePoint.x, targetPoint.y);
	};

	//align coordinates of pathfinding path to match first and last point
	alignPath(path: Point[]): Point[] {
		const directions = new RightAngleLinkPathDirections(path);
		const alignedPath = [path[path.length - 1]];

		for (let i = path.length - 1; i >= 1; i--) {
			const currentDirection = directions.getPathDirection(i);

			if (directions.isDirectionChangedBeforePoint(i)) {
				const direction = directions.getPathDirection(i);
				console.log(`point ${i - 1} is aligning according to ${i}. Direction: ${direction}`);
				alignedPath.push(this.alignPoint(path[i], path[i - 1], direction));
			} else {
				const direction = directions.getPathDirection(i);
				console.log(`point ${i - 1} is aligning according to ${i}. Direction: ${direction}`);

				alignedPath.push(this.alignPoint(path[0], path[i - 1], direction));
			}
		}

		return alignedPath.reverse();
	}

	// alignPath(path: Point[]): Point[] {
	// 	const directions = new RightAngleLinkPathDirections(path);
	// 	const alignedPath = [path[path.length - 1]];
	//
	// 	let turnedLastTime = false;
	//
	// 	for (let i = path.length - 2; i >= 1; i--) {
	// 		if (directions.isDirectionChangedBeforePoint(i)) {
	// 			const direction = directions.getPathDirection(i + 1);
	//
	// 			alignedPath.push(this.alignPoint(path[i + 1], path[i], direction));
	// 		} else {
	// 			const direction = directions.getPathDirection(i);
	//
	// 			if (turnedLastTime) {
	// 				alignedPath.push(this.alignPoint(path[0], path[i], direction));
	// 			} else {
	// 				turnedLastTime = true;
	// 				alignedPath.push(this.alignPoint(path[0], path[i + 1], direction));
	// 			}
	// 		}
	// 	}
	//
	// 	alignedPath.push(path[0]);
	//
	// 	return alignedPath.reverse();
	// }

	removePointsInBetween(path: Point[]) {
		const toRemove = [];

		for (let i = 0; i < path.length - 2; i += path.length - 3) {
			try {
				const points = [
					path[i],
					path[i + 1],
					path[i + 2]
				];

				console.log(points, i);
				const xPositions = points.map(point => point.x);
				const yPositions = points.map(point => point.y);


				if (xPositions.every(x => x === xPositions[0])) {
					if (points[1].y > points[0].y && points[2].y < points[0].y
						|| points[1].y < points[0].y && points[2].y > points[0].y) {
						console.log('X Found in between point.', i + 1);
						toRemove.push(i + 1);
					}
				}

				if (yPositions.every(y => y === yPositions[0])) {
					if (points[1].x > points[0].x && points[2].x < points[0].x
						|| points[1].x < points[0].x && points[2].x > points[0].x) {
						console.log('Y Found in between point.', i + 1);
						toRemove.push(i + 1);
					}
				}
			} catch (e) {
				console.log(i, path, length, e);
			}
		}

		const result = [...path];
		console.log(result);
		toRemove.reverse().forEach(index => {
			result.splice(index, 1);
		});
		console.log(result);

		return result;
	}

	generateModel(event: GenerateModelEvent): PathModel {
		const sourcePort: PortModel = event.initialConfig.sourcePort;
		const targetPort: PortModel = event.initialConfig.targetPort;

		const calculatedPath = this.findPath(
			sourcePort.getOffsetPosition(),
			targetPort.getOffsetPosition());

		const fullPath = [
			sourcePort.getCenter(),
			...calculatedPath,
			targetPort.getCenter()
		];

		const sanitizedPath = this.removePointsInBetween(fullPath);
		const alignedPath = this.alignPath(sanitizedPath);

		return new PathModel({ points: alignedPath });
	}
}