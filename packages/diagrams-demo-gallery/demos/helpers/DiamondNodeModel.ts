import { PortModelAlignment } from '@piotrmitrega/react-diagrams';
import { DiamondPortModel } from './DiamondPortModel';
import { MultiPortNodeModel} from '@piotrmitrega/react-diagrams-core';

export interface DiamondNodeModelGenerics {
	PORT: DiamondPortModel;
}

export class DiamondNodeModel extends MultiPortNodeModel {
	constructor() {
		super({
			type: 'diamond',
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
