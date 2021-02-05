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
    return new RightAngleLinkModel({});
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
