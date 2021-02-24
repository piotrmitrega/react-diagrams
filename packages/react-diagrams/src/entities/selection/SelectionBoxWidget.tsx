import React from 'react';

import styles from './SelectionBoxWidget.module.scss';

export interface SelectionBoxWidgetProps {
  rect: ClientRect;
}

export class SelectionBoxWidget extends React.Component<SelectionBoxWidgetProps> {
  render() {
    const { rect } = this.props;
    return (
      <div
        className={styles.selectionBoxWidget}
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />
    );
  }
}
