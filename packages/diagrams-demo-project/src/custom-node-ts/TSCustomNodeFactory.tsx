import * as React from 'react';
import { TSCustomNodeModel } from './TSCustomNodeModel';
import { TSCustomNodeWidget } from './TSCustomNodeWidget';
import { AbstractReactFactory } from '@piotrmitrega/react-canvas-core';
import { DiagramEngine } from '@piotrmitrega/react-diagrams-core';

export class TSCustomNodeFactory extends AbstractReactFactory<TSCustomNodeModel, DiagramEngine> {
	constructor() {
		super('ts-custom-node');
	}

	generateModel(initialConfig) {
		return new TSCustomNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <TSCustomNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
