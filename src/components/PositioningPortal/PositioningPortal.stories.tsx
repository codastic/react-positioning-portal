import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'PositioningPortal',
  decorators: [withKnobs]
};

export const base = () => <div>{text('content', 'example')}</div>;
