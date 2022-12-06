import React, { useRef, useEffect } from 'react';

import { DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';
import styled from 'styled-components';

const Root = styled.div`
  display: inline-block;
  margin: 150vh 150vw;
`;

function Scrollable({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          block: 'center',
          inline: 'center'
        });
      }
    }, 0);
  }, []);

  return <Root ref={scrollRef}>{children}</Root>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrollableDecorator: DecoratorFunction<ReactFramework, any> = function(
  story
) {
  return <Scrollable>{story()}</Scrollable>;
};

export default scrollableDecorator;
