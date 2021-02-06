import * as React from 'react';
import { RightAngleLinkWidget } from './RightAngleLinkWidget';
import { LinkFactory, LinkType } from '@piotrmitrega/react-diagrams-core';
import { RightAngleLinkModel } from './RightAngleLinkModel';

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
