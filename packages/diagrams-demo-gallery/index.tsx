import * as React from 'react';
import { storiesOf, addParameters, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { themes } from '@storybook/theming';
import './demos/helpers/index.css';
import { Toolkit } from '@uxflow/engine';

Toolkit.TESTING = true;
Toolkit.TESTING = true;

addParameters({
	options: {
		theme: themes.dark
	}
});

setOptions({
	name: 'STORM React Diagrams',
	url: 'https://github.com/uxflow/engine',
	addonPanelInRight: true
});

import demo_custom_link_label from './demos/demo-custom-link-label';
import demo_right_angles_routing from './demos/demo-right-angles-routing';

storiesOf('Advanced Techniques', module)
	.add('Right angles routing', demo_right_angles_routing)

import demo_cust_links from './demos/demo-custom-link1';

storiesOf('Customization', module)
	.add('Custom animated links', demo_cust_links)
	.add('Custom link label', demo_custom_link_label);