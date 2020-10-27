import { DiagramEngine, PortModel } from '@piotrmitrega/react-diagrams';
import { AbstractModelFactory } from '@piotrmitrega/react-canvas-core';

export class SimplePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	generateModel(event): PortModel {
		return this.cb(event.initialConfig);
	}
}
