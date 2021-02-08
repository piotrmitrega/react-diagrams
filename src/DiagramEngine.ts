import { NodeModel } from './entities/node/NodeModel';
import { PortModel } from './entities/port/PortModel';
import { LinkModel } from './entities/link/LinkModel';
import { LabelModel } from './entities/label/LabelModel';
import { MouseEvent } from 'react';
import { DiagramModel } from './models/DiagramModel';
import { PathModel } from './entities/path/PathModel';
import {
  CanvasEngine,
  CanvasEngineListener,
  CanvasEngineOptions,
} from './CanvasEngine';
import { FactoryBank } from './core/FactoryBank';
import { AbstractReactFactory } from './core/AbstractReactFactory';
import { AbstractModelFactory } from './core/AbstractModelFactory';
import { BaseModel } from './core-models/BaseModel';
import { Toolkit } from './Toolkit';
import { Polygon, Rectangle } from './geometry';

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends CanvasEngine<
  CanvasEngineListener,
  DiagramModel
> {
  protected nodeFactories: FactoryBank<
    AbstractReactFactory<NodeModel, DiagramEngine>
  >;
  protected linkFactories: FactoryBank<
    AbstractReactFactory<LinkModel, DiagramEngine>
  >;
  protected portFactories: FactoryBank<
    AbstractModelFactory<PortModel, DiagramEngine>
  >;
  protected labelFactories: FactoryBank<
    AbstractReactFactory<LabelModel, DiagramEngine>
  >;
  protected pathFactories: FactoryBank<
    AbstractModelFactory<PathModel, DiagramEngine>
  >;

  maxNumberPointsPerLink: number;

  constructor(options: CanvasEngineOptions = {}) {
    super(options);
    this.maxNumberPointsPerLink = 1000;

    // create banks for the different factory types
    this.nodeFactories = new FactoryBank();
    this.linkFactories = new FactoryBank();
    this.portFactories = new FactoryBank();
    this.labelFactories = new FactoryBank();
    this.pathFactories = new FactoryBank();

    const setup = (factory: FactoryBank) => {
      factory.registerListener({
        factoryAdded: (event) => {
          event.factory.setDiagramEngine(this);
        },
        factoryRemoved: (event) => {
          event.factory.setDiagramEngine(null);
        },
      });
    };

    setup(this.nodeFactories);
    setup(this.linkFactories);
    setup(this.portFactories);
    setup(this.labelFactories);
    setup(this.pathFactories);
  }

  /**
   * Gets a model and element under the mouse cursor
   */
  getMouseElement(event: MouseEvent): BaseModel {
    const target = event.target as Element;
    const diagramModel = this.model;

    //is it a port
    let element = Toolkit.closest(target, '.port[data-name]');
    if (element) {
      const nodeElement = Toolkit.closest(
        target,
        '.node[data-nodeid]',
      ) as HTMLElement;
      return diagramModel
        .getNode(nodeElement.getAttribute('data-nodeid'))
        .getPort(element.getAttribute('data-name'));
    }

    //look for a point
    element = Toolkit.closest(target, '.point[data-id]');
    if (element) {
      return diagramModel
        .getLink(element.getAttribute('data-linkid'))
        .getPointModel(element.getAttribute('data-id'));
    }

    //look for a link
    element = Toolkit.closest(target, '[data-linkid]');
    if (element) {
      return diagramModel.getLink(element.getAttribute('data-linkid'));
    }

    //look for a node
    element = Toolkit.closest(target, '.node[data-nodeid]');
    if (element) {
      return diagramModel.getNode(element.getAttribute('data-nodeid'));
    }

    return null;
  }

  //!-------------- FACTORIES ------------

  getNodeFactories() {
    return this.nodeFactories;
  }

  getLinkFactories() {
    return this.linkFactories;
  }

  getLabelFactories() {
    return this.labelFactories;
  }

  getPortFactories() {
    return this.portFactories;
  }

  getPathFactories() {
    return this.pathFactories;
  }

  getFactoryForNode<F extends AbstractReactFactory<NodeModel, DiagramEngine>>(
    node: NodeModel | string,
  ) {
    const type = typeof node === 'string' ? node : node.getType();

    return this.nodeFactories.getFactory(type);
  }

  getFactoryForLink<F extends AbstractReactFactory<LinkModel, DiagramEngine>>(
    link: LinkModel | string,
  ) {
    const type = typeof link === 'string' ? link : link.getType();

    return this.linkFactories.getFactory<F>(type);
  }

  getFactoryForLabel<F extends AbstractReactFactory<LabelModel, DiagramEngine>>(
    label: LabelModel,
  ) {
    const type = typeof label === 'string' ? label : label.getType();

    return this.labelFactories.getFactory(type);
  }

  getFactoryForPort<F extends AbstractModelFactory<PortModel, DiagramEngine>>(
    port: PortModel,
  ) {
    const type = typeof port === 'string' ? port : port.getType();

    return this.portFactories.getFactory<F>(type);
  }

  getPathFactoryForLink<
    F extends AbstractModelFactory<PathModel, DiagramEngine>
  >(link: LinkModel) {
    const type = typeof link === 'string' ? link : link.getType();

    return (
      this.pathFactories.getFactory<F>(type) ||
      this.pathFactories.getFactory<F>('default')
    );
  }

  generateWidgetForLink(link: LinkModel): JSX.Element {
    return this.getFactoryForLink(link).generateReactWidget({ model: link });
  }

  generateWidgetForNode(node: NodeModel): JSX.Element {
    return this.getFactoryForNode(node).generateReactWidget({ model: node });
  }

  getNodeElement(node: NodeModel): Element {
    const selector = this.canvas.querySelector(
      `.node[data-nodeid="${node.getID()}"]`,
    );
    if (selector === null) {
      throw new Error(
        `Cannot find Node element with nodeID: [${node.getID()}]`,
      );
    }
    return selector;
  }

  getNodePortElement(port: PortModel): any {
    const selector = this.canvas.querySelector(
      `.port[data-name="${port.getName()}"][data-nodeid="${port
        .getParent()
        .getID()}"]`,
    );
    if (selector === null) {
      throw new Error(
        `Cannot find Node Port element with nodeID: [${port
          .getParent()
          .getID()}] and name: [${port.getName()}]`,
      );
    }
    return selector;
  }

  /**
   * Calculate rectangular coordinates of the port passed in.
   */
  getPortCoords(port: PortModel, element?: HTMLDivElement): Rectangle {
    if (!this.canvas) {
      throw new Error('Canvas needs to be set first');
    }
    if (!element) {
      element = this.getNodePortElement(port);
    }
    const sourceRect = element.getBoundingClientRect();
    const point = this.getRelativeMousePoint({
      clientX: sourceRect.left,
      clientY: sourceRect.top,
    });
    const zoom = this.model.getZoomLevel() / 100.0;
    return new Rectangle(
      point.x,
      point.y,
      sourceRect.width / zoom,
      sourceRect.height / zoom,
    );
  }

  /**
   * Determine the width and height of the node passed in.
   * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
   */
  getNodeDimensions(node: NodeModel): { width: number; height: number } {
    if (!this.canvas) {
      return {
        width: 0,
        height: 0,
      };
    }

    const nodeElement = this.getNodeElement(node);
    const nodeRect = nodeElement.getBoundingClientRect();

    return {
      width: nodeRect.width,
      height: nodeRect.height,
    };
  }

  /**
   * Get nodes bounding box coordinates with or without margin
   * @returns rectangle points in node layer coordinates
   */
  getBoundingNodesRect(nodes: NodeModel[], margin?: number): Rectangle {
    if (nodes) {
      if (nodes.length === 0) {
        return new Rectangle(0, 0, 0, 0);
      }

      const boundingBox = Polygon.boundingBoxFromPolygons(
        nodes.map((node) => node.getBoundingBox()),
      );
      if (margin) {
        return new Rectangle(
          boundingBox.getTopLeft().x - margin,
          boundingBox.getTopLeft().y - margin,
          boundingBox.getWidth() + 2 * margin,
          boundingBox.getHeight() + 2 * margin,
        );
      }
      return boundingBox;
    }
  }

  zoomToFitNodes(margin?: number) {
    let nodesRect; // nodes bounding rectangle
    const selectedNodes = this.model
      .getSelectedEntities()
      .filter((entity) => entity instanceof NodeModel)
      .map((node) => node) as NodeModel[];

    // no node selected
    if (selectedNodes.length == 0) {
      const allNodes = this.model
        .getSelectionEntities()
        .filter((entity) => entity instanceof NodeModel)
        .map((node) => node) as NodeModel[];

      // get nodes bounding box with margin
      nodesRect = this.getBoundingNodesRect(allNodes, margin);
    } else {
      // get nodes bounding box with margin
      nodesRect = this.getBoundingNodesRect(selectedNodes, margin);
    }

    if (nodesRect) {
      // there is something we should zoom on
      const canvasRect = this.canvas.getBoundingClientRect();
      const canvasTopLeftPoint = {
        x: canvasRect.left,
        y: canvasRect.top,
      };
      const nodeLayerTopLeftPoint = {
        x: canvasTopLeftPoint.x + this.getModel().getOffsetX(),
        y: canvasTopLeftPoint.y + this.getModel().getOffsetY(),
      };

      const xFactor = this.canvas.clientWidth / nodesRect.getWidth();
      const yFactor = this.canvas.clientHeight / nodesRect.getHeight();
      const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

      this.model.setZoomLevel(zoomFactor * 100);

      const nodesRectTopLeftPoint = {
        x: nodeLayerTopLeftPoint.x + nodesRect.getTopLeft().x * zoomFactor,
        y: nodeLayerTopLeftPoint.y + nodesRect.getTopLeft().y * zoomFactor,
      };

      this.model.setOffset(
        this.model.getOffsetX() +
          canvasTopLeftPoint.x -
          nodesRectTopLeftPoint.x,
        this.model.getOffsetY() +
          canvasTopLeftPoint.y -
          nodesRectTopLeftPoint.y,
      );
      this.repaintCanvas();
    }
  }

  getMaxNumberPointsPerLink(): number {
    return this.maxNumberPointsPerLink;
  }

  setMaxNumberPointsPerLink(max: number) {
    this.maxNumberPointsPerLink = max;
  }
}
