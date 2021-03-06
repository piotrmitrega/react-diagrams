import * as React from 'react';
import keys from 'lodash/keys';
import { PortModel } from './PortModel';
import { DiagramEngine } from '../../DiagramEngine';
import { ListenerHandle } from '../../core/BaseObserver';
import { Toolkit } from '../../Toolkit';

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
      const links = keys(
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
