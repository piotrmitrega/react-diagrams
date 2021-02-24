import React from 'react';

import { PortModel, PortModelAlignment } from '../port/PortModel';
import { PortWidget } from '../port/PortWidget';

import styles from './CardWidgetPorts.module.scss';

type Props = {
  ports: PortModel[];
};

const classNameByAlignment = {
  [PortModelAlignment.TOP_LEFT]: styles.topLeft,
  [PortModelAlignment.TOP]: styles.top,
  [PortModelAlignment.TOP_RIGHT]: styles.topRight,
  [PortModelAlignment.LEFT]: styles.left,
  [PortModelAlignment.RIGHT]: styles.right,
  [PortModelAlignment.BOTTOM_LEFT]: styles.bottomLeft,
  [PortModelAlignment.BOTTOM]: styles.bottom,
  [PortModelAlignment.BOTTOM_RIGHT]: styles.bottomRight,
};

export const NodePortsWidget: React.FC<Props> = ({ ports }) => (
  <div>
    {ports.map((port) => (
      <PortWidget
        className={classNameByAlignment[port.getOptions().alignment]}
        key={port.getName()}
        port={port}
      />
    ))}
  </div>
);
