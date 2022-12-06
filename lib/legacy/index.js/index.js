'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
var ReactDOM__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var DEFAULT_SCROLL_PARENT = 'BODY';
function isScrollParent(element) {
    try {
        var _a = getComputedStyle(element), overflow = _a.overflow, overflowY = _a.overflowY, overflowX = _a.overflowX;
        return /(auto|scroll)/.test(overflow + overflowX + overflowY);
    }
    catch (e) {
        return false;
    }
}
function getScrollParents(element, scrollParents) {
    if (scrollParents === void 0) { scrollParents = []; }
    if (!element || element.tagName === DEFAULT_SCROLL_PARENT) {
        return __spreadArray(__spreadArray([], scrollParents, true), [window], false);
    }
    return getScrollParents(element.parentElement, isScrollParent(element) ? __spreadArray(__spreadArray([], scrollParents, true), [element], false) : scrollParents);
}

var noop = (function () {
    /** */
});

var Position;
(function (Position) {
    Position["ABOVE_LEFT"] = "ABOVE_LEFT";
    Position["ABOVE_RIGHT"] = "ABOVE_RIGHT";
    Position["BELOW_LEFT"] = "BELOW_LEFT";
    Position["BELOW_RIGHT"] = "BELOW_RIGHT";
})(Position || (Position = {}));
var renderProps$1 = function (element, props) {
    return typeof element === 'function' ? element(props) : element;
};
var defaultPositionStrategy = function (parentRect, portalRect
/* props: Props<Position> */
) {
    // Open the content portal above the child if there is not enough space to the bottom,
    // but if there also isn't enough space at the top, open to the bottom.
    var openAbove = parentRect.top + parentRect.height + portalRect.height >
        (window.document.documentElement || window.document.body).clientHeight &&
        parentRect.top - portalRect.height > 0;
    var top = openAbove
        ? parentRect.top - portalRect.height + window.scrollY
        : parentRect.top + parentRect.height + window.scrollY;
    // Open the content portal to the left if there is not enough space at the right,
    // but if there also isn't enough space at the right, open to the left.
    var alignRight = parentRect.left + portalRect.width >
        (window.document.documentElement || window.document.body).clientWidth &&
        parentRect.left - portalRect.width > 0;
    var left = !alignRight
        ? parentRect.left + window.scrollX
        : window.scrollX + parentRect.left - portalRect.width + parentRect.width;
    var strategy = Position.BELOW_RIGHT;
    if (openAbove && alignRight) {
        strategy = Position.ABOVE_LEFT;
    }
    if (openAbove && !alignRight) {
        strategy = Position.ABOVE_RIGHT;
    }
    if (!openAbove && alignRight) {
        strategy = Position.BELOW_LEFT;
    }
    if (!openAbove && !alignRight) {
        strategy = Position.BELOW_RIGHT;
    }
    return {
        top: top,
        left: left,
        strategy: strategy,
    };
};
var KEYCODES = {
    ESCAPE: 27,
};
var EVENT_CONTEXT_KEY = 'PositioningPortal-context';
var PositioningPortal = /** @class */ (function (_super) {
    __extends(PositioningPortal, _super);
    function PositioningPortal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            top: null,
            left: null,
            portalRect: null,
            parentRect: null,
            isPositioned: false,
            isOpen: false,
            transitionActive: false,
            shouldRender: false,
            scrollParents: [],
            strategy: null,
        };
        _this.portalRef = React__namespace.createRef();
        _this.close = function () {
            if (_this.props.onShouldClose) {
                _this.props.onShouldClose();
            }
        };
        _this.transitionStarted = function () {
            _this.setState({ transitionActive: true });
        };
        _this.transitionEnded = function () {
            _this.setState({ transitionActive: false });
        };
        _this.handleOutsideMouseClick = function (event) {
            if (!_this.props.closeOnOutsideClick) {
                return;
            }
            if (!_this.state.isOpen) {
                return;
            }
            if (_this.portalRef.current &&
                _this.portalRef.current.contains(event.target)) {
                return;
            }
            if ((event[EVENT_CONTEXT_KEY] || []).includes(_this)) {
                return;
            }
            var parentDom = ReactDOM__namespace.findDOMNode(_this);
            if (parentDom && parentDom.contains(event.target)) {
                return;
            }
            _this.close();
        };
        _this.handleKeydown = function (event) {
            if (_this.state.isOpen &&
                _this.props.closeOnKeyDown &&
                _this.props.closeOnKeyDown(event)) {
                _this.close();
            }
        };
        _this.onOpen = function () {
            if (!_this.state.isOpen) {
                // 1) Prerender portal to get stable portal rect.
                _this.preRenderPortal()
                    // 2) Position portal with positioning strategy and trigger final render
                    .then(_this.finalRenderPortal)
                    // 3) Communicate that portal has opened
                    .then(function () {
                    _this.props.onOpen();
                });
            }
        };
        _this.onClose = function () {
            if (!_this.state.isOpen) {
                return;
            }
            // Remove scroll event listeners
            _this.state.scrollParents.forEach(function (node) {
                return node.removeEventListener('scroll', _this.close, false);
            });
            _this.setState({
                isOpen: false,
                scrollParents: [],
            });
            _this.props.onClose();
        };
        _this.markClickEvent = function (event) {
            event.nativeEvent[EVENT_CONTEXT_KEY] = __spreadArray(__spreadArray([], (event.nativeEvent[EVENT_CONTEXT_KEY] || []), true), [
                _this,
            ], false);
        };
        _this.preRenderPortal = function () {
            return new Promise(function (resolve) {
                // A tricky way to get the first child DOM element of the fragment of this component.
                // Unfortunately there seems to be no way to achieve this with refs.
                var parentDom = ReactDOM__namespace.findDOMNode(_this);
                if (parentDom && parentDom.nodeType === Node.ELEMENT_NODE) {
                    var parentRect = parentDom.getBoundingClientRect();
                    var scrollParents = [];
                    // Register scroll listener on all scrollable parents to close the portal on scroll
                    scrollParents = getScrollParents(parentDom);
                    scrollParents.forEach(function (node) {
                        return node.addEventListener('scroll', _this.close, false);
                    });
                    _this.setState({
                        isOpen: true,
                        transitionActive: false,
                        isPositioned: false,
                        left: 0,
                        top: 0,
                        strategy: null,
                        parentRect: parentRect,
                        portalRect: null,
                        scrollParents: scrollParents,
                    }, resolve);
                }
                else {
                    resolve();
                }
            });
        };
        _this.finalRenderPortal = function () {
            return new Promise(function (resolve) {
                if (_this.state.isOpen &&
                    !_this.state.isPositioned &&
                    _this.portalRef.current &&
                    _this.state.parentRect) {
                    var portalRect = _this.portalRef.current.getBoundingClientRect();
                    var _a = _this.props.positionStrategy(_this.state.parentRect, portalRect, _this.props), top_1 = _a.top, left = _a.left, strategy = _a.strategy;
                    _this.setState({
                        isPositioned: true,
                        left: left,
                        strategy: strategy,
                        top: top_1,
                        portalRect: portalRect,
                    }, resolve);
                }
                else {
                    resolve();
                }
            });
        };
        return _this;
    }
    PositioningPortal.prototype.componentDidMount = function () {
        window.document.addEventListener('keydown', this.handleKeydown, false);
        window.document.addEventListener('click', this.handleOutsideMouseClick, false);
        // Do not render on server side.
        this.setState({ shouldRender: true });
        if (this.props.isOpen) {
            this.onOpen();
        }
    };
    PositioningPortal.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.isOpen !== prevProps.isOpen) {
            if (this.props.isOpen) {
                this.onOpen();
            }
            else {
                this.onClose();
            }
        }
    };
    PositioningPortal.prototype.componentWillUnmount = function () {
        var _this = this;
        window.document.removeEventListener('keydown', this.handleKeydown, false);
        window.document.removeEventListener('click', this.handleOutsideMouseClick, false);
        // Remove scroll event listeners
        this.state.scrollParents.forEach(function (node) {
            return node.removeEventListener('scroll', _this.close, false);
        });
    };
    PositioningPortal.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, portalContent = _a.portalContent, portalElement = _a.portalElement, rootNode = _a.rootNode;
        var _b = this.state, top = _b.top, left = _b.left, parentRect = _b.parentRect, portalRect = _b.portalRect, isPositioned = _b.isPositioned, isOpen = _b.isOpen, strategy = _b.strategy, transitionActive = _b.transitionActive, shouldRender = _b.shouldRender;
        var relatedWidth = parentRect ? parentRect.width : 0;
        var relatedHeight = parentRect ? parentRect.height : 0;
        var portalStyle = {
            position: 'absolute',
            width: portalRect ? "".concat(portalRect.width, "px") : 'auto',
            left: "".concat(left, "px"),
            top: "".concat(top, "px"),
            visibility: isPositioned ? 'visible' : 'hidden',
        };
        var renderPortal = function () {
            return ReactDOM__namespace.createPortal(React__namespace.cloneElement(portalElement || React__namespace.createElement("div", null), {
                ref: _this.portalRef,
                style: __assign(__assign({}, portalStyle), ((portalElement && portalElement.props.style) || {})),
                onClick: _this.markClickEvent,
            }, renderProps$1(portalContent, {
                close: _this.close,
                transitionStarted: _this.transitionStarted,
                transitionEnded: _this.transitionEnded,
                strategy: strategy,
                isOpen: isOpen,
                isPositioned: isPositioned,
                relatedWidth: relatedWidth,
                relatedHeight: relatedHeight,
            })), rootNode || window.document.body);
        };
        var shouldRenderPortal = shouldRender && (isOpen || transitionActive);
        return (React__namespace.createElement(React__namespace.Fragment, null,
            children,
            shouldRenderPortal && renderPortal()));
    };
    PositioningPortal.defaultProps = {
        isOpen: false,
        onOpen: noop,
        onClose: noop,
        onShouldClose: noop,
        closeOnOutsideClick: true,
        closeOnKeyDown: function (event) { return event.keyCode === KEYCODES.ESCAPE; },
        positionStrategy: defaultPositionStrategy,
    };
    return PositioningPortal;
}(React__namespace.Component));

function renderProps(element, props) {
    return typeof element === 'function' ? element(props) : element;
}
function PositioningPortalWithState(props) {
    var _a = React__namespace.useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var children = props.children, restProps = __rest(props, ["children"]);
    var open = function () {
        setIsOpen(true);
    };
    var close = function () {
        setIsOpen(false);
    };
    return (React__namespace.createElement(PositioningPortal, __assign({}, restProps, { isOpen: isOpen, onShouldClose: close }), renderProps(children, {
        open: open,
        close: close,
        isOpen: isOpen,
    })));
}

exports.PositioningPortal = PositioningPortal;
exports.PositioningPortalWithState = PositioningPortalWithState;
