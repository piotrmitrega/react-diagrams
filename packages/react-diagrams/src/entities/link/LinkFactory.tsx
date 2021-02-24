import React from 'react';
import classnames from 'classnames';

import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from './LinkModel';
import { AbstractReactFactory } from '../../core/AbstractReactFactory';

import styles from './LinkFactory.module.scss';

export abstract class LinkFactory<
  Link extends LinkModel = LinkModel
> extends AbstractReactFactory<Link, DiagramEngine> {
  protected constructor(type: string) {
    super(type);
  }

  abstract generateReactWidget(event): JSX.Element;

  abstract generateModel(event): Link;

  generateLinkSegment(model: Link, selected: boolean, path: string) {
    return (
      <path
        className={classnames(styles.linkPath, selected && styles.selected)}
        d={path}
        stroke={
          selected ? model.getOptions().selectedColor : model.getOptions().color
        }
        strokeWidth={model.getOptions().width}
      />
    );
  }
}
