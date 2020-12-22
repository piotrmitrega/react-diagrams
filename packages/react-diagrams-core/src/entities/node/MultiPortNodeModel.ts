import { NodeModel, NodeModelGenerics } from './NodeModel';
import { PortModel } from '../port/PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { MouseEvent } from 'react';

export class MultiPortNodeModel<G extends NodeModelGenerics = NodeModelGenerics> extends NodeModel<G> {
	constructor(options: G['OPTIONS']) {
		super(options);
	}

	getClosestPort = (sourcePort: PortModel, event: MouseEvent, engine: DiagramEngine): PortModel | undefined => {
		const relativeClickPosition = engine.getRelativeMousePoint(event);
		const portsByDistance = Object.values(this.ports)
			.filter(port => port.canLinkToPort(sourcePort))
			.map((port) => {
				return {
					port,
					distance: Math.hypot(
						relativeClickPosition.x - port.getPosition().x,
						relativeClickPosition.y - port.getPosition().y
					)
				};
			})
			.sort((a, b) => a.distance - b.distance);

		const closest = portsByDistance[0];
		return closest ? closest.port : null;
	};
}
