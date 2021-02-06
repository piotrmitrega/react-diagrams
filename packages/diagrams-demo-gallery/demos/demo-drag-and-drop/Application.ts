import * as SRD from '@piotrmitrega/react-diagrams';
import {
	LinkModel,
	PortModel,
	RightAngleLinkFactory,
	RightAngleLinkModel
} from '@piotrmitrega/react-diagrams';
import { AbstractModelFactory } from '@piotrmitrega/react-canvas-core';

/**
 * @author Dylan Vorster
 */
// When new link is created by clicking on port the RightAngleLinkModel needs to be returned.
export class RightAnglePortModel extends PortModel {
	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		return new RightAngleLinkModel();
	}
}

export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = SRD.default();
		this.diagramEngine.getLinkFactories().registerFactory(new RightAngleLinkFactory());
		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);

		//3-A) create a default node
		var node1 = new SRD.NodeModel({name:'Node 1', color:'rgb(0,192,255)'});
		let port = node1.addPort(new RightAnglePortModel(false,'Out'));
		node1.setPosition(100, 100);

		//3-B) create another default node
		var node2 = new SRD.NodeModel({name: 'Node 2', color: 'rgb(192,255,0)'});
		let port2 =node2.addPort(new RightAnglePortModel(true,'In'));
		node2.setPosition(400, 100);

		this.activeModel.addAll(node1, node2);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
