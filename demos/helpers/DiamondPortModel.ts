import {
  LinkModel,
  PortModel,
  PortModelAlignment,
  RightAngleLinkModel,
} from '../../src';

export class DiamondPortModel extends PortModel {
  constructor(alignment: PortModelAlignment) {
    super({
      type: 'diamond',
      name: alignment,
      alignment: alignment,
      width: 16,
      height: 16,
    });
  }

  createLinkModel(): LinkModel {
    return new RightAngleLinkModel();
  }
}
