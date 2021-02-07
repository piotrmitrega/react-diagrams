import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeLayerModel } from './NodeLayerModel';
import { NodeLayerWidget } from './NodeLayerWidget';
import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from '../../core/AbstractReactFactory';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';

export class NodeLayerFactory extends AbstractReactFactory<
  NodeLayerModel,
  DiagramEngine
> {
  constructor() {
    super('diagram-nodes');
  }

  generateModel(event: GenerateModelEvent): NodeLayerModel {
    return new NodeLayerModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<NodeLayerModel>): JSX.Element {
    return <NodeLayerWidget engine={this.engine} layer={event.model} />;
  }
}
