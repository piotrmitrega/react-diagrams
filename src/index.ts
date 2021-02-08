import { CanvasEngineOptions } from './CanvasEngine';
import { DiagramEngine } from './DiagramEngine';
import { NodeLayerFactory } from './entities/node-layer/NodeLayerFactory';
import { LinkLayerFactory } from './entities/link-layer/LinkLayerFactory';
import { SelectionBoxLayerFactory } from './entities/selection/SelectionBoxLayerFactory';
import { RightAngleLinkFactory } from './entities/link/RightAngleLinkFactory';
import { DefaultPathFactory } from './entities/path/DefaultPathFactory';
import { RightAnglePathFactory } from './entities/path/RightAnglePathFactory';
import { DefaultDiagramState } from './states/DefaultDiagramState';

export * from './CanvasEngine';
export * from './Toolkit';
export * from './entities/canvas/CanvasModel';

export * from './models/DiagramModel';

export * from './core/AbstractFactory';
export * from './core/AbstractModelFactory';
export * from './core/AbstractReactFactory';
export * from './core/BaseObserver';
export * from './core/FactoryBank';
export * from './core/ModelGeometryInterface';

export * from './core-actions/Action';
export * from './core-actions/ActionEventBus';

export * from './core-models/BaseEntity';
export * from './core-models/BaseModel';
export * from './core-models/BasePositionModel';

export * from './entities/canvas/CanvasModel';
export * from './entities/canvas/CanvasWidget';

export * from './events/DiagramEventType';
export * from './events/EventEmitter';
export * from './events/Types';

export * from './entities/layer/LayerModel';
export * from './entities/layer/TransformLayerWidget';
export * from './entities/layer/SmartLayerWidget';

export * from './entities/selection/SelectionBoxLayerFactory';
export * from './entities/selection/SelectionBoxWidget';
export * from './entities/selection/SelectionLayerModel';

export * from './widgets/PeformanceWidget';

export * from './core-state/AbstractDisplacementState';
export * from './core-state/State';
export * from './core-state/StateMachine';

export * from './states/DefaultState';
export * from './states/DragCanvasState';
export * from './states/SelectingState';
export * from './states/SelectionBoxState';
export * from './states/MoveItemsState';

export * from './actions/DeleteItemsAction';
export * from './actions/ZoomCanvasAction';

export * from './entities/label/LabelModel';

export * from './entities/link/LinkModel';
export * from './entities/link/PointModel';
export * from './entities/link/LinkWidget';
export * from './entities/link/LinkType';
export * from './entities/link/LinkSegment';
export * from './entities/link/LinkSegmentWidget';
export * from './entities/link/PointWidget';
export * from './entities/link/LinkFactory';

export * from './entities/link-layer/LinkLayerModel';
export * from './entities/link-layer/LinkLayerWidget';
export * from './entities/link-layer/LinkLayerFactory';

export * from './entities/node-layer/NodeLayerModel';
export * from './entities/node-layer/NodeLayerWidget';
export * from './entities/node-layer/NodeLayerFactory';

export * from './entities/node/MultiPortNodeModel';
export * from './entities/node/NodeModel';
export * from './entities/node/NodeWidget';
export * from './entities/port/PortModel';
export * from './entities/port/PortWidget';
export * from './entities/port/PortType';
export * from './entities/port/BasicPortModel';

export * from './entities/path/PathModel';

export * from './states/DefaultDiagramState';
export * from './states/DragDiagramItemsState';
export * from './states/DragNewLinkState';

export * from './DiagramEngine';

export * from './entities/link/RightAngleLinkWidget';
export * from './entities/link/RightAngleLinkFactory';
export * from './entities/link/RightAngleLinkModel';

export * from './entities/path/DefaultPathFactory';
export * from './entities/path/RightAnglePathFactory';
export * from './entities/path/GridFactory';
export * from './entities/path/GridModel';

export * from './PathFinding';
/**
 * Construct an engine with the defaults installed
 */
export default (options: CanvasEngineOptions = {}): DiagramEngine => {
  const engine = new DiagramEngine(options);

  // register model factories
  engine.getLayerFactories().registerFactory(new NodeLayerFactory());
  engine.getLayerFactories().registerFactory(new LinkLayerFactory());
  engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

  engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());

  engine.getPathFactories().registerFactory(new DefaultPathFactory());
  engine.getPathFactories().registerFactory(new RightAnglePathFactory());
  // register the default interaction behaviours
  engine.getStateMachine().pushState(new DefaultDiagramState());
  return engine;
};
