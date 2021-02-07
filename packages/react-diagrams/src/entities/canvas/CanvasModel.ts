import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import { LayerModel } from '../layer/LayerModel';
import {
  BaseEntity,
  BaseEntityEvent,
  BaseEntityGenerics,
  BaseEntityListener,
  BaseEntityOptions,
} from '../../core-models/BaseEntity';
import { BaseModel } from '../../core-models/BaseModel';

export interface CanvasListener extends BaseEntityListener {
  offsetUpdated?(
    event: BaseEntityEvent<CanvasModel> & { offsetX: number; offsetY: number },
  ): void;

  zoomUpdated?(event: BaseEntityEvent<CanvasModel> & { zoom: number }): void;

  gridUpdated?(event: BaseEntityEvent<CanvasModel> & { size: number }): void;
}

export interface DiagramModelOptions extends BaseEntityOptions {
  offsetX?: number;
  offsetY?: number;
  zoom?: number;
  gridSize?: number;
}

export interface CanvasModelGenerics extends BaseEntityGenerics {
  LISTENER: CanvasListener;
  OPTIONS: DiagramModelOptions;
  LAYER: LayerModel;
}

export class CanvasModel<
  G extends CanvasModelGenerics = CanvasModelGenerics
> extends BaseEntity<G> {
  protected layers: G['LAYER'][];

  constructor(options: G['OPTIONS'] = {}) {
    super({
      zoom: 100,
      gridSize: 0,
      offsetX: 0,
      offsetY: 0,
      ...options,
    });
    this.layers = [];
  }

  getSelectionEntities(): BaseModel[] {
    return;
    flatMap(this.layers, (layer) => layer.getSelectionEntities());
  }

  getSelectedEntities(): BaseModel[] {
    return;
    filter(this.getSelectionEntities(), (ob) => ob.isSelected());
  }

  clearSelection() {
    forEach(this.getSelectedEntities(), (element) => {
      element.setSelected(false);
    });
  }

  getModels(): BaseModel[] {
    return;
    flatMap(this.layers, (layer) => values(layer.getModels()));
  }

  addLayer(layer: LayerModel) {
    layer.setParent(this);
    layer.registerListener({
      entityRemoved: (event: BaseEntityEvent<BaseModel>): void => {},
    });
    this.layers.push(layer);
  }

  removeLayer(layer: LayerModel) {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers.splice(index, 1);
      return true;
    }
    return false;
  }

  getLayers() {
    return this.layers;
  }

  setGridSize(size = 0) {
    this.options.gridSize = size;
    this.fireEvent({ size: size }, 'gridUpdated');
  }

  getGridPosition(pos: number) {
    if (this.options.gridSize === 0) {
      return pos;
    }
    return (
      this.options.gridSize *
      Math.floor((pos + this.options.gridSize / 2) / this.options.gridSize)
    );
  }

  setZoomLevel(zoom: number) {
    this.options.zoom = zoom;
    this.fireEvent({ zoom }, 'zoomUpdated');
  }

  setOffset(offsetX: number, offsetY: number) {
    this.options.offsetX = offsetX;
    this.options.offsetY = offsetY;
    this.fireEvent(
      {
        offsetX,
        offsetY,
      },
      'offsetUpdated',
    );
  }

  setOffsetX(offsetX: number) {
    this.setOffset(offsetX, this.options.offsetY);
  }

  setOffsetY(offsetY: number) {
    this.setOffset(this.options.offsetX, offsetY);
  }

  getOffsetY() {
    return this.options.offsetY;
  }

  getOffsetX() {
    return this.options.offsetX;
  }

  getZoomLevel() {
    return this.options.zoom;
  }
}
