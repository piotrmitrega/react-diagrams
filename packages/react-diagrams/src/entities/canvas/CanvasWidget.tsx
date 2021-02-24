import React from 'react';
import classnames from 'classnames';

import { TransformLayerWidget } from '../layer/TransformLayerWidget';
import { SmartLayerWidget } from '../layer/SmartLayerWidget';
import { CanvasEngine } from '../../CanvasEngine';

import styles from './CanvasWidget.module.scss';

export interface DiagramProps {
  engine: CanvasEngine;
  className?: string;
}

export class CanvasWidget extends React.Component<DiagramProps> {
  ref: React.RefObject<HTMLDivElement>;
  keyUp: any;
  keyDown: any;
  canvasListener: any;

  constructor(props: DiagramProps) {
    super(props);

    this.ref = React.createRef();
    this.state = {
      action: null,
      diagramEngineListener: null,
    };
  }

  componentWillUnmount() {
    this.props.engine.deregisterListener(this.canvasListener);
    this.props.engine.setCanvas(null);

    document.removeEventListener('keyup', this.keyUp);
    document.removeEventListener('keydown', this.keyDown);
  }

  registerCanvas() {
    this.props.engine.setCanvas(this.ref.current);
    this.props.engine.iterateListeners((list) => {
      list.rendered && list.rendered();
    });
  }

  componentDidUpdate() {
    this.registerCanvas();
  }

  componentDidMount() {
    this.canvasListener = this.props.engine.registerListener({
      repaintCanvas: () => {
        this.forceUpdate();
      },
    });

    this.keyDown = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event });
    };
    this.keyUp = (event) => {
      this.props.engine.getActionEventBus().fireAction({ event });
    };

    document.addEventListener('keyup', this.keyUp);
    document.addEventListener('keydown', this.keyDown);
    this.registerCanvas();
  }

  render() {
    const engine = this.props.engine;
    const model = engine.getModel();

    return (
      <div
        className={classnames(styles.canvas, this.props.className)}
        ref={this.ref}
        onMouseDown={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event });
        }}
        onMouseMove={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event });
        }}
        onMouseUp={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event });
        }}
        onWheel={(event) => {
          this.props.engine.getActionEventBus().fireAction({ event });
        }}
      >
        {model.getLayers().map((layer) => (
          <TransformLayerWidget key={layer.getID()} layer={layer}>
            <SmartLayerWidget
              engine={this.props.engine}
              key={layer.getID()}
              layer={layer}
            />
          </TransformLayerWidget>
        ))}
      </div>
    );
  }
}
