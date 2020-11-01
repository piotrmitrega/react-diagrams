import * as _ from 'lodash';
import { LinkModel, SerializedLinkModel } from '../entities/link/LinkModel';
import { NodeModel, SerializedNodeModel } from '../entities/node/NodeModel';
import {
	BaseEntityEvent,
	BaseEntityListener,
	BaseModel,
	CanvasModel,
	CanvasModelGenerics,
	LayerModel,
	DeserializeEvent, SerializedBaseEntity, SerializedLayer
} from '@piotrmitrega/react-canvas-core';
import { NodeLayerModel } from '../entities/node-layer/NodeLayerModel';
import { LinkLayerModel } from '../entities/link-layer/LinkLayerModel';
import { DiagramEngine } from '../DiagramEngine';

export interface DiagramListener extends BaseEntityListener {
	nodesUpdated?(event: BaseEntityEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated?(event: BaseEntityEvent & { link: LinkModel; isCreated: boolean }): void;
}

export interface DiagramModelGenerics extends CanvasModelGenerics {
	LISTENER: DiagramListener;
}

export interface SerializedDiagramModel extends SerializedBaseEntity {
	links: SerializedLayer;
	nodes: SerializedLayer;
}

export class DiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends CanvasModel<G> {
	protected activeNodeLayer: NodeLayerModel;
	protected activeLinkLayer: LinkLayerModel;

	constructor(options: G['OPTIONS'] = {}) {
		super(options);
		this.addLayer(new LinkLayerModel());
		this.addLayer(new NodeLayerModel());
	}

	deserializeLayers(engine: DiagramEngine, model: SerializedDiagramModel) {
		const models: {
			[id: string]: BaseModel;
		} = {};
		const promises: {
			[id: string]: Promise<BaseModel>;
		} = {};
		const resolvers: {
			[id: string]: (model: BaseModel) => any;
		} = {};

		const { links, nodes } = model;

		const event = {
			engine: engine,
			registerModel: (model: BaseModel) => {
				models[model.getID()] = model;
				if (resolvers[model.getID()]) {
					resolvers[model.getID()](model);
				}
			},
			getModel<T extends BaseModel>(id: string): Promise<T> {
				if (models[id]) {
					return Promise.resolve(models[id]) as Promise<T>;
				}
				if (!promises[id]) {
					promises[id] = new Promise((resolve) => {
						resolvers[id] = resolve;
					});
				}
				return promises[id] as Promise<T>;
			}
		};

		this.getActiveNodeLayer().deserialize({
			...event,
			data: nodes
		});
		this.getActiveLinkLayer().deserialize({
			...event,
			data: links
		});
	}

	serialize(): SerializedDiagramModel {
		return {
			...super.serialize(),
			nodes: this.getActiveNodeLayer().serialize(),
			links: this.getActiveLinkLayer().serialize()
		};
	}

	addLayer(layer: LayerModel): void {
		super.addLayer(layer);
		if (layer instanceof NodeLayerModel) {
			this.activeNodeLayer = layer;
		}
		if (layer instanceof LinkLayerModel) {
			this.activeLinkLayer = layer;
		}
	}

	getLinkLayers(): LinkLayerModel[] {
		return _.filter(this.layers, (layer) => {
			return layer instanceof LinkLayerModel;
		}) as LinkLayerModel[];
	}

	getNodeLayers(): NodeLayerModel[] {
		return _.filter(this.layers, (layer) => {
			return layer instanceof NodeLayerModel;
		}) as NodeLayerModel[];
	}

	getActiveNodeLayer(): NodeLayerModel {
		if (!this.activeNodeLayer) {
			const layers = this.getNodeLayers();
			if (layers.length === 0) {
				this.addLayer(new NodeLayerModel());
			} else {
				this.activeNodeLayer = layers[0];
			}
		}
		return this.activeNodeLayer;
	}

	getActiveLinkLayer(): LinkLayerModel {
		if (!this.activeLinkLayer) {
			const layers = this.getLinkLayers();
			if (layers.length === 0) {
				this.addLayer(new LinkLayerModel());
			} else {
				this.activeLinkLayer = layers[0];
			}
		}
		return this.activeLinkLayer;
	}

	getNode(node: string): NodeModel {
		for (const layer of this.getNodeLayers()) {
			const model = layer.getModel(node);
			if (model) {
				return model;
			}
		}
	}

	getLink(link: string): LinkModel {
		for (const layer of this.getLinkLayers()) {
			const model = layer.getModel(link);
			if (model) {
				return model;
			}
		}
	}

	addAll(...models: BaseModel[]): BaseModel[] {
		_.forEach(models, (model) => {
			if (model instanceof LinkModel) {
				this.addLink(model);
			} else if (model instanceof NodeModel) {
				this.addNode(model);
			}
		});
		return models;
	}

	addLink(link: LinkModel): LinkModel {
		this.getActiveLinkLayer().addModel(link);
		this.fireEvent(
			{
				link,
				isCreated: true
			},
			'linksUpdated'
		);
		return link;
	}

	addNode(node: NodeModel): NodeModel {
		this.getActiveNodeLayer().addModel(node);
		this.fireEvent({
			node,
			isCreated: true
		}, 'nodesUpdated');
		return node;
	}

	removeLink(link: LinkModel) {
		const removed = _.some(this.getLinkLayers(), (layer) => {
			return layer.removeModel(link);
		});
		if (removed) {
			this.fireEvent({
				link,
				isCreated: false
			}, 'linksUpdated');
		}
	}

	removeNode(node: NodeModel) {
		const removed = _.some(this.getNodeLayers(), (layer) => {
			return layer.removeModel(node);
		});
		if (removed) {
			this.fireEvent({
				node,
				isCreated: false
			}, 'nodesUpdated');
		}
	}

	getLinks(): LinkModel[] {
		return _.flatMap(this.getLinkLayers(), (layer) => {
			return _.values(layer.getModels());
		});
	}

	getNodes(): NodeModel[] {
		return _.flatMap(this.getNodeLayers(), (layer) => {
			return _.values(layer.getModels());
		});
	}
}
