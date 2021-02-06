import { PortModelOptions, PortModel } from './PortModel';
import { LinkModel } from '../link/LinkModel';
import { PortType } from './PortType';
import { LinkFactory } from '../link/LinkFactory';

export class BasicPortModel extends PortModel {
  protected linkFactory: LinkFactory;

  constructor(options: PortModelOptions, linkFactory: LinkFactory) {
    super({
      ...options,
      type: PortType.BASIC,
    });

    this.linkFactory = linkFactory;
  }

  canLinkToPort(port: PortModel): boolean {
    return port.getParent() !== this.getParent();
  }

  createLinkModel(): LinkModel | null {
    return this.linkFactory.generateModel({ initialConfig: {} });
  }
}
