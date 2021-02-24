import React from 'react';
import classnames from 'classnames';

import { PortModel } from './PortModel';

import styles from './PortWidget.module.scss';

export interface PortProps {
  port: PortModel;
  className?: string;
}

export const PortWidget: React.FC<PortProps> = React.memo(
  ({ className, port }) => {
    if (!port) {
      return null;
    }

    return (
      <div
        className={classnames('port', styles.wrapper, className)}
        data-name={port.getName()}
        data-nodeid={port.getNode().getID()}
      >
        <div className={styles.port} />
      </div>
    );
  },
);
