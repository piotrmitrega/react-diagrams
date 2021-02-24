import React from 'react';
import map from 'lodash/map';

import { LinkWidget } from '../link/LinkWidget';
import { LinkLayerModel } from './LinkLayerModel';
import { DiagramEngine } from '../../DiagramEngine';

export interface LinkLayerWidgetProps {
  layer: LinkLayerModel;
  engine: DiagramEngine;
}

export class LinkLayerWidget extends React.Component<LinkLayerWidgetProps> {
  render() {
    return (
      <>
        {
          //only perform these actions when we have a diagram
          map(this.props.layer.getLinks(), (link) => (
            <LinkWidget
              diagramEngine={this.props.engine}
              key={link.getID()}
              link={link}
            />
          ))
        }
      </>
    );
  }
}
