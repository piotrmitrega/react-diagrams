import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { DiagramModel } from '@uxflow/engine-core';
import { DemoButton } from './DemoWorkspaceWidget';

type Props = {
	model: DiagramModel;
}

export const SerializeButton: React.FC<Props> = ({ model }) => {
	return (
		<DemoButton
			onClick={() => {
				action('Serialized Graph')(JSON.stringify(model.serialize()));
			}}>
			Serialize Graph
		</DemoButton>
	);
};
