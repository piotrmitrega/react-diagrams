import mapValues from 'lodash/mapValues';
import flatMap from 'lodash/flatMap';
import { CanvasModel } from '../canvas/CanvasModel';
import {
  BaseModel,
  BaseModelGenerics,
  BaseModelOptions,
  SerializedBaseModel,
} from '../../../core-models/BaseModel';
import { CanvasEngine } from '../../../CanvasEngine';
import { AbstractModelFactory } from '../../../core/AbstractModelFactory';
import { FactoryBank } from '../../../core/FactoryBank';
import { DeserializeEvent } from '../../../core-models/BaseEntity';

export interface LayerModelOptions extends BaseModelOptions {
  isSvg?: boolean;
  transformed?: boolean;
}

export interface LayerModelGenerics extends BaseModelGenerics {
  OPTIONS: LayerModelOptions;
  PARENT: CanvasModel;
  CHILDREN: BaseModel;
  ENGINE: CanvasEngine;
}

export type SerializedEntityRemoved = null;

export type SerializedLayer = {
  [id: string]: SerializedBaseModel | SerializedEntityRemoved;
};

export abstract class LayerModel<
  G extends LayerModelGenerics = LayerModelGenerics
> extends BaseModel<G> {
  protected models: { [id: string]: G['CHILDREN'] };
  protected repaintEnabled: boolean;

  constructor(options: G['OPTIONS'] = {}) {
    super(options);
    this.models = {};
    this.repaintEnabled = true;
  }

  /**
   * This is used for deserialization
   */
  abstract getChildModelFactoryBank(
    engine: G['ENGINE'],
  ): FactoryBank<AbstractModelFactory<BaseModel>>;

  deserializeModels(event: DeserializeEvent<this>) {
    Object.keys(event.data).forEach((modelId) => {
      const model = event.data[modelId];

      if (!model) {
        this.removeModel(modelId);
      } else {
        const existingModel = this.getModel(modelId) as BaseModel;
        if (existingModel) {
          existingModel.deserialize({
            ...event,
            data: model,
          });
        } else {
          const modelOb = this.getChildModelFactoryBank(event.engine)
            .getFactory(model.type)
            .generateModel({
              initialConfig: model,
            });
          modelOb.deserialize({
            ...event,
            data: model,
          });
          this.addModel(modelOb);
        }
      }
    });
  }

  serialize(): SerializedLayer {
    return mapValues(this.models, (model) => model.serialize());
  }

  isRepaintEnabled() {
    return this.repaintEnabled;
  }

  allowRepaint(allow = true) {
    this.repaintEnabled = allow;
  }

  remove() {
    if (this.parent) {
      this.parent.removeLayer(this);
    }
    super.remove();
  }

  addModel(model: G['CHILDREN']) {
    model.setParent(this);
    this.models[model.getID()] = model;
  }

  getSelectionEntities(): Array<BaseModel> {
    return flatMap(this.models, (model) => model.getSelectionEntities());
  }

  getModels() {
    return this.models;
  }

  getModel(id: string) {
    return this.models[id];
  }

  removeModel(id: string | G['CHILDREN']): boolean {
    const _id = typeof id === 'string' ? id : id.getID();
    if (this.models[_id]) {
      delete this.models[_id];
      return true;
    }
    return false;
  }
}
