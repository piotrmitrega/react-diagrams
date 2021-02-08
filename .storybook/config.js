import { configure } from '@storybook/react';

function loadStories() {
	require('../demos/index');
	// You can require as many demos as you need.
}

configure(loadStories, module);
