import { Point } from '@piotrmitrega/geometry';
import { NodeModel, NodeModelGenerics } from './NodeModel';
import { LinkModel } from '../link/LinkModel';
import { PortModel } from '../port/PortModel';
import { DiagramEngine } from '../../DiagramEngine';

export class MultiPortNodeModel<G extends NodeModelGenerics = NodeModelGenerics> extends NodeModel<G> {
	constructor(options: G['OPTIONS']) {
		super(options);
	}

	linkToClosestPort = (link: LinkModel, clickPosition: Point, sourcePort: PortModel, engine: DiagramEngine) => {

		const nodeElement = document.querySelector(`.node[data-nodeid="${this.getID()}"]`);

		const portDatas = Array.from(nodeElement.querySelectorAll('.port'))
			.map((portElement) => {
				const rect = portElement.getBoundingClientRect();
				const distance = Math.hypot(rect.x - clickPosition.x, rect.y - clickPosition.y);
				const model = this.getPort(portElement.getAttribute('data-name'));

				return { distance, model, rect };
			})
			.filter(p => p.model.canLinkToPort(link.getSourcePort()))
			.sort((a, b) => a.distance - b.distance);

		const { model, rect } = portDatas[0];

		const portPosition = {
			clientX: rect.x + rect.width / 2,
			clientY: rect.y + rect.height / 2
		};

		const relativePortPosition = engine.getRelativeMousePoint(portPosition);

		link.getLastPoint().setPosition(relativePortPosition);
		link.setTargetPort(model);
	};
}
