import React from 'react';

import { CardNodeModel } from './CardNodeModel';
import { NodeType } from './NodeType';
import { BasicPortFactory } from '../port/BasicPortFactory';
import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from '../../core/AbstractReactFactory';
import { DiagramEngine } from '../../DiagramEngine';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';
import { CardNodeWidget } from './CardNodeWidget';
import { PortType } from '../port/PortType';

export class CardNodeFactory extends AbstractReactFactory<
  CardNodeModel,
  DiagramEngine
> {
  constructor() {
    super(NodeType.CARD);
  }

  generateReactWidget(event: GenerateWidgetEvent<CardNodeModel>): JSX.Element {
    return <CardNodeWidget node={event.model} />;
  }

  generateModel(event: GenerateModelEvent): CardNodeModel {
    const portFactory = this.engine
      .getPortFactories()
      .getFactory<BasicPortFactory>(PortType.BASIC);

    const model = new CardNodeModel(
      {
        ...event.initialConfig,
      },
      portFactory,
    );

    this.eventEmitter.registerListeners(model);

    return model;
  }
}
