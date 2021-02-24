import { NodeType } from './NodeType';
import { BasicPortFactory } from '../port/BasicPortFactory';
import { BasePositionModelOptions } from '../../core-models/BasePositionModel';
import {
  NodeModelGenerics,
  NodeModelListener,
  SerializedNodeModel,
} from './NodeModel';
import { BaseEvent } from '../../core/BaseObserver';
import { MultiPortNodeModel } from './MultiPortNodeModel';
import { PortModelAlignment } from '../port/PortModel';
import { DeserializeEvent } from '../../core-models/BaseEntity';
import { CardType } from './CardType';

interface CardNodeModelOptions extends BasePositionModelOptions {
  cardType: CardType;
  title: string;
}

export interface CardNodeModelListener extends NodeModelListener {
  titleChanged: (event: BaseEvent) => any;
}

interface CardNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: CardNodeModelOptions;
  LISTENER: CardNodeModelListener;
}

export interface SerializedCardNodeModel extends SerializedNodeModel {
  cardType: CardType;
  title: string;
}

export class CardNodeModel extends MultiPortNodeModel<CardNodeModelGenerics> {
  private portFactory: BasicPortFactory;

  constructor(options: CardNodeModelOptions, portFactory: BasicPortFactory) {
    super({
      type: NodeType.CARD,
      cardType: options.cardType,
      title: options.title || String(options.cardType),
      width: 64,
      height: 64,
    });

    this.portFactory = portFactory;

    Object.values(PortModelAlignment).forEach((alignment) => {
      if (alignment !== PortModelAlignment.TOP) {
        this.addPort(
          this.portFactory.generateModel({
            initialConfig: { name: alignment, alignment },
          }),
        );
      }
    });
  }

  serialize(): SerializedCardNodeModel {
    return {
      ...super.serialize(),
      cardType: this.options.cardType,
      title: this.options.title,
    };
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.cardType = event.data.cardType;
    this.options.title = event.data.title;
  }

  setTitle(title: string) {
    this.options.title = title;
    this.fireEvent({}, 'titleChanged');
  }
}
