import { DiagramEngine, PathModel, PortModel } from '@piotrmitrega/react-diagrams-core';
import { AbstractModelFactory, GenerateModelEvent } from '@piotrmitrega/react-canvas-core';
import PathFinding from '../engine/PathFinding';
import { PathFindingLinkFactory } from '..';
import { RightAngleLinkFactory } from '..';
import { Point } from '@piotrmitrega/geometry';

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

		const routingMatrix = this.pathFindingFactory.getRoutingMatrix();
		const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
		const { start, end, pathToStart, pathToEnd } = smartLink;

		const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
		const points = this.pathFindingFactory.generateDynamicPathPoints(simplifiedPath);
		// remove first point since it's known
		points.splice(0, 1);
		// we know the last point and for some reason it is duplicated, that's why removing 2
		points.splice(points.length - 2, 2);

		return points.map(p => new Point(p[0], p[1]));
	}

	generateModel(event: GenerateModelEvent): PathModel {
		const sourcePort: PortModel = event.initialConfig.sourcePort;
		const targetPort: PortModel = event.initialConfig.targetPort;

		const firstPoint = sourcePort.getCenter();
		const portOffsetPoint = targetPort.getOffsetPosition();
		const lastPoint = targetPort.getCenter();

		const calculatedPath = this.findPath(firstPoint, portOffsetPoint);

		const points = [
			firstPoint,
			...calculatedPath,
			portOffsetPoint,
			lastPoint
		];

		return new PathModel({ points });
	}
}