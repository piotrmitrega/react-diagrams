import React from 'react';
import classnames from 'classnames';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeModel } from './NodeModel';
import { ListenerHandle } from '../../core/BaseObserver';
import { PeformanceWidget } from '../../widgets/PeformanceWidget';
import { BaseEntityEvent } from '../../core-models/BaseEntity';
import { BaseModel } from '../../core-models/BaseModel';
import { NodePortsWidget } from './NodePortsWidget';

import styles from './NodeWidget.module.scss';

export interface NodeProps {
  node: NodeModel;
  children?: any;
  diagramEngine: DiagramEngine;
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

  render() {
    const { diagramEngine, node } = this.props;

    return (
      <PeformanceWidget model={node} serialized={node.serialize()}>
        {() => (
          <div
            className={classnames('node', styles.nodeWidget)}
            data-nodeid={node.getID()}
            ref={this.ref}
            style={{
              top: node.getY(),
              left: node.getX(),
            }}
          >
            {diagramEngine.generateWidgetForNode(node)}
            <NodePortsWidget ports={Object.values(node.getPorts())} />
          </div>
        )}
      </PeformanceWidget>
    );
  }
}
