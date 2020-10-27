import { Rectangle } from '@piotrmitrega/geometry';

export interface ModelGeometryInterface {
	getBoundingBox(): Rectangle;
}
