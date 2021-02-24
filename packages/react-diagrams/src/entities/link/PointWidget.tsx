import React from 'react';
import classnames from 'classnames';

import { PointModel } from './PointModel';

import styles from './PointWidget.module.scss';

export interface PointWidgetProps {
  point: PointModel;
  color?: string;
  colorSelected: string;
}

export interface PointWidgetState {
  selected: boolean;
}

export class PointWidget extends React.Component<
  PointWidgetProps,
  PointWidgetState
> {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  getPointIndex = () =>
    this.props.point
      .getLink()
      .getPoints()
      .findIndex((p) => p.getID() === this.props.point.getID());

  render() {
    const { point } = this.props;
    return (
      <g
        id={this.props.point.getID()}
        title={this.props.point.getPosition().toSVG()}
      >
        <circle
          cx={point.getPosition().x}
          cy={point.getPosition().y}
          fill={
            this.state.selected || this.props.point.isSelected()
              ? this.props.colorSelected
              : this.props.color
          }
          r={5}
        />
        <text x={point.getPosition().x} y={point.getPosition().y}>
          {this.getPointIndex()}
        </text>
        <circle
          className={classnames('point', styles.pointTop)}
          cx={point.getPosition().x}
          cy={point.getPosition().y}
          opacity={0.0}
          r={15}
          onMouseEnter={() => {
            this.setState({ selected: true });
          }}
          onMouseLeave={() => {
            this.setState({ selected: false });
          }}
        />
      </g>
    );
  }
}
