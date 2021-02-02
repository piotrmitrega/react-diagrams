import * as React from 'react';
import * as _ from 'lodash';
import { PortModel } from './PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { ListenerHandle, Toolkit } from '@piotrmitrega/react-canvas-core';

export interface PortProps {
  port: PortModel;
  engine: DiagramEngine;
  className?;
  style?;
}

export class PortWidget extends React.Component<PortProps> {
  ref: React.RefObject<HTMLDivElement>;
  engineListenerHandle: ListenerHandle;

  constructor(props: PortProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillUnmount(): void {
    this.engineListenerHandle && this.engineListenerHandle.deregister();
  }

  getExtraProps() {
    if (Toolkit.TESTING) {
      const links = _.keys(
        this.props.port.getNode().getPort(this.props.port.getName()).links,
      ).join(',');
      return {
        'data-links': links,
      };
    }
    return {};
  }

  render() {
    return (
      <div
        className={`port ${this.props.className || ''}`}
        data-name={this.props.port.getName()}
        data-nodeid={this.props.port.getNode().getID()}
        ref={this.ref}
        style={this.props.style}
        {...this.getExtraProps()}
      >
        {this.props.children}
      </div>
    );
  }
}
