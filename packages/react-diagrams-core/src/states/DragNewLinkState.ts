import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent,
	Action,
	ActionEvent,
	InputType
} from '@piotrmitrega/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent } from 'react';
import { LinkModel } from '../entities/link/LinkModel';
import { DiagramEngine } from '../DiagramEngine';
import { MultiPortNodeModel } from '../entities/node/MultiPortNodeModel';

export interface DragNewLinkStateOptions {
	/**
	 * If enabled, the links will stay on the canvas if they dont connect to a port
	 * when dragging finishes
	 */
	allowLooseLinks?: boolean;
	/**
	 * If enabled, then a link can still be drawn from the port even if it is locked
	 */
	allowLinksFromLockedPorts?: boolean;
}

export class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
	port: PortModel;
	link: LinkModel;
	targetPort: PortModel;
	config: DragNewLinkStateOptions;

	constructor(options: DragNewLinkStateOptions = {}) {
		super({ name: 'drag-new-link' });

		this.config = {
			allowLooseLinks: true,
			allowLinksFromLockedPorts: false,
			...options
		};

		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent, PortModel>) => {
					this.port = this.engine.getMouseElement(event.event) as PortModel;
					if (!this.config.allowLinksFromLockedPorts && this.port.isLocked()) {
						this.eject();
						return;
					}
					this.link = this.port.createLinkModel();

					// if no link is given, just eject the state
					if (!this.link) {
						this.eject();
						return;
					}
					this.link.setSelected(true);
					this.link.setSourcePort(this.port);
					this.engine.getModel().addLink(this.link);
					this.port.reportPosition();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: ActionEvent<MouseEvent>) => {
					const model = this.engine.getMouseElement(event.event);
					// check to see if we connected to a new port
					if (model instanceof PortModel) {
						if (this.port.canLinkToPort(model)) {
							this.link.setTargetPort(model);
							model.reportPosition();
							this.engine.repaintCanvas();
							return;
						} else {
							this.link.remove();
							this.engine.repaintCanvas();
							return;
						}
					}
					// else if (model instanceof MultiPortNodeModel) {
					// 	const clickPosition = new Point(event.event.clientX, event.event.clientY);
					// 	model.linkToClosestPort(this.link, clickPosition, this.port, this.engine);
					// 	this.engine.repaintCanvas();
					// 	return;
					// }

					if (!this.config.allowLooseLinks) {
						this.link.remove();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	getPortFromMouseEvent(event: MouseEvent): PortModel | null {
		const mouseElement = this.engine.getMouseElement(event);
		if (mouseElement instanceof MultiPortNodeModel) {
			console.log(mouseElement === this.port.getNode());
			if (mouseElement === this.port.getNode()) {
				return null;
			}

			return (mouseElement as MultiPortNodeModel).getClosestPort(this.port, event, this.engine);
		} else if (mouseElement instanceof PortModel) {
			if (mouseElement.getNode() !== this.port.getNode()) {
				return mouseElement;
			}
		}

		return null;
	}


	/**
	 * Calculates the link's far-end point position on mouse move.
	 * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
	 * as the possible engine offset
	 */
	fireMouseMoved(event: AbstractDisplacementStateEvent): any {
		const mousePortModel = this.getPortFromMouseEvent(event.event);
		if (mousePortModel !== this.targetPort) {
			if (this.targetPort) {
				this.onPortMouseLeave();
			}

			if (mousePortModel) {
				this.onPortMouseEnter(mousePortModel);
				return;
			}
		}

		this.onMouseMove(event.event);
	}

	onPortMouseLeave() {
		//remove two points?
		console.log('leaving', this.targetPort);
		this.targetPort = null;
	}

	onPortMouseEnter(port: PortModel) {
		//add two points
		console.log('entering', port);
		this.targetPort = port;
	}

	onMouseMove(event: MouseEvent) {
		const portPos = this.port.getPosition();

		const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
		const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
		const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
		const initialXRelative = this.initialXRelative / zoomLevelPercentage;
		const initialYRelative = this.initialYRelative / zoomLevelPercentage;

		const { virtualDisplacementX, virtualDisplacementY } = this.calculateVirtualDisplacement(event.clientX, event.clientY);

		const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + virtualDisplacementX;
		const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + virtualDisplacementY;

		this.link.getLastPoint().setPosition(linkNextX, linkNextY);
		this.engine.repaintCanvas();
	}
}
