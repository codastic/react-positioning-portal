'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');

const DEFAULT_SCROLL_PARENT = 'BODY';
function isScrollParent(element) {
    try {
        const { overflow, overflowY, overflowX } = getComputedStyle(element);
        return /(auto|scroll)/.test(overflow + overflowX + overflowY);
    }
    catch (e) {
        return false;
    }
}
function getScrollParents(element, scrollParents = []) {
    if (!element || element.tagName === DEFAULT_SCROLL_PARENT) {
        return [...scrollParents, document.body];
    }
    return getScrollParents(element.parentElement, isScrollParent(element) ? [...scrollParents, element] : scrollParents);
}

var noop = () => {
    /** */
};

var Position;
(function (Position) {
    Position["ABOVE_LEFT"] = "ABOVE_LEFT";
    Position["ABOVE_RIGHT"] = "ABOVE_RIGHT";
    Position["BELOW_LEFT"] = "BELOW_LEFT";
    Position["BELOW_RIGHT"] = "BELOW_RIGHT";
})(Position || (Position = {}));
const renderProps = (element, props) => typeof element === 'function' ? element(props) : element;
const defaultPositionStrategy = (parentRect, portalRect
/* props: Props<Position> */
) => {
    // Open the content portal above the child if there is not enough space to the bottom,
    // but if there also isn't enough space at the top, open to the bottom.
    const openAbove = parentRect.top + parentRect.height + portalRect.height >
        (window.document.documentElement || window.document.body).clientHeight &&
        parentRect.top - portalRect.height > 0;
    const top = openAbove
        ? parentRect.top - portalRect.height + window.scrollY
        : parentRect.top + parentRect.height + window.scrollY;
    // Open the content portal to the left if there is not enough space at the right,
    // but if there also isn't enough space at the right, open to the left.
    const alignRight = parentRect.left + portalRect.width >
        (window.document.documentElement || window.document.body).clientWidth &&
        parentRect.left - portalRect.width > 0;
    const left = !alignRight
        ? parentRect.left + window.scrollX
        : window.scrollX + parentRect.left - portalRect.width + parentRect.width;
    let strategy = Position.BELOW_RIGHT;
    if (openAbove && left) {
        strategy = Position.ABOVE_LEFT;
    }
    if (openAbove && !left) {
        strategy = Position.ABOVE_RIGHT;
    }
    if (!openAbove && left) {
        strategy = Position.BELOW_LEFT;
    }
    if (!openAbove && !left) {
        strategy = Position.BELOW_RIGHT;
    }
    return {
        top,
        left,
        strategy
    };
};
const KEYCODES = {
    ESCAPE: 27
};
class PositioningPortal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            top: null,
            left: null,
            portalRect: null,
            parentRect: null,
            isPositioned: false,
            isOpen: false,
            transitionActive: false,
            scrollParents: [],
            strategy: null
        };
        this.portalRef = React.createRef();
        this.close = () => {
            if (this.props.onShouldClose) {
                this.props.onShouldClose();
            }
        };
        this.transitionStarted = () => {
            this.setState({ transitionActive: true });
        };
        this.transitionEnded = () => {
            this.setState({ transitionActive: false });
        };
        this.handleOutsideMouseClick = (event) => {
            if (!this.props.closeOnOutsideClick) {
                return;
            }
            if (!this.state.isOpen) {
                return;
            }
            if (this.portalRef.current &&
                this.portalRef.current.contains(event.target)) {
                return;
            }
            const parentDom = ReactDOM.findDOMNode(this);
            if (parentDom && parentDom.contains(event.target)) {
                return;
            }
            this.close();
        };
        this.handleKeydown = (event) => {
            if (this.state.isOpen &&
                this.props.closeOnKeyDown &&
                this.props.closeOnKeyDown(event)) {
                this.close();
            }
        };
        this.onOpen = () => {
            if (!this.state.isOpen) {
                // 1) Prerender portal to get stable portal rect.
                this.preRenderPortal()
                    // 2) Position portal with positioning strategy and trigger final render
                    .then(this.finalRenderPortal)
                    // 3) Communicate that portal has opened
                    .then(() => {
                    this.props.onOpen();
                });
            }
        };
        this.onClose = () => {
            if (!this.state.isOpen) {
                return;
            }
            // Remove scroll event listeners
            this.state.scrollParents.forEach(node => node.removeEventListener('scroll', this.close, false));
            this.setState({
                isOpen: false,
                scrollParents: []
            });
            this.props.onClose();
        };
        this.preRenderPortal = () => new Promise(resolve => {
            // A tricky way to get the first child DOM element of the fragment of this component.
            // Unfortunately there seems to be no way to achieve this with refs.
            const parentDom = ReactDOM.findDOMNode(this);
            if (parentDom && parentDom.nodeType === Node.ELEMENT_NODE) {
                const parentRect = parentDom.getBoundingClientRect();
                let scrollParents = [];
                // Register scroll listener on all scrollable parents to close the portal on scroll
                scrollParents = getScrollParents(parentDom);
                scrollParents.forEach(node => node.addEventListener('scroll', this.close, false));
                this.setState({
                    isOpen: true,
                    transitionActive: false,
                    isPositioned: false,
                    left: 0,
                    top: 0,
                    strategy: null,
                    parentRect,
                    portalRect: null,
                    scrollParents
                }, resolve);
            }
            else {
                resolve();
            }
        });
        this.finalRenderPortal = () => new Promise(resolve => {
            if (this.state.isOpen &&
                !this.state.isPositioned &&
                this.portalRef.current &&
                this.state.parentRect) {
                const portalRect = this.portalRef.current.getBoundingClientRect();
                const { top, left, strategy } = this.props.positionStrategy(this.state.parentRect, portalRect, this.props);
                this.setState({
                    isPositioned: true,
                    left,
                    strategy,
                    top,
                    portalRect
                }, resolve);
            }
            else {
                resolve();
            }
        });
    }
    componentDidMount() {
        window.document.addEventListener('keydown', this.handleKeydown, false);
        window.document.addEventListener('click', this.handleOutsideMouseClick, false);
        if (this.props.isOpen) {
            this.onOpen();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen) {
                this.onOpen();
            }
            else {
                this.onClose();
            }
        }
    }
    componentWillUnmount() {
        window.document.removeEventListener('keydown', this.handleKeydown, false);
        window.document.removeEventListener('click', this.handleOutsideMouseClick, false);
        // Remove scroll event listeners
        this.state.scrollParents.forEach(node => node.removeEventListener('scroll', this.close, false));
    }
    render() {
        const { children, portalContent, portalElement, rootNode = document.body } = this.props;
        const { top, left, parentRect, portalRect, isPositioned, isOpen, strategy, transitionActive } = this.state;
        const relatedWidth = parentRect ? parentRect.width : 0;
        const portalStyle = {
            position: 'absolute',
            width: portalRect ? `${portalRect.width}px` : 'auto',
            left: `${left}px`,
            top: `${top}px`,
            visibility: isPositioned ? 'visible' : 'hidden'
        };
        const renderPortal = () => ReactDOM.createPortal(React.cloneElement(portalElement || React.createElement("div", null), {
            ref: this.portalRef,
            style: Object.assign(Object.assign({}, portalStyle), ((portalElement && portalElement.props.style) || {}))
        }, renderProps(portalContent, {
            close: this.close,
            transitionStarted: this.transitionStarted,
            transitionEnded: this.transitionEnded,
            strategy,
            isOpen,
            isPositioned,
            relatedWidth
        })), rootNode);
        return (React.createElement(React.Fragment, null,
            children,
            (isOpen || transitionActive) && renderPortal()));
    }
}
PositioningPortal.defaultProps = {
    isOpen: false,
    onOpen: noop,
    onClose: noop,
    onShouldClose: noop,
    closeOnOutsideClick: true,
    closeOnKeyDown: (event) => event.keyCode === KEYCODES.ESCAPE,
    positionStrategy: defaultPositionStrategy
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const renderProps$1 = (element, props) => typeof element === 'function' ? element(props) : element;
const PositioningPortalWithState = (props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { children } = props, restProps = __rest(props, ["children"]);
    const open = () => {
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };
    return (React.createElement(PositioningPortal, Object.assign({}, restProps, { isOpen: isOpen, onShouldClose: close }), renderProps$1(children, {
        open,
        close,
        isOpen
    })));
};

exports.PositioningPortal = PositioningPortal;
exports.PositioningPortalWithState = PositioningPortalWithState;
