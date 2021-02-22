import { PortModelAlignment, MultiPortNodeModel } from '@uxflow/engine';
import { DiamondPortModel } from './DiamondPortModel';

export interface DiamondNodeModelGenerics {
	PORT: DiamondPortModel;
}

export class DiamondNodeModel extends MultiPortNodeModel {
	constructor() {
		super({
			type: 'diamond',
			width: 50,
			height: 50,
		});

		this.addPort(new DiamondPortModel(PortModelAlignment.TOP));
		this.addPort(new DiamondPortModel(PortModelAlignment.TOP_LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.TOP_RIGHT));
		this.addPort(new DiamondPortModel(PortModelAlignment.LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM_LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM_RIGHT));
		this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT));
	}
}
