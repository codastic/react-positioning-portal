import React from 'react';

import { ComponentStory } from '@storybook/react';

export const extendStory = <
  ComponentType extends
    | keyof JSX.IntrinsicElements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | React.JSXElementConstructor<any>
>(
  BaseStory: ComponentStory<ComponentType>,
  args: Partial<React.ComponentProps<ComponentType>> = {}
) => {
  const Story = BaseStory.bind({});
  Story.args = {
    ...BaseStory.args,
    ...args
  };

  return Story;
};

export const renderStory = <
  ComponentType extends
    | keyof JSX.IntrinsicElements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | React.JSXElementConstructor<any>
>(
  Story: ComponentStory<ComponentType>,
  additionalArgs: Partial<React.ComponentProps<ComponentType>> & {
    key?: React.Key;
  } = {}
) => (
  <Story
    {...(Story.args as React.ComponentProps<ComponentType>)}
    {...additionalArgs}
  />
);
