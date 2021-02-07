import * as React from 'react';
import { RightAngleLinkWidget } from './RightAngleLinkWidget';
import { RightAngleLinkModel } from './RightAngleLinkModel';
import { LinkFactory } from './LinkFactory';
import { LinkType } from './LinkType';

/**
 * @author Daniel Lazar
 */
export class RightAngleLinkFactory extends LinkFactory<RightAngleLinkModel> {
  constructor() {
    super(LinkType.RIGHT_ANGLE);
  }

  generateModel(event): RightAngleLinkModel {
    const model = new RightAngleLinkModel({});

    this.eventEmitter.registerListeners(model);

    return model;
  }

  generateReactWidget(event): JSX.Element {
    return (
      <RightAngleLinkWidget
        diagramEngine={this.engine}
        factory={this}
        link={event.model}
      />
    );
  }
}
