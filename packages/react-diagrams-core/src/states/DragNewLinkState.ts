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
import { PathFinding, PathFindingLinkFactory } from '@piotrmitrega/react-diagrams-routing';

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
	pathFinding: PathFinding;
	pathFindingFactory: PathFindingLinkFactory;

	constructor(options: DragNewLinkStateOptions = {}) {
		super({ name: 'drag-new-link' });

		// this.pathFindingFactory = new PathFindingLinkFactory();
		// this.pathFinding = new PathFinding(this.pathFindingFactory);

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

					if (model instanceof PortModel) {
						if (this.port.canLinkToPort(model)) {
							this.connectToPort(model);
						} else {
							this.removeLink();
						}
						return;
					}

					if (model instanceof MultiPortNodeModel) {
						this.connectToPort(this.targetPort);
						return;
					}

					if (!this.config.allowLooseLinks) {
						this.removeLink();
					}
				}
			})
		);
	}

	setEngine(engine: DiagramEngine) {
		if (this.engine) {
			return;
		}

		super.setEngine(engine);

		this.pathFindingFactory = new PathFindingLinkFactory();

		// @ts-ignore
		engine.getLinkFactories().registerFactory(this.pathFindingFactory);
		this.pathFinding = new PathFinding(this.pathFindingFactory);
	}

	connectToPort(port: PortModel) {
		this.link.setTargetPort(port);
		this.link.setSelected(false);

		port.reportPosition();

		this.targetPort = null;

		this.engine.repaintCanvas();
	}

	removeLink() {
		this.link.remove();
		this.engine.repaintCanvas();
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

	moveLastPointToPortOffsetPosition(port: PortModel) {
		const offset = port.calculateNormalOffset();

		const offsetPosition = port.getPosition().clone();
		offsetPosition.translate(offset.x, offset.y);
		offsetPosition.translate(PORT_SIZE / 2, PORT_SIZE / 2);

		this.link.getLastPoint().setPosition(offsetPosition);
	}

	addPointAtPort(port: PortModel) {
		const portPosition = port.getPosition().clone();
		portPosition.translate(PORT_SIZE / 2, PORT_SIZE / 2);

		const lastPointModel = this.link.generatePoint(portPosition.x, portPosition.y);

		this.link.addPoint(lastPointModel, this.link.getPoints().length);
	}

	onPortMouseEnter(port: PortModel) {
		this.targetPort = port;

		this.moveLastPointToPortOffsetPosition(port);
		this.addPointAtPort(port);

		const directPathCoords = this.pathFinding.calculateDirectPath(
			// @ts-ignore
			this.link.getFirstPoint(),
			this.link.getPoints()[this.link.getPoints().length - 2]
		);

		const routingMatrix = this.pathFindingFactory.getRoutingMatrix();
		const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
		if (smartLink) {
			const { start, end, pathToStart, pathToEnd } = smartLink;

			// second step: calculate a path avoiding hitting other elements
			const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
			const points = this.pathFindingFactory.generateDynamicPathPoints(simplifiedPath);
			points.splice(0, 1);
			points.splice(points.length - 2, 2);


			console.log('path finding: ', points.map(p => p[0] + ' ' + p[1]));
			console.log('normal: ', this.link.getPoints().map(p => p.getPosition().toSVG()));

			const newPoints = [];
			newPoints.push(this.link.getFirstPoint());
			newPoints.push(...points.map((p) => this.link.generatePoint(p[0], p[1])));
			newPoints.push(this.link.getPoints()[this.link.getPoints().length - 2]);
			newPoints.push(this.link.getLastPoint());

			this.link.setPoints(newPoints);
		}

		// this.link.onLastPointDragged();


		this.engine.repaintCanvas();
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
		this.link.onLastPointDragged();

		this.engine.repaintCanvas();
	}
}
