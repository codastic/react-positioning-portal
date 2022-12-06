import PositioningPortalWithState from './PositioningPortalWithState';
import { ComponentStory } from '@storybook/react';
declare enum POSITION {
    TOP = "top",
    LEFT = "left",
    RIGHT = "right",
    BOTTOM = "bottom"
}
declare const _default: {
    title: string;
};
export default _default;
export declare const Base: ComponentStory<PositioningPortalWithState<{
    position: POSITION;
    shift: number;
}>>;
export declare const ScrollableTest: any;
export declare const PreferredPositionTop: any;
