import { Point } from '@piotrmitrega/geometry';

export enum Direction {
	X = 1,
	Y = 0
}

export class RightAngleLinkPathDirections {
	points: Point[];
	directions: Direction[];

	constructor(points: Point[]) {
		this.points = points;

		this.calculateDirections();
	}

	calculateDirections = () => {
		this.directions = [];

		for (let i = 1; i < this.points.length; i++) {
			const dx = Math.abs(this.points[i].x - this.points[i - 1].x);
			const dy = Math.abs(this.points[i].y - this.points[i - 1].y);

			const isXDirection = dx > dy ? Direction.X : Direction.Y;

			this.directions.push(isXDirection);
		}
	};

	isDirectionChangedAfterPoint(pointIndex: number) {
		if (pointIndex === 0 || pointIndex > this.points.length - 1) {
			throw new Error(`Point out of bounds: ${pointIndex}. Points count: ${this.points.length}`);
		}

		const directionIndex = pointIndex - 1;
		const directionAtPoint = this.directions[pointIndex - 1];

		return this.directions
			.slice(directionIndex + 1)
			.some(nextDirection => nextDirection !== directionAtPoint);
	}

	getLastPathDirection(): Direction {
		return this.directions[this.directions.length - 1];
	}

	getFirstPathDirection(): Direction {
		return this.directions[0];
	}
}