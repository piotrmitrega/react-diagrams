import {
  BaseModel,
  BaseModelGenerics,
  BaseModelOptions,
} from '@piotrmitrega/react-canvas-core';
import { Grid } from '..';

export interface GridModelOptions extends BaseModelOptions {
  grid: typeof Grid;
  hAdjustmentFactor: number;
  vAdjustmentFactor: number;
}

export interface GridModelGenerics extends BaseModelGenerics {
  OPTIONS: GridModelOptions;
}

export type GridArea = {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
};

// @ts-ignore
export class GridModel<
  G extends GridModelGenerics = GridModelGenerics
> extends BaseModel<GridModelGenerics> {
  constructor(options: G['OPTIONS']) {
    super(options);
  }

  /**
   * The routing matrix does not have negative indexes, but elements could be negatively positioned.
   * We use the functions below to translate back and forth between these coordinates, relying on the
   * calculated values of hAdjustmentFactor and vAdjustmentFactor.
   */
  translateRoutingX = (x: number, reverse = false) =>
    x + this.getOptions().hAdjustmentFactor * (reverse ? -1 : 1);

  translateRoutingY = (y: number, reverse = false) =>
    y + this.getOptions().vAdjustmentFactor * (reverse ? -1 : 1);

  markArea = (area: GridArea, walkable: boolean) => {
    const { grid } = this.getOptions();
    const { startX, endX, startY, endY } = area;

    for (let x = startX - 1; x <= endX + 1; x++) {
      for (let y = startY - 1; y < endY + 1; y++) {
        grid.setWalkableAt(
          this.translateRoutingX(x),
          this.translateRoutingY(y),
          walkable,
        );
      }
    }
  };
}
