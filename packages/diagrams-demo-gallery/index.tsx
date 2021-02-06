import * as React from 'react';
import { storiesOf, addParameters, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { themes } from '@storybook/theming';
import './demos/helpers/index.css';
import { Toolkit } from '@piotrmitrega/react-canvas-core';

Toolkit.TESTING = true;
Toolkit.TESTING = true;

addParameters({
	options: {
		theme: themes.dark
	}
});

setOptions({
	name: 'STORM React Diagrams',
	url: 'https://github.com/piotrmitrega/react-diagrams',
	addonPanelInRight: true
});

import demo_alternative_linking from './demos/demo-alternative-linking';
import demo_custom_link_label from './demos/demo-custom-link-label';
import demo_adv_dnd from './demos/demo-drag-and-drop';
import demo_right_angles_routing from './demos/demo-right-angles-routing';

storiesOf('Advanced Techniques', module)
	.add('Drag and drop', demo_adv_dnd)
	.add('Right angles routing', demo_right_angles_routing)
	.add('Linking by clicking instead of dragging', demo_alternative_linking);

import demo_cust_links from './demos/demo-custom-link1';
import demo_cust_links2 from './demos/demo-custom-link2';

storiesOf('Customization', module)
	.add('Custom animated links', demo_cust_links)
	.add('Custom link ends (arrows)', demo_cust_links2)
	.add('Custom link label', demo_custom_link_label);