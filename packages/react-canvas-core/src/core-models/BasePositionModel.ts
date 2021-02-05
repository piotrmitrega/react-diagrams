import {
  BaseModel,
  BaseModelGenerics,
  BaseModelListener,
  BaseModelOptions,
  SerializedBaseModel,
} from './BaseModel';
import { BaseEntityEvent, DeserializeEvent } from './BaseEntity';
import { Point, Rectangle } from '@piotrmitrega/geometry';
import { ModelGeometryInterface } from '../core/ModelGeometryInterface';

export interface BasePositionModelListener extends BaseModelListener {
  positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelOptions extends BaseModelOptions {
  width: number;
  height: number;
  position?: Point;
}

export interface BasePositionModelGenerics extends BaseModelGenerics {
  LISTENER: BasePositionModelListener;
  OPTIONS: BasePositionModelOptions;
}

export interface SerializedBasePositionModel extends SerializedBaseModel {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class BasePositionModel<
    G extends BasePositionModelGenerics = BasePositionModelGenerics
  >
  extends BaseModel<G>
  implements ModelGeometryInterface {
  protected position: Point;
  protected width;
  protected height;

  constructor(options: G['OPTIONS']) {
    super(options);
    this.width = options.width;
    this.height = options.height;
    this.position = options.position || new Point(0, 0);
  }

  setPosition(point: Point);
  setPosition(x: number, y: number);
  setPosition(x, y?) {
    if (this.isLocked()) {
      return;
    }
    if (typeof x === 'object') {
      this.position = x;
    } else if (typeof x) {
      this.position = new Point(x, y);
    }
    this.fireEvent({}, 'positionChanged');
  }

  getBoundingBox(): Rectangle {
    return new Rectangle(this.position, 0, 0);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.position = new Point(event.data.x, event.data.y);
  }

  serialize(): SerializedBasePositionModel {
    return {
      ...super.serialize(),
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }

  getPosition(): Point {
    return this.position;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }
}
