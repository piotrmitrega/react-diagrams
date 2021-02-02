import { NodeModel } from '../node/NodeModel';
import { LinkModel } from '../link/LinkModel';
import * as _ from 'lodash';
import { Point } from '@piotrmitrega/geometry';
import {
  BaseModelOptions,
  BasePositionModel,
  BasePositionModelGenerics,
  BasePositionModelOptions,
  DeserializeEvent,
  SerializedBasePositionModel,
} from '@piotrmitrega/react-canvas-core';

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

  serialize() {
    return {
      ...super.serialize(),
      name: this.options.name,
      alignment: this.options.alignment,
      parentNode: this.parent.getID(),
      links: _.map(this.links, (link) => link.getID()),
    };
  }

  setPosition(point: Point);
  setPosition(x: number, y: number);
  setPosition(x, y?) {
    const old = this.position;
    super.setPosition(x, y);
    _.forEach(this.getLinks(), (link) => {
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
    if (_.isFinite(this.options.maximumLinks)) {
      const numberOfLinks: number = _.size(this.links);
      if (this.options.maximumLinks === 1 && numberOfLinks >= 1) {
        return _.values(this.links)[0];
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

  calculateNormalOffset = () => {
    const { alignment, portOffsetValue } = this.options;

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
}
