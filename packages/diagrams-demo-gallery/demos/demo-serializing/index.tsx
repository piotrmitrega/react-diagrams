import createEngine, { DiagramModel, DefaultNodeModel, RightAngleLinkFactory } from '@piotrmitrega/react-diagrams';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { action } from '@storybook/addon-actions';
import { CanvasWidget } from '@piotrmitrega/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import json from './example';
import { SubscribeToEventsButton } from '../helpers/SubscribeToEventsButton';
import { SerializeButton } from '../helpers/SerializeButton';

export default () => {
	//1) setup the diagram engine
	var engine = createEngine();
	engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	// var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	// var port1 = node1.addOutPort('Out');
	// node1.setPosition(100, 100);
	//
	// //3-B) create another default node
	// var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	// var port2 = node2.addInPort('In');
	// node2.setPosition(400, 100);
	//
	// //3-C) link the 2 nodes together
	// var link1 = port1.link(port2);
	//
	// //4) add the models to the root graph
	// model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);

	//!------------- SERIALIZING ------------------

	var str = JSON.stringify(model.serialize());

	//!------------- DESERIALIZING ----------------

	return (
		<DemoWorkspaceWidget
			buttons={
				[
					<SubscribeToEventsButton model={model} />,
					<SerializeButton model={model} />,
					<DemoButton
						onClick={() => {
							action('Deserialize Graph')(
								model.deserializeLayersModels(engine, JSON.parse(json))
							);
						}}>
						Deserialize Graph (add)
					</DemoButton>,
				]
			}>
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		</DemoWorkspaceWidget>
	);
};
