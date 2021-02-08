import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { DiagramModel } from '../../src';
import { DemoButton } from './DemoWorkspaceWidget';

type Props = {
  model: DiagramModel;
};

export const SerializeButton: React.FC<Props> = ({ model }) => (
  <DemoButton
    onClick={() => {
      action('Serialized Graph')(JSON.stringify(model.serialize()));
    }}
  >
    Serialize Graph
  </DemoButton>
);
