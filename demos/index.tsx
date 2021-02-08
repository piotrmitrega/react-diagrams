import * as React from 'react';
import { storiesOf, addParameters, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { themes } from '@storybook/theming';
import './helpers/index.css';
import { Toolkit } from '../src';

Toolkit.TESTING = true;
Toolkit.TESTING = true;

addParameters({
  options: {
    theme: themes.dark,
  },
});

setOptions({
  name: 'STORM React Diagrams',
  url: 'https://github.com/piotrmitrega/../../packages/react-diagrams/src',
  addonPanelInRight: true,
});

import demo_custom_link_label from './demo-custom-link-label';
import demo_right_angles_routing from './demo-right-angles-routing';

storiesOf('Advanced Techniques', module).add(
  'Right angles routing',
  demo_right_angles_routing,
);

import demo_cust_links from './demo-custom-link1';

storiesOf('Customization', module)
  .add('Custom animated links', demo_cust_links)
  .add('Custom link label', demo_custom_link_label);
