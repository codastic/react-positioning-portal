import React from 'react';
import { ComponentStory } from '@storybook/react';
export declare const extendStory: <ComponentType extends React.JSXElementConstructor<any> | keyof JSX.IntrinsicElements>(BaseStory: ComponentStory<ComponentType>, args?: Partial<React.ComponentProps<ComponentType>>) => any;
export declare const renderStory: <ComponentType extends React.JSXElementConstructor<any> | keyof JSX.IntrinsicElements>(Story: ComponentStory<ComponentType>, additionalArgs?: Partial<React.ComponentProps<ComponentType>> & {
    key?: React.Key;
}) => JSX.Element;
