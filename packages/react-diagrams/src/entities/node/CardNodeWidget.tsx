import React, { useState } from 'react';
import classnames from 'classnames';

import { CardNodeModel } from './CardNodeModel';
import { CardImage } from './CardImage';

import styles from './CardNodeWidget.module.scss';

type FlowchartNodeWidgetProps = {
  node: CardNodeModel;
};

export const CardNodeWidget: React.FC<FlowchartNodeWidgetProps> = ({
  node,
}) => {
  const { cardType } = node.getOptions();

  const [title, setTitle] = ['fefe', () => console.log('sasas')];

  const imageClassNames = classnames(
    styles.cardImage,
    node.isSelected() && styles.selected,
  );

  return (
    <div className={styles.cardWidget}>
      <input
        className={styles['card-title']}
        type="text"
        value={title}
        onChange={(event) => {
          // setTitle(event.target.value);
          node.setTitle(event.target.value);
        }}
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
      />
      <div className={styles['content-wrapper']}>
        <CardImage className={imageClassNames} type={cardType} />
      </div>
    </div>
  );
};
