import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { BasicPortModel } from './BasicPortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';
import { RightAngleLinkFactory } from '../../entities/link/RightAngleLinkFactory';
import { LinkType } from '../../entities/link/LinkType';
import { PortType } from './PortType';

export class BasicPortFactory extends AbstractModelFactory<
  BasicPortModel,
  DiagramEngine
> {
  constructor() {
    super(PortType.BASIC);
  }

  generateModel(event: GenerateModelEvent): BasicPortModel {
    const linksFactory = this.engine
      .getLinkFactories()
      .getFactory<RightAngleLinkFactory>(LinkType.RIGHT_ANGLE);

    const model = new BasicPortModel(
      {
        width: 16,
        height: 16,
        ...event.initialConfig,
      },
      linksFactory,
    );

    this.eventEmitter.registerListeners(model);

    return model;
  }
}
