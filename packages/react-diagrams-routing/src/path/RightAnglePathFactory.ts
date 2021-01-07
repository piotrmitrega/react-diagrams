import { DiagramEngine, PathModel, PortModel } from '@piotrmitrega/react-diagrams-core';
import { AbstractModelFactory, GenerateModelEvent } from '@piotrmitrega/react-canvas-core';
import { PathFinding } from '../engine/PathFinding';
import { RightAngleLinkFactory } from '..';
import { Point } from '@piotrmitrega/geometry';
import { Direction, RightAngleLinkPathDirections } from '../link/RightAngleLinkPathDirections';
import { GridFactory } from './GridFactory';
import * as Path from 'paths-js/path';
import { GridModel } from './GridModel';

export class RightAnglePathFactory extends AbstractModelFactory<PathModel, DiagramEngine> {
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

	findPath(startPoint: Point, endPoint: Point, grid: GridModel): Point[] {
		const directPathCoords = this.pathFinding.calculateDirectPath(
			startPoint,
			endPoint,
			grid
		);

		const points = this.generateDynamicPathPoints(directPathCoords);

		return points.map(p => new Point(p[0], p[1]));
	}

	generateDynamicPathPoints(pathCoords: number[][]): number[][] {
		let path = Path();
		console.log(pathCoords);
		path = path.moveto(pathCoords[0][0] * GridFactory.SCALING_FACTOR, pathCoords[0][1] * GridFactory.SCALING_FACTOR);
		pathCoords.slice(1).forEach((coords) => {
			path = path.lineto(coords[0] * GridFactory.SCALING_FACTOR, coords[1] * GridFactory.SCALING_FACTOR);
		});
		return path.points();
	}

	alignPoint(referencePoint: Point, targetPoint: Point, direction: Direction): void {
		if (direction === Direction.X) {
			console.log(`Y: ${targetPoint.y} -> ${referencePoint.y}`);
			targetPoint.y = referencePoint.y;
		} else {
			console.log(`X: ${targetPoint.x} -> ${referencePoint.x}`);
			targetPoint.x = referencePoint.x;
		}
	};

	//align coordinates of pathfinding path to match first and last point
	alignPath(path: Point[]): void {
		const directions = new RightAngleLinkPathDirections(path);

		for (let i = path.length - 1; i >= 1; i--) {

			if (directions.isDirectionChangedBeforePoint(i)) {
				const direction = directions.getPathDirection(i);
				console.log(`point ${i - 1} is aligning according to ${i}. Direction: ${direction}.`);
				this.alignPoint(path[i], path[i - 1], direction);
			} else {
				const direction = directions.getPathDirection(i);
				console.log(`point ${i - 1} is aligning according to ${i}. Direction: ${direction}`);

				this.alignPoint(path[0], path[i - 1], direction);
			}
		}
	}

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
						toRemove.push(i );
					}
				}

				if (yPositions.every(y => y === yPositions[0])) {
					if (points[1].x > points[0].x && points[2].x < points[0].x
						|| points[1].x < points[0].x && points[2].x > points[0].x) {
						console.log('Y Found in between point.', i + 1);
						toRemove.push(i );
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

		const grid = this.gridFactory.generateModel(event);

		const calculatedPath = this.findPath(
			sourcePort.getOffsetPosition(),
			targetPort.getOffsetPosition(),
			grid
		);

		const fullPath = [
			sourcePort.getCenter(),
			...calculatedPath,
			targetPort.getCenter()
		];
		this.alignPath(fullPath);

		const sanitizedPath = this.removePointsInBetween(fullPath);

		console.log('sanitized', sanitizedPath.map(p => p.toSVG()));

		this.alignPath(sanitizedPath);

		console.log('aligned', sanitizedPath.map(p => p.toSVG()));

		return new PathModel({ points: sanitizedPath });
	}
}