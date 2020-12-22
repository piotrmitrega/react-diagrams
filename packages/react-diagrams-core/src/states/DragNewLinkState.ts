import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent,
	Action,
	ActionEvent,
	InputType
} from '@piotrmitrega/react-canvas-core';
import { PORT_SIZE, PortModel } from '../entities/port/PortModel';
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
					else if (model instanceof MultiPortNodeModel) {
						this.link.setTargetPort(this.targetPort);
						this.targetPort = null;
						this.engine.repaintCanvas();
						return;
					}

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
			} else {
				this.onMouseMove(event.event);
			}
		} else if (!this.targetPort) {
			this.onMouseMove(event.event);
		}
	}

	onPortMouseLeave() {
		this.targetPort = null;
		this.link.removePoint(this.link.getPoints()[this.link.getPoints().length - 2]);
	}

	onPortMouseEnter(port: PortModel) {
		this.targetPort = port;

		const offset = port.calculateNormalOffset();

		const offsetPosition = port.getPosition().clone();
		offsetPosition.translate(offset.x, offset.y);
		offsetPosition.translate(PORT_SIZE / 2, PORT_SIZE / 2);

		this.link.getLastPoint().setPosition(offsetPosition);

		const portPosition = port.getPosition().clone();
		portPosition.translate(PORT_SIZE / 2, PORT_SIZE / 2);

		this.engine.repaintCanvas();

		const secondPoint = this.link.getPoints()[1];

		// TODO: It would be probably better to move some stuff from link widget
		// here so we don't have to wait for rerender
		requestAnimationFrame(() => {
			const lastPointModel = this.link.generatePoint(portPosition.x, portPosition.y);
			secondPoint.setLocked(true);
			this.link.addPoint(lastPointModel, this.link.getPoints().length);
			this.engine.repaintCanvas();
			secondPoint.setLocked(false);
		});

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
