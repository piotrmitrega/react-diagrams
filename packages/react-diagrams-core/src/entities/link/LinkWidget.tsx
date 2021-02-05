import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from './LinkModel';
import { PointModel } from './PointModel';
import * as _ from 'lodash';
import { LabelWidget } from '../label/LabelWidget';
import { PeformanceWidget } from '@piotrmitrega/react-canvas-core';

export interface LinkProps {
  link: LinkModel;
  diagramEngine: DiagramEngine;
}

export class LinkWidget extends React.Component<LinkProps> {
  public static generateLinePath(
    firstPoint: PointModel,
    lastPoint: PointModel,
  ): string {
    return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
  }

  render() {
    const { link } = this.props;

    //generate links
    return (
      <PeformanceWidget
        model={this.props.link}
        serialized={this.props.link.serialize()}
      >
        {() => (
          <g data-linkid={this.props.link.getID()}>
            {this.props.diagramEngine.generateWidgetForLink(link)}
            {_.map(this.props.link.getLabels(), (labelModel, index) => (
              <LabelWidget
                engine={this.props.diagramEngine}
                index={index}
                key={labelModel.getID()}
                label={labelModel}
              />
            ))}
          </g>
        )}
      </PeformanceWidget>
    );
  }
}
