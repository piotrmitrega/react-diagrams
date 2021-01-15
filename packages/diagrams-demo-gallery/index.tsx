import * as React from 'react';
import { storiesOf, addParameters, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { themes } from '@storybook/theming';
import './demos/helpers/index.css';
import { Toolkit } from '@piotrmitrega/react-canvas-core';

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

import demo_performance from './demos/demo-performance';
import demo_locks from './demos/demo-locks';
import demo_grid from './demos/demo-grid';
import demo_listeners from './demos/demo-listeners';
import demo_zoom from './demos/demo-zoom-to-fit';
import demo_zoom_nodes from './demos/demo-zoom-to-fit-nodes';
import demo_labels from './demos/demo-labelled-links';
import demo_dynamic_ports from './demos/demo-dynamic-ports';
import demo_alternative_linking from './demos/demo-alternative-linking';
import demo_custom_link_label from './demos/demo-custom-link-label';
import demo_canvas_drag from './demos/demo-canvas-drag';

storiesOf('Simple Usage', module)
	.add('Performance demo', demo_performance)
	.add('Locked widget', demo_locks)
	.add('Canvas grid size', demo_grid)
	.add('Events and listeners', demo_listeners)
	.add('Zoom to fit', demo_zoom)
	.add('Zoom to fit nodes', demo_zoom_nodes)
	.add('Canvas drag', demo_canvas_drag)
	.add('Dynamic ports', demo_dynamic_ports)
	.add('Links with labels', demo_labels);

import demo_adv_prog from './demos/demo-mutate-graph';
import demo_adv_dnd from './demos/demo-drag-and-drop';
import demo_right_angles_routing from './demos/demo-right-angles-routing';

storiesOf('Advanced Techniques', module)
	.add('Programatically modifying graph', demo_adv_prog)
	.add('Drag and drop', demo_adv_dnd)
	.add('Right angles routing', demo_right_angles_routing)
	.add('Linking by clicking instead of dragging', demo_alternative_linking);

import demo_cust_nodes from './demos/demo-custom-node1';
import demo_cust_links from './demos/demo-custom-link1';
import demo_cust_links2 from './demos/demo-custom-link2';

storiesOf('Customization', module)
	.add('Custom diamond node', demo_cust_nodes)
	.add('Custom animated links', demo_cust_links)
	.add('Custom link ends (arrows)', demo_cust_links2)
	.add('Custom link label', demo_custom_link_label)

import demo_gsap from './demos/demo-animation';

storiesOf('3rd party libraries', module)
	.add('Animated node moves (GSAP)', demo_gsap);
