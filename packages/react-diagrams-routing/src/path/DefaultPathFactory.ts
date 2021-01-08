import {
  DiagramEngine,
  PathModel,
  PortModel,
} from '@piotrmitrega/react-diagrams-core';
import {
  AbstractModelFactory,
  GenerateModelEvent,
} from '@piotrmitrega/react-canvas-core';

export class DefaultPathFactory extends AbstractModelFactory<
  PathModel,
  DiagramEngine
> {
  constructor() {
    super('default');
  }

  generateModel(event: GenerateModelEvent): PathModel {
    const sourcePort: PortModel = event.initialConfig.sourcePort;
    const targetPort: PortModel = event.initialConfig.targetPort;

    const firstPoint = sourcePort.getCenter();
    const portOffsetPoint = targetPort.getOffsetPosition();
    const lastPoint = targetPort.getCenter();

    const points = [firstPoint, portOffsetPoint, lastPoint];

    return new PathModel({ points });
  }
}
