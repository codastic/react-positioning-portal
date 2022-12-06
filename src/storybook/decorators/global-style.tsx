import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { DecoratorFunction } from '@storybook/client-api';

import { COLORS } from '../styles';

const GlobalStyle = createGlobalStyle`
  *, *:after, *:before {
    box-sizing: border-box;
  }

  body {
    color: ${COLORS.text};
    font-family: sans-serif;
  }
`;

const globalStyle: DecoratorFunction = story => (
  <>
    <GlobalStyle />
    {story()}
  </>
);

export default globalStyle;
