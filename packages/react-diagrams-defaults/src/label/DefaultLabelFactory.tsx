import * as React from 'react';
import { DefaultLabelModel } from './DefaultLabelModel';
import { DefaultLabelWidget } from './DefaultLabelWidget';
import { AbstractReactFactory } from '@piotrmitrega/react-canvas-core';
import { DiagramEngine } from '@piotrmitrega/react-diagrams-core';

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultLabelWidget model={event.model} />;
	}

	generateModel(event): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
