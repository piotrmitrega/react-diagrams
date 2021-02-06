import createEngine, {
	DiagramModel,
	PortModel,
	RightAngleLinkFactory,
	LinkModel,
	RightAngleLinkModel
} from '@piotrmitrega/react-diagrams';
import * as React from 'react';
import { DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { AbstractModelFactory, CanvasWidget } from '@piotrmitrega/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { DiamondNodeModel } from '../helpers/DiamondNodeModel';
import { DiamondNodeFactory } from '../helpers/DiamondNodeFactory';
import { SubscribeToEventsButton } from '../helpers/SubscribeToEventsButton';
import { SerializeButton } from '../helpers/SerializeButton';

// When new link is created by clicking on port the RightAngleLinkModel needs to be returned.
export class RightAnglePortModel extends PortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new RightAngleLinkModel({});
	}
}

export default () => {
	// setup the diagram engine
	const engine = createEngine();
	engine.getNodeFactories().registerFactory(new DiamondNodeFactory());
	engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());

	// setup the diagram model
	const model = new DiagramModel();

	const positions = [
		[340, 350],
		[240, 80],
		[540, 180],
		[95,185],
		[304,190]
	];

	positions.forEach(position => {
		const node = new DiamondNodeModel();
		node.setPosition(position[0], position[1]);
		model.addNode(node)
	})

	// load model into engine and render
	engine.setModel(model);

	let eventsSubscribed = false;

	return (
		<DemoWorkspaceWidget
			buttons={[
				<SerializeButton model={model} />,
				<SubscribeToEventsButton model={model} />
			]}>
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		</DemoWorkspaceWidget>
	);
};
