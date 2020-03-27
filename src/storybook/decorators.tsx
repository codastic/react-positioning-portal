import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { addDecorator } from '@storybook/react';

import { COLORS } from './styles';

type DecoratorFunction = Parameters<typeof addDecorator>[0];

const GlobalStyle = createGlobalStyle`
  *, *:after, *:before {
    box-sizing: border-box;
  }

  body {
    color: ${COLORS.text};
    font-family: sans-serif;
  }
`;

export const globalStyleDecorator: DecoratorFunction = story => (
  <>
    <GlobalStyle />
    {story()}
  </>
);
