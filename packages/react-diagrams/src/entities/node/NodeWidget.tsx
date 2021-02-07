import * as React from 'react';
import forEach from 'lodash/forEach';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeModel } from './NodeModel';
import styled from '@emotion/styled';
import ResizeObserver from 'resize-observer-polyfill';
import { ListenerHandle } from '../../core/BaseObserver';
import { PeformanceWidget } from '../../widgets/PeformanceWidget';
import { BaseEntityEvent } from '../../core-models/BaseEntity';
import { BaseModel } from '../../core-models/BaseModel';

export interface NodeProps {
  node: NodeModel;
  children?: any;
  diagramEngine: DiagramEngine;
}

namespace S {
  export const Node = styled.div`
    position: absolute;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    user-select: none;
    cursor: move;
    pointer-events: all;
  `;
}

export class NodeWidget extends React.Component<NodeProps> {
  ob: any;
  ref: React.RefObject<HTMLDivElement>;
  listener: ListenerHandle;

  constructor(props: NodeProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillUnmount(): void {
    this.ob.disconnect();
    this.ob = null;

    this.listener.deregister();
    this.listener = null;
  }

  componentDidUpdate(
    prevProps: Readonly<NodeProps>,
    prevState: Readonly<any>,
    snapshot?: any,
  ): void {
    if (this.listener && this.props.node !== prevProps.node) {
      this.listener.deregister();
      this.installSelectionListener();
    }
  }

  installSelectionListener() {
    this.listener = this.props.node.registerListener({
      selectionChanged: (
        event: BaseEntityEvent<BaseModel> & { isSelected: boolean },
      ) => {
        this.forceUpdate();
      },
    });
  }

  componentDidMount(): void {
    this.ob = new ResizeObserver((entities) => {
      //now mark the links as dirty
      forEach(this.props.node.getPorts(), (port) => {
        const rect = this.props.diagramEngine.getPortCoords(port);
        port.setPosition(rect.getTopLeft().x, rect.getTopLeft().y);
      });
    });
    this.ob.observe(this.ref.current);
    this.installSelectionListener();
  }

  render() {
    return (
      <PeformanceWidget
        model={this.props.node}
        serialized={this.props.node.serialize()}
      >
        {() => (
          <S.Node
            className="node"
            data-nodeid={this.props.node.getID()}
            ref={this.ref}
            style={{
              top: this.props.node.getY(),
              left: this.props.node.getX(),
            }}
          >
            {this.props.diagramEngine.generateWidgetForNode(this.props.node)}
          </S.Node>
        )}
      </PeformanceWidget>
    );
  }
}
