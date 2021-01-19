import {
  DefaultLinkModel,
  DefaultLinkModelOptions,
} from '@piotrmitrega/react-diagrams-defaults';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';
import { PointModel } from '@piotrmitrega/react-diagrams-core';
import { DeserializeEvent } from '@piotrmitrega/react-canvas-core';
import { RightAngleLinkPathDirections } from './RightAngleLinkPathDirections';
import { Point } from '@piotrmitrega/geometry';

export const getRightAnglePoint = (point1: Point, point2: Point) =>
  point1.x > point2.x
    ? new Point(point1.x, point2.y)
    : new Point(point2.x, point1.y);

export class RightAngleLinkModel extends DefaultLinkModel {
  lastHoverIndexOfPath: number;
  directions: RightAngleLinkPathDirections;

  constructor(options: DefaultLinkModelOptions = {}) {
    super({
      type: RightAngleLinkFactory.NAME,
      ...options,
    });

    this.points.push(
      new PointModel({
        link: this,
      }),
    );

    this.lastHoverIndexOfPath = 0;
    this.calculateDirections();
  }

  calculateDirections() {
    this.directions = new RightAngleLinkPathDirections(
      this.points.map((p) => p.getPosition()),
    );
  }

  onLastPointDragged() {
    this.adjustMiddlePoint(1);
    this.calculateDirections();
  }

  adjustMiddlePoint(index: number) {
    if (index === 0 || index > this.getPoints().length - 1) {
      throw new Error(
        `Point at index: ${index} is not a middle point. Points count: ${
          this.getPoints().length
        }`,
      );
    }

    const previousPoint = this.getPoints()[index - 1];
    const nextPoint = this.getPoints()[index + 1];

    const middlePosition = getRightAnglePoint(
      previousPoint.getPosition(),
      nextPoint.getPosition(),
    );

    this.getPoints()[index].setPosition(middlePosition);
  }

  addPoint<P extends PointModel>(pointModel: P, index = 1): P {
    super.addPoint(pointModel, index);
    this.calculateDirections();
    return pointModel;
  }

  setPoints(points: PointModel[]) {
    super.setPoints(points);
    this.calculateDirections();
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.calculateDirections();
  }

  getLastPathXdirection(): boolean {
    return Boolean(this.directions.getLastPathDirection());
  }

  getFirstPathXdirection(): boolean {
    return Boolean(this.directions.getFirstPathDirection());
  }

  setWidth(width: number) {
    this.options.width = width;
    this.fireEvent({ width }, 'widthChanged');
  }

  setColor(color: string) {
    this.options.color = color;
    this.fireEvent({ color }, 'colorChanged');
  }
}
