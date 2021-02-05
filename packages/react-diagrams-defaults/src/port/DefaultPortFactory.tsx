import { DefaultPortModel } from './DefaultPortModel';
import { AbstractModelFactory } from '@piotrmitrega/react-canvas-core';
import { DiagramEngine } from '@piotrmitrega/react-diagrams-core';

export class DefaultPortFactory extends AbstractModelFactory<
  DefaultPortModel,
  DiagramEngine
> {
  constructor() {
    super('default');
  }

  generateModel(): DefaultPortModel {
    return new DefaultPortModel({
      name: 'unknown',
      width: 15,
      height: 15,
    });
  }
}
