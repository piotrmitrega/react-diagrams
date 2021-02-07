import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkLayerModel } from './LinkLayerModel';
import { LinkLayerWidget } from './LinkLayerWidget';
import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from '../../core/AbstractReactFactory';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';

export class LinkLayerFactory extends AbstractReactFactory<
  LinkLayerModel,
  DiagramEngine
> {
  constructor() {
    super('diagram-links');
  }

  generateModel(event: GenerateModelEvent): LinkLayerModel {
    return new LinkLayerModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<LinkLayerModel>): JSX.Element {
    return <LinkLayerWidget engine={this.engine} layer={event.model} />;
  }
}
