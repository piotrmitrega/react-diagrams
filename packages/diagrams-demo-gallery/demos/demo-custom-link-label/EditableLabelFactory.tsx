import * as React from 'react';
import { AbstractReactFactory, GenerateWidgetEvent } from '@piotrmitrega/react-canvas-core';
import { DiagramEngine } from '@piotrmitrega/react-diagrams';

import { EditableLabelModel } from './EditableLabelModel';
import { EditableLabelWidget } from './EditableLabelWidget';

export class EditableLabelFactory extends AbstractReactFactory<EditableLabelModel, DiagramEngine> {
	constructor() {
		super('editable-label');
	}

	generateModel(): EditableLabelModel {
		return new EditableLabelModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<EditableLabelModel>): JSX.Element {
		return <EditableLabelWidget model={event.model} />;
	}
}
