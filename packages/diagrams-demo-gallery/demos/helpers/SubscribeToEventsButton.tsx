import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { DiagramModel } from '@piotrmitrega/react-diagrams-core';
import { DemoButton } from './DemoWorkspaceWidget';

type Props = {
	model: DiagramModel;
}

export const SubscribeToEventsButton: React.FC<Props> = ({ model}) => {
	const subscribeToEvents = () => {
		// add a selection listener to each
		model.getModels().forEach((item) => {
			item.registerListener({
				eventDidFire: (event) => action(event.function)(event)
			});
		});

		model.registerListener({
			eventDidFire: (event) => action(event.function)(event)
		});
	};

	return (
		<DemoButton
			onClick={subscribeToEvents}
		>
			Subscribe to events
		</DemoButton>
	);
};
