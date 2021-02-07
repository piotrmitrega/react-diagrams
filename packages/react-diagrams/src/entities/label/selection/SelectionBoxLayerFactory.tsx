import * as React from 'react';
import { SelectionLayerModel } from './SelectionLayerModel';
import { SelectionBoxWidget } from './SelectionBoxWidget';
import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from '../../../core/AbstractReactFactory';
import { GenerateModelEvent } from '../../../core/AbstractModelFactory';

export class SelectionBoxLayerFactory extends AbstractReactFactory<
  SelectionLayerModel
> {
  constructor() {
    super('selection');
  }

  generateModel(event: GenerateModelEvent): SelectionLayerModel {
    return new SelectionLayerModel();
  }

  generateReactWidget(
    event: GenerateWidgetEvent<SelectionLayerModel>,
  ): JSX.Element {
    return <SelectionBoxWidget rect={event.model.box} />;
  }
}
