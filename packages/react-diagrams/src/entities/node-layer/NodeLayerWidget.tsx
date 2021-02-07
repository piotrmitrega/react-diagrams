import * as React from 'react';
import map from 'lodash/map';
import styled from '@emotion/styled';
import { NodeModel } from '../node/NodeModel';
import { NodeWidget } from '../node/NodeWidget';
import { NodeLayerModel } from './NodeLayerModel';
import { DiagramEngine } from '../../DiagramEngine';

export interface NodeLayerWidgetProps {
  layer: NodeLayerModel;
  engine: DiagramEngine;
}

namespace S {
  export const Container = styled.div``;
}

export class NodeLayerWidget extends React.Component<NodeLayerWidgetProps> {
  render() {
    return (
      <>
        {map(this.props.layer.getNodes(), (node: NodeModel) => (
          <NodeWidget
            diagramEngine={this.props.engine}
            key={node.getID()}
            node={node}
          />
        ))}
      </>
    );
  }
}
