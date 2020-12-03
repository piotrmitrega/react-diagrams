import createEngine, {
	DiagramModel,
	DefaultPortModel,
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
export class RightAnglePortModel extends DefaultPortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new RightAngleLinkModel();
	}
}

export default () => {
	// setup the diagram engine
	const engine = createEngine();
	engine.getNodeFactories().registerFactory(new DiamondNodeFactory());
	engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());

	// setup the diagram model
	const model = new DiagramModel();

	// create four nodes in a way that straight links wouldn't work
	const node1 = new DiamondNodeModel();
	// const port1 = node1.addPort(new RightAnglePortModel(false, 'out-1', 'Out'));
	node1.setPosition(340, 350);

	const node2 = new DiamondNodeModel();
	// const port2 = node2.addPort(new RightAnglePortModel(false, 'out-1', 'Out'));
	node2.setPosition(240, 80);
	const node3 = new DiamondNodeModel();
	// const port3 = node3.addPort(new RightAnglePortModel(true, 'in-1', 'In'));
	node3.setPosition(540, 180);
	const node4 = new DiamondNodeModel();
	// const port4 = node4.addPort(new RightAnglePortModel(true, 'in-1', 'In'));
	node4.setPosition(95, 185);
	//
	// // linking things together
	// const link1 = port1.link(port4);
	// const link2 = port2.link(port3);

	// add all to the main model
	model.addAll(node1, node2, node3, node4);

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
