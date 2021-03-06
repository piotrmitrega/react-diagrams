import map from 'lodash/map';
import slice from 'lodash/slice';
import forEach from 'lodash/forEach';
import { PortModel } from '../port/PortModel';
import { PointModel } from './PointModel';
import { LabelModel, SerializedLabelModel } from '../label/LabelModel';
import { DiagramEngine } from '../../DiagramEngine';
import { DiagramModel } from '../../models/DiagramModel';
import {
  BaseModel,
  BaseModelGenerics,
  BaseModelListener,
  BaseModelOptions,
  SerializedBaseModel,
} from '../../core-models/BaseModel';
import {
  BaseEntityEvent,
  DeserializeEvent,
} from '../../core-models/BaseEntity';
import { SerializedBasePositionModel } from '../../core-models/BasePositionModel';
import { ModelGeometryInterface } from '../../core/ModelGeometryInterface';
import { Point, Polygon, Rectangle } from '../../geometry';
import { PathModel } from '../path/PathModel';

export interface LinkModelListener extends BaseModelListener {
  sourcePortChanged?(
    event: BaseEntityEvent<LinkModel> & { port: null | PortModel },
  ): void;

  targetPortChanged?(
    event: BaseEntityEvent<LinkModel> & { port: null | PortModel },
  ): void;

  dragged?(event: BaseEntityEvent<LinkModel>): void;
}

export interface LinkModelOptions extends BaseModelOptions {
  width?: number;
  color?: string;
  selectedColor?: string;
}

export interface LinkModelGenerics extends BaseModelGenerics {
  LISTENER: LinkModelListener;
  PARENT: DiagramModel;
  OPTIONS: LinkModelOptions;
}

export interface SerializedLinkModel extends SerializedBaseModel {
  source: string | null;
  sourcePort: string | null;
  target: string | null;
  targetPort: string | null;
  points: SerializedBasePositionModel[];
  labels: SerializedLabelModel[];
}

export class LinkModel<G extends LinkModelGenerics = LinkModelGenerics>
  extends BaseModel<G>
  implements ModelGeometryInterface {
  protected sourcePort: PortModel | null;
  protected targetPort: PortModel | null;

  protected labels: LabelModel[];
  protected points: PointModel[];

  protected renderedPaths: SVGPathElement[];

  constructor(options: G['OPTIONS']) {
    super({
      color: 'gray',
      width: 3,
      selectedColor: 'rgb(0,192,255)',
      ...options,
    });
    this.points = [this.generatePoint(0, 0), this.generatePoint(0, 0)];
    this.sourcePort = null;
    this.targetPort = null;
    this.renderedPaths = [];
    this.labels = [];
  }

  getBoundingBox(): Rectangle {
    return Polygon.boundingBoxFromPoints(
      map(this.points, (point: PointModel) => point.getPosition()),
    );
  }

  getSelectionEntities(): Array<BaseModel> {
    if (this.getTargetPort() && this.getSourcePort()) {
      return super
        .getSelectionEntities()
        .concat(slice(this.points, 1, this.points.length - 1));
    }
    // allow selection of the first point
    if (!this.getSourcePort()) {
      return super
        .getSelectionEntities()
        .concat(slice(this.points, 0, this.points.length - 1));
    }
    // allow selection of the last point
    if (!this.getTargetPort()) {
      return super
        .getSelectionEntities()
        .concat(slice(this.points, 1, this.points.length));
    }
    return super.getSelectionEntities().concat(this.points);
  }

  deserialize(event: DeserializeEvent<this>) {
    this.stopFiringEvents();

    const {
      labels,
      points,
      source,
      sourcePort,
      target,
      targetPort,
    } = event.data;

    super.deserialize(event);
    this.points = map(points || [], (point) => {
      const p = this.generatePoint(point.x, point.y);
      p.deserialize({
        ...event,
        data: point,
      });
      return p;
    });

    forEach(labels || [], (label: any) => {
      const existingLabel = this.getLabel(label.getID());
      if (existingLabel) {
        existingLabel.deserialize({
          ...event,
          data: label,
        });
      } else {
        const createdLabel = (event.engine as DiagramEngine)
          .getFactoryForLabel(label.type)
          .generateModel({});
        createdLabel.deserialize({
          ...event,
          data: label,
        });
        this.addLabel(createdLabel);
      }
    });

    const nodes = (event.engine as DiagramEngine).getModel().getNodes();

    if (target) {
      this.setTargetPort(
        nodes
          .find((m) => m.getID() === target)
          .getPortFromID(targetPort) as PortModel,
      );
    }
    if (source) {
      this.setSourcePort(
        nodes
          .find((m) => m.getID() === source)
          .getPortFromID(sourcePort) as PortModel,
      );
    }

    this.resumeFiringEvents();
  }

  setColor(color: string) {
    this.options.color = color;
    this.fireEvent({ color }, 'colorChanged');
  }

  getRenderedPath(): SVGPathElement[] {
    return this.renderedPaths;
  }

  setRenderedPaths(paths: SVGPathElement[]) {
    this.renderedPaths = paths;
  }

  serialize(): SerializedLinkModel {
    return {
      ...super.serialize(),
      source: this.sourcePort ? this.sourcePort.getParent().getID() : null,
      sourcePort: this.sourcePort ? this.sourcePort.getID() : null,
      target: this.targetPort ? this.targetPort.getParent().getID() : null,
      targetPort: this.targetPort ? this.targetPort.getID() : null,
      points: map(this.points, (point) => point.serialize()),
      labels: map(this.labels, (label) => label.serialize()),
    };
  }

  doClone(lookupTable = {}, clone) {
    clone.setPoints(
      map(this.getPoints(), (point: PointModel) => point.clone(lookupTable)),
    );
    if (this.sourcePort) {
      clone.setSourcePort(this.sourcePort.clone(lookupTable));
    }
    if (this.targetPort) {
      clone.setTargetPort(this.targetPort.clone(lookupTable));
    }
  }

  clearPort(port: PortModel) {
    if (this.sourcePort === port) {
      this.setSourcePort(null);
    } else if (this.targetPort === port) {
      this.setTargetPort(null);
    }
  }

  remove() {
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
    super.remove();
  }

  isLastPoint(point: PointModel) {
    const index = this.getPointIndex(point);
    return index === this.points.length - 1;
  }

  getPointIndex(point: PointModel) {
    return this.points.indexOf(point);
  }

  getPointModel(id: string): PointModel | null {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].getID() === id) {
        return this.points[i];
      }
    }
    return null;
  }

  getPortForPoint(point: PointModel): PortModel {
    if (
      this.sourcePort !== null &&
      this.getFirstPoint().getID() === point.getID()
    ) {
      return this.sourcePort;
    }
    if (
      this.targetPort !== null &&
      this.getLastPoint().getID() === point.getID()
    ) {
      return this.targetPort;
    }
    return null;
  }

  getPointForPort(port: PortModel): PointModel {
    if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
      return this.getFirstPoint();
    }
    if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
      return this.getLastPoint();
    }
    return null;
  }

  getFirstPoint(): PointModel {
    return this.points[0];
  }

  getLastPoint(): PointModel {
    return this.points[this.points.length - 1];
  }

  setSourcePort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.sourcePort !== null) {
      this.sourcePort.removeLink(this);
    }
    this.points[0].setPosition(port.getOffsetPosition());
    this.sourcePort = port;

    this.fireEvent({ port }, 'sourcePortChanged');
  }

  getSourcePort(): PortModel {
    return this.sourcePort;
  }

  getTargetPort(): PortModel {
    return this.targetPort;
  }

  setTargetPort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.targetPort !== null) {
      this.targetPort.removeLink(this);
    }
    this.targetPort = port;
    this.fireEvent({ port }, 'targetPortChanged');
  }

  point(x: number, y: number, index = 1): PointModel {
    return this.addPoint(this.generatePoint(x, y), index);
  }

  addLabel(label: LabelModel) {
    label.setParent(this);
    this.labels.push(label);
  }

  getPoints(): PointModel[] {
    return this.points;
  }

  getLabels() {
    return this.labels;
  }

  getLabel(id: string) {
    return this.getLabels().find((label) => label.getID() === id);
  }

  setPath(path: PathModel) {
    const pointModels = path
      .getPoints()
      .map((point) => this.generatePoint(point.x, point.y));

    this.setPoints(pointModels);
  }

  setPoints(points: PointModel[]) {
    forEach(points, (point) => {
      point.setParent(this);
    });
    this.points = points;
  }

  removePoint(pointModel: PointModel) {
    this.points.splice(this.getPointIndex(pointModel), 1);
  }

  onLastPointDragged() {}

  onDragged() {
    this.fireEvent({}, 'dragged');
  }

  addPoint<P extends PointModel>(pointModel: P, index = 1): P {
    pointModel.setParent(this);
    this.points.splice(index, 0, pointModel);
    return pointModel;
  }

  generatePoint(x = 0, y = 0): PointModel {
    return new PointModel({
      link: this,
      position: new Point(x, y),
      width: 0,
      height: 0,
    });
  }
}
