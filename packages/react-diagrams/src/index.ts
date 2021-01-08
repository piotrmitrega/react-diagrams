import {
  DefaultDiagramState,
  DiagramEngine,
  LinkLayerFactory,
  NodeLayerFactory,
} from '@piotrmitrega/react-diagrams-core';
import {
  DefaultLabelFactory,
  DefaultLinkFactory,
  DefaultNodeFactory,
  DefaultPortFactory,
} from '@piotrmitrega/react-diagrams-defaults';
import {
  DefaultPathFactory,
  RightAnglePathFactory,
} from '@piotrmitrega/react-diagrams-routing';
import {
  SelectionBoxLayerFactory,
  CanvasEngineOptions,
} from '@piotrmitrega/react-canvas-core';

export * from '@piotrmitrega/react-diagrams-core';
export * from '@piotrmitrega/react-diagrams-defaults';
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

  engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
  engine.getNodeFactories().registerFactory(new DefaultNodeFactory()); // i cant figure out why
  engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
  engine.getPortFactories().registerFactory(new DefaultPortFactory());

  engine.getPathFactories().registerFactory(new DefaultPathFactory());
  engine.getPathFactories().registerFactory(new RightAnglePathFactory());
  // register the default interaction behaviours
  engine.getStateMachine().pushState(new DefaultDiagramState());
  return engine;
};
