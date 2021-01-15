import { NodeModel } from '../node/NodeModel';
import { LinkModel } from '../link/LinkModel';
import * as _ from 'lodash';
import { Point, Rectangle } from '@piotrmitrega/geometry';
import {
  BaseEntityEvent,
  BaseModelOptions,
  BasePositionModel,
  BasePositionModelGenerics,
  BasePositionModelListener,
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

export const PORT_SIZE = 16;

export interface PortModelListener extends BasePositionModelListener {
  /**
   * fires when it first receives positional information
   */
  reportInitialPosition?: (event: BaseEntityEvent<PortModel>) => void;
}

export interface PortModelOptions extends BaseModelOptions {
  alignment?: PortModelAlignment;
  maximumLinks?: number;
  portOffsetValue?: number;
  name: string;
}

export interface PortModelGenerics extends BasePositionModelGenerics {
  OPTIONS: PortModelOptions;
  PARENT: NodeModel;
  LISTENER: PortModelListener;
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

  reportedPosition: boolean;

  constructor(options: G['OPTIONS']) {
    super({
      ...defaultOptions,
      ...options,
    });
    this.links = {};
    this.reportedPosition = false;
  }

  deserialize(event: DeserializeEvent<this>) {
    this.stopFiringEvents();

    super.deserialize(event);
    this.reportedPosition = false;
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

  getMaximumLinks(): number {
    return this.options.maximumLinks;
  }

  setMaximumLinks(maximumLinks: number) {
    this.options.maximumLinks = maximumLinks;
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

  reportPosition() {
    _.forEach(this.getLinks(), (link) => {
      link.getPointForPort(this).setPosition(this.getOffsetPosition());
    });

    this.fireEvent(
      {
        entity: this,
      },
      'reportInitialPosition',
      true,
    );
  }

  getCenter(): Point {
    return new Point(
      this.getX() + this.width / 2,
      this.getY() + this.height / 2,
    );
  }

  updateCoords(coords: Rectangle) {
    this.width = coords.getWidth();
    this.height = coords.getHeight();
    this.setPosition(coords.getTopLeft());
    this.reportedPosition = true;
    this.reportPosition();

    this.resumeFiringEvents();
  }

  canLinkToPort(port: PortModel): boolean {
    return port !== this;
  }

  isLocked() {
    return super.isLocked() || this.getParent().isLocked();
  }

  calculateNormalOffset = () => {
    const nodeBox = this.getNode().getBoundingBox();
    const points = nodeBox.getPoints();
    const { x: portX, y: portY } = this.getPosition();

    const pointsXCoordinates = points.map((point) => point.x);
    const pointsYCoordinates = points.map((point) => point.y);

    const minDistanceX = Math.min(
      ...pointsXCoordinates.map((x) => Math.abs(x - portX)),
    );

    const minDistanceY = Math.min(
      ...pointsYCoordinates.map((y) => Math.abs(y - portY)),
    );

    const isXAxis = minDistanceX < minDistanceY;

    const direction = Math.sign(
      isXAxis ? portX - nodeBox.getOrigin().x : portY - nodeBox.getOrigin().y,
    );

    const { portOffsetValue } = this.options;

    return new Point(
      isXAxis ? direction * portOffsetValue : 0,
      isXAxis ? 0 : direction * portOffsetValue,
    );
  };

  getOffsetPosition = (): Point => {
    const offset = this.calculateNormalOffset();

    const offsetPosition = this.getCenter();
    offsetPosition.translate(offset.x, offset.y);

    return offsetPosition;
  };
}
