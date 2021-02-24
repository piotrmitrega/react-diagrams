import React from 'react';
import { CSSProperties } from 'react';

import { LayerModel } from './LayerModel';

import styles from './TransformLayerWidget.module.scss';

export interface TransformLayerWidgetProps {
  layer: LayerModel;
}

export class TransformLayerWidget extends React.Component<TransformLayerWidgetProps> {
  constructor(props: TransformLayerWidgetProps) {
    super(props);
    this.state = {};
  }

  getTransform() {
    const model = this.props.layer.getParent();
    return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
  }

  getTransformStyle(): CSSProperties {
    if (this.props.layer.getOptions().transformed) {
      return {
        transform: this.getTransform(),
      };
    }
    return {};
  }

  render() {
    if (this.props.layer.getOptions().isSvg) {
      return (
        <svg className={styles.layerWidget} style={this.getTransformStyle()}>
          {this.props.children}
        </svg>
      );
    }
    return (
      <div className={styles.layerWidget} style={this.getTransformStyle()}>
        {this.props.children}
      </div>
    );
  }
}
