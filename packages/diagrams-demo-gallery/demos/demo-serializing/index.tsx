import createEngine, { DiagramModel, DefaultNodeModel } from '@piotrmitrega/react-diagrams';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { action } from '@storybook/addon-actions';
import * as beautify from 'json-beautify';
import { CanvasWidget } from '@piotrmitrega/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export default () => {
	//1) setup the diagram engine
	var engine = createEngine();

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	var port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);

	//!------------- SERIALIZING ------------------

	var str = JSON.stringify(model.serialize());

	//!------------- DESERIALIZING ----------------

	const add = `
	{
    "nodes": {
        "56806388-842d-4a60-9497-63458201cee5": {
            "id": "56806388-842d-4a60-9497-63458201cee5",
            "type": "default",
            "name": "awesome nooode",
            "color": "#ff00ff",
            "x": 264,
            "y": 210,
            "ports": [{
                "id": "c8084129-b432-4ca9-9684-cefc451c50f6",
                "type": "default",
                "x": 297,
                "y": 198,
                "name": "in",
                "parentNode": "56806388-842d-4a60-9497-63458201cee5",
                "links": [],
                "alignment": "bottom",
                "in": true
            }],
            "portsInOrder": ["c8084129-b432-4ca9-9684-cefc451c50f6"]
        }
    },
    "links": {}
	}	`;

	const remove = `
	{
    "nodes": {
        "56806388-842d-4a60-9497-63458201cee5": null
    },
    "links": {}
	}	`;

	const addJson = JSON.parse(add);
	const removeJson = JSON.parse(remove);

	return (
		<DemoWorkspaceWidget
			buttons={
				[
					<DemoButton
						onClick={() => {
							action('Serialized Graph')(beautify(model.serialize(), null, 2, 80));
						}}>
						Serialize Graph
					</DemoButton>,
					<DemoButton
						onClick={() => {
							action('Deserialize Graph (add)')(
								model.deserializeLayersModels(engine, addJson)
							);
						}}>
						Deserialize Graph (add)
					</DemoButton>,
					<DemoButton
						onClick={() => {
							action('Deserialize Graph (remove)')(
								model.deserializeLayersModels(engine, removeJson)
							);
						}}>
						Deserialize Graph (remove)
					</DemoButton>
				]
			}>
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		</DemoWorkspaceWidget>
	);
};
