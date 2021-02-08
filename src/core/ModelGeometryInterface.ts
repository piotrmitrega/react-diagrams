import { Rectangle } from '../geometry';

export interface ModelGeometryInterface {
  getBoundingBox(): Rectangle;
}
