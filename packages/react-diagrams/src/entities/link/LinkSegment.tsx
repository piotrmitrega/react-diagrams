import React from 'react';
import classnames from 'classnames';

import { LinkModel } from './LinkModel';

import styles from './LinkSegment.module.scss';

type Props = {
  model: LinkModel;
  selected: boolean;
  path: string;
};
export const LinkSegment: React.FC<Props> = ({ model, selected, path }) => (
  <path
    className={classnames(styles.linkSegment, selected && styles.selected)}
    d={path}
    stroke={
      selected ? model.getOptions().selectedColor : model.getOptions().color
    }
    strokeWidth={model.getOptions().width}
  />
);
