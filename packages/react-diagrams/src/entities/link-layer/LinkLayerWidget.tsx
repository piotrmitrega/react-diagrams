import * as React from 'react';
import map from 'lodash/map';
import styled from '@emotion/styled';
import { LinkWidget } from '../link/LinkWidget';
import { LinkLayerModel } from './LinkLayerModel';
import { DiagramEngine } from '../../DiagramEngine';

export interface LinkLayerWidgetProps {
  layer: LinkLayerModel;
  engine: DiagramEngine;
}

namespace S {
  export const Container = styled.div``;
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
