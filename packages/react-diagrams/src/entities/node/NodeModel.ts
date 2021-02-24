import forEach from 'lodash/forEach';
import map from 'lodash/map';
import values from 'lodash/values';
import { DiagramModel } from '../../models/DiagramModel';
import { PortModel, SerializedPortModel } from '../port/PortModel';
import { LinkModel } from '../link/LinkModel';
import { DiagramEngine } from '../../DiagramEngine';
import { BaseModelListener } from '../../core-models/BaseModel';
import {
  BaseEntityEvent,
  DeserializeEvent,
} from '../../core-models/BaseEntity';
import {
  BasePositionModel,
  BasePositionModelGenerics,
  SerializedBasePositionModel,
} from '../../core-models/BasePositionModel';
import { Point, Rectangle } from '../../geometry';

export interface NodeModelListener extends BaseModelListener {
  positionChanged?(event: BaseEntityEvent<NodeModel>): void;
}

export interface NodeModelGenerics extends BasePositionModelGenerics {
  LISTENER: NodeModelListener;
  PARENT: DiagramModel;
}

export interface SerializedNodeModel extends SerializedBasePositionModel {
  ports: SerializedPortModel[];
}

export class NodeModel<
  G extends NodeModelGenerics = NodeModelGenerics
> extends BasePositionModel<G> {
  protected ports: { [s: string]: PortModel };

  constructor(options: G['OPTIONS']) {
    super({
      width: 34,
      height: 16,
      ...options,
    });
    this.ports = {};
  }

  getBoundingBox(): Rectangle {
    return new Rectangle(this.getPosition(), this.width, this.height);
  }

  deserialize(event: DeserializeEvent<this>) {
    this.stopFiringEvents();

    super.deserialize(event);

    forEach(event.data.ports, (port: any) => {
      const existingPort = this.getPortFromID(port.id);
      if (existingPort) {
        existingPort.deserialize({
          ...event,
          data: port,
        });
      } else {
        const createdPort = (event.engine as DiagramEngine)
          .getFactoryForPort(port.type)
          .generateModel({});
        createdPort.deserialize({
          ...event,
          data: port,
        });
        // the links need these
        event.registerModel(createdPort);
        this.addPort(createdPort);
      }
    });

    this.resumeFiringEvents();
  }

  serialize(): SerializedNodeModel {
    return {
      ...super.serialize(),
      ports: map(this.ports, (port) => port.serialize()),
    };
  }

  doClone(lookupTable = {}, clone) {
    // also clone the ports
    clone.ports = {};
    forEach(this.ports, (port) => {
      clone.addPort(port.clone(lookupTable));
    });
  }

  remove() {
    super.remove();
    forEach(this.ports, (port) => {
      forEach(port.getLinks(), (link) => {
        link.remove();
      });
    });
  }

  getPortFromID(id): PortModel | null {
    for (const i in this.ports) {
      if (this.ports[i].getID() === id) {
        return this.ports[i];
      }
    }
    return null;
  }

  getLink(id: string): LinkModel {
    for (const portID in this.ports) {
      const links = this.ports[portID].getLinks();
      if (links[id]) {
        return links[id];
      }
    }
  }

  getPort(name: string): PortModel | null {
    return this.ports[name];
  }

  getPorts(): { [s: string]: PortModel } {
    return this.ports;
  }

  removePort(port: PortModel) {
    // clear the port from the links
    for (const link of values(port.getLinks())) {
      link.clearPort(port);
    }
    //clear the parent node reference
    if (this.ports[port.getName()]) {
      this.ports[port.getName()].setParent(null);
      delete this.ports[port.getName()];
    }
  }

  addPort(port: PortModel): PortModel {
    port.setParent(this);
    this.ports[port.getName()] = port;
    return port;
  }
}
