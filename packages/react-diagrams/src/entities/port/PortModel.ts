import map from 'lodash/map';
import forEach from 'lodash/forEach';
import isFinite from 'lodash/isFinite';
import values from 'lodash/values';
import size from 'lodash/size';
import { NodeModel } from '../node/NodeModel';
import { LinkModel } from '../link/LinkModel';
import {
  BasePositionModel,
  BasePositionModelGenerics,
  BasePositionModelOptions,
  SerializedBasePositionModel,
} from '../../core-models/BasePositionModel';
import { Point } from '../../geometry';
import { DeserializeEvent } from '../../core-models/BaseEntity';

export enum PortModelAlignment {
  TOP = 'top',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  LEFT = 'left',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  RIGHT = 'right',
}

export interface PortModelOptions extends BasePositionModelOptions {
  name: string;
  alignment?: PortModelAlignment;
  maximumLinks?: number;
  portOffsetValue?: number;
}

export interface PortModelGenerics extends BasePositionModelGenerics {
  OPTIONS: PortModelOptions;
  PARENT: NodeModel;
}

export interface SerializedPortModel extends SerializedBasePositionModel {
  name: string;
  alignment: PortModelAlignment;
  parentNode: string;
  links: string[];
}

const defaultOptions = {
  portOffsetValue: 20,
};

export class PortModel<
  G extends PortModelGenerics = PortModelGenerics
> extends BasePositionModel<G> {
  links: { [id: string]: LinkModel };

  constructor(options: G['OPTIONS']) {
    super({
      ...defaultOptions,
      ...options,
    });

    this.links = {};
  }

  deserialize(event: DeserializeEvent<this>) {
    this.stopFiringEvents();

    super.deserialize(event);
    this.options.name = event.data.name;
    this.options.alignment = event.data.alignment;
  }

  serialize(): SerializedPortModel {
    return {
      ...super.serialize(),
      name: this.options.name,
      alignment: this.options.alignment,
      parentNode: this.parent.getID(),
      links: map(this.links, (link) => link.getID()),
    };
  }

  setPosition(point: Point);
  setPosition(x: number, y: number);
  setPosition(x, y?) {
    const old = this.position;
    super.setPosition(x, y);
    forEach(this.getLinks(), (link) => {
      const point = link.getPointForPort(this);
      point.setPosition(point.getX() + x - old.x, point.getY() + y - old.y);
    });
  }

  doClone(lookupTable = {}, clone) {
    clone.links = {};
    clone.parentNode = this.getParent().clone(lookupTable);
  }

  getNode(): NodeModel {
    return this.getParent();
  }

  getName(): string {
    return this.options.name;
  }

  removeLink(link: LinkModel) {
    delete this.links[link.getID()];
  }

  addLink(link: LinkModel) {
    this.links[link.getID()] = link;
  }

  getLinks(): { [id: string]: LinkModel } {
    return this.links;
  }

  public createLinkModel(): LinkModel | null {
    if (isFinite(this.options.maximumLinks)) {
      const numberOfLinks: number = size(this.links);
      if (this.options.maximumLinks === 1 && numberOfLinks >= 1) {
        return values(this.links)[0];
      } else if (numberOfLinks >= this.options.maximumLinks) {
        return null;
      }
    }
    return null;
  }

  getCenter(): Point {
    return new Point(
      this.getX() + this.width / 2,
      this.getY() + this.height / 2,
    );
  }

  canLinkToPort(port: PortModel): boolean {
    return port !== this;
  }

  isLocked() {
    return super.isLocked() || this.getParent().isLocked();
  }

  calculatePosition = () => {
    const { alignment, width, height } = this.getOptions();

    const xOffset = width / 2;
    const yOffset = height / 2;

    const node = this.getNode();
    const nodeWidth = node.getWidth();
    const nodeHeight = node.getHeight();

    const position = node.getPosition().clone();

    switch (alignment) {
      case PortModelAlignment.TOP_LEFT:
        position.translate(-xOffset, -yOffset);
        break;

      case PortModelAlignment.TOP:
        position.translate(nodeWidth / 2, -yOffset);
        break;

      case PortModelAlignment.TOP_RIGHT:
        position.translate(nodeWidth + xOffset, -yOffset);
        break;

      case PortModelAlignment.LEFT:
        position.translate(-xOffset, nodeHeight / 2);
        break;

      case PortModelAlignment.RIGHT:
        position.translate(nodeWidth + xOffset, nodeHeight / 2);
        break;

      case PortModelAlignment.BOTTOM_LEFT:
        position.translate(-xOffset, nodeHeight + yOffset);
        break;

      case PortModelAlignment.BOTTOM:
        position.translate(nodeWidth / 2, nodeHeight + yOffset);
        break;

      case PortModelAlignment.BOTTOM_RIGHT:
        position.translate(nodeWidth + xOffset, nodeHeight + yOffset);
        break;
    }

    return position;
  };

  calculateNormalOffset = () => {
    const { alignment, portOffsetValue } = this.getOptions();

    switch (alignment) {
      case PortModelAlignment.BOTTOM:
      case PortModelAlignment.BOTTOM_LEFT:
      case PortModelAlignment.BOTTOM_RIGHT:
        return new Point(0, portOffsetValue);

      case PortModelAlignment.LEFT:
        return new Point(-portOffsetValue, 0);

      case PortModelAlignment.RIGHT:
        return new Point(portOffsetValue, 0);

      case PortModelAlignment.TOP:
      case PortModelAlignment.TOP_LEFT:
      case PortModelAlignment.TOP_RIGHT:
        return new Point(0, -portOffsetValue);
    }

    return new Point(0, 0);
  };

  getOffsetPosition = (): Point => {
    const offset = this.calculateNormalOffset();

    const offsetPosition = this.getCenter();
    offsetPosition.translate(offset.x, offset.y);

    return offsetPosition;
  };

  setParent(parent: G['PARENT']) {
    super.setParent(parent);

    this.setPosition(this.calculatePosition());
  }
}
