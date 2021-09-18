(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-native')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-native'], factory) :
    (global = global || self, global['react-native-auto-scrolling'] = factory(global.React, global.ReactNative));
}(this, (function (React, reactNative) { 'use strict';

    /*! *****************************************************************************
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

    var AutoScrolling = function (_a) {
        var style = _a.style,
            children = _a.children,
            _b = _a.endPaddingWidth,
            endPaddingWidth = _b === void 0 ? 100 : _b,
            duration = _a.duration,
            _c = _a.delay,
            delay = _c === void 0 ? 0 : _c,
            _d = _a.isLTR,
            isLTR = _d === void 0 ? false : _d,
            _e = _a.isVertical,
            isVertical = _e === void 0 ? false : _e;
        var containerWidth = React.useRef(0);
        var contentWidth = React.useRef(0);
        var _f = React.useState(false),
            isAutoScrolling = _f[0],
            setIsAutoScrolling = _f[1];
        var _g = React.useState(endPaddingWidth),
            dividerWidth = _g[0],
            setDividerWidth = _g[1];
        var offsetX = React.useRef(new reactNative.Animated.Value(0));
        var contentRef = React.useRef(null);
        var containerHeight = React.useRef(0);
        var contentHeight = React.useRef(0);
        var _h = React.useState(endPaddingWidth),
            dividerHeight = _h[0],
            setDividerHeight = _h[1];
        var offsetY = React.useRef(new reactNative.Animated.Value(0));
        React.useEffect(function () {
            // Clean up to avoid calling measureContainerView after unmount.
            return function () {
                contentRef.current = null;
            };
        });
        function measureContainerView(event) {
            var newContainerSize = isVertical ? event.nativeEvent.layout.height : event.nativeEvent.layout.width;
            if (isVertical ? containerHeight.current === newContainerSize : containerWidth.current === newContainerSize) return;
            containerWidth.current = newContainerSize;
            containerHeight.current = newContainerSize;
            if (!contentRef.current) return;
            contentRef.current.measure(function (fx, fy, width, height) {
                isVertical ? checkContent(height, fy) : checkContent(width, fx);
            });
        }
        function checkContent(newContentSize, fx) {
            if (!newContentSize) {
                setIsAutoScrolling(false);
                return;
            }
            if (isVertical ? contentHeight.current === newContentSize : contentWidth.current === newContentSize) return;
            contentWidth.current = newContentSize;
            contentHeight.current = newContentSize;
            var newDividerSize = endPaddingWidth;
            if (isVertical ? contentHeight.current < containerHeight.current : contentWidth.current < containerWidth.current) {
                if (isVertical ? endPaddingWidth < containerHeight.current - contentHeight.current : endPaddingWidth < containerWidth.current - contentWidth.current) {
                    newDividerSize = isVertical ? containerHeight.current - contentHeight.current : containerWidth.current - contentWidth.current;
                }
            }
            isVertical ? setDividerHeight(newDividerSize) : setDividerWidth(newDividerSize);
            setIsAutoScrolling(true);
            if (isLTR) {
                if (isVertical) {
                    offsetY.current.setValue(-(newContentSize + newDividerSize));
                } else {
                    offsetX.current.setValue(-(newContentSize + newDividerSize));
                }
            }
            reactNative.Animated.loop(isVertical ? reactNative.Animated.timing(offsetY.current, {
                toValue: isLTR ? fx : -(contentHeight.current + fx + newDividerSize),
                duration: duration || 50 * contentHeight.current,
                delay: delay,
                easing: reactNative.Easing.linear,
                useNativeDriver: true
            }) : reactNative.Animated.timing(offsetX.current, {
                toValue: isLTR ? fx : -(contentWidth.current + fx + newDividerSize),
                duration: duration || 50 * contentWidth.current,
                delay: delay,
                easing: reactNative.Easing.linear,
                useNativeDriver: true
            })).start();
        }
        function measureContentView(event) {
            var _a = event.nativeEvent.layout,
                width = _a.width,
                x = _a.x,
                y = _a.y,
                height = _a.height;
            if (!isVertical) {
                if (!containerWidth.current || width === contentWidth.current) return;
                offsetX.current.stopAnimation();
                offsetX.current.setValue(0);
                offsetX.current.setOffset(0);
                checkContent(width, x);
            } else {
                if (!containerHeight.current || height === contentHeight.current) return;
                offsetY.current.stopAnimation();
                offsetY.current.setValue(0);
                offsetY.current.setOffset(0);
                checkContent(height, y);
            }
        }
        var childrenProps = children.props;
        var childrenWithProps = React.cloneElement(children, __assign(__assign({}, childrenProps), { onLayout: measureContentView, ref: function (ref) {
                return contentRef.current = ref;
            } }));
        var animatedViewStyle = isVertical ? {
            flexDirection: "column",
            transform: [{ translateY: offsetY.current }]
        } : {
            flexDirection: "row",
            transform: [{ translateX: offsetX.current }]
        };
        var viewStyle = isVertical ? { height: dividerHeight } : { width: dividerWidth };
        return React.createElement(reactNative.View, { onLayout: measureContainerView, style: style }, React.createElement(reactNative.ScrollView, { horizontal: true, bounces: false, scrollEnabled: false, showsHorizontalScrollIndicator: false }, isLTR ? React.createElement(reactNative.Animated.View, { style: animatedViewStyle }, isAutoScrolling && children, isAutoScrolling && React.createElement(reactNative.View, { style: viewStyle }), childrenWithProps) : React.createElement(reactNative.Animated.View, { style: animatedViewStyle }, childrenWithProps, isAutoScrolling && React.createElement(reactNative.View, { style: viewStyle }), isAutoScrolling && children)));
    };

    return AutoScrolling;

})));
