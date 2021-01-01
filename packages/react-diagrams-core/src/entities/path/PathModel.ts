import { BaseModel, BaseModelGenerics, BaseModelOptions } from '@piotrmitrega/react-canvas-core';
import { Point } from '@piotrmitrega/geometry';

export interface PathModelOptions extends BaseModelOptions {
	points: Point[]
}

export interface PathModelGenerics extends BaseModelGenerics {
	OPTIONS: PathModelOptions;
}

export class PathModel<G extends PathModelGenerics = PathModelGenerics> extends BaseModel<G> {
	constructor(options: G['OPTIONS']) {
		super(options);
	}

	getPoints() {
		return this.options.points;
	}
}