import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment, RightAngleLinkModel } from '@piotrmitrega/react-diagrams';

export class DiamondPortModel extends PortModel {
	constructor(alignment: PortModelAlignment) {
		super({
			type: 'diamond',
			name: alignment,
			alignment: alignment
		});
	}

	createLinkModel(): LinkModel {
		return new RightAngleLinkModel();
	}
}
