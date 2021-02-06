import {
  DefaultDiagramState,
  DiagramEngine,
  LinkLayerFactory,
  NodeLayerFactory,
} from '@piotrmitrega/react-diagrams-core';
import {
  DefaultPathFactory,
  RightAngleLinkFactory,
  RightAnglePathFactory,
} from '@piotrmitrega/react-diagrams-routing';
import {
  SelectionBoxLayerFactory,
  CanvasEngineOptions,
} from '@piotrmitrega/react-canvas-core';

export * from '@piotrmitrega/react-diagrams-core';
export * from '@piotrmitrega/react-diagrams-routing';

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
