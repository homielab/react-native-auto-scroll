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
            isLTR = _d === void 0 ? false : _d;
        var containerWidth = React.useRef(0);
        var contentWidth = React.useRef(0);
        var _e = React.useState(false),
            isAutoScrolling = _e[0],
            setIsAutoScrolling = _e[1];
        var _f = React.useState(endPaddingWidth),
            dividerWidth = _f[0],
            setDividerWidth = _f[1];
        var offsetX = React.useRef(new reactNative.Animated.Value(0));
        var contentRef = React.useRef(null);
        React.useEffect(function () {
            // Clean up to avoid calling measureContainerView after unmount.
            return function () {
                contentRef.current = null;
            };
        });
        function measureContainerView(event) {
            var newContainerWidth = event.nativeEvent.layout.width;
            if (containerWidth.current === newContainerWidth) return;
            containerWidth.current = newContainerWidth;
            if (!contentRef.current) return;
            contentRef.current.measure(function (fx, fy, width) {
                checkContent(width, fx);
            });
        }
        function checkContent(newContentWidth, fx) {
            if (!newContentWidth) {
                setIsAutoScrolling(false);
                return;
            }
            if (contentWidth.current === newContentWidth) return;
            contentWidth.current = newContentWidth;
            var newDividerWidth = endPaddingWidth;
            if (contentWidth.current < containerWidth.current) {
                if (endPaddingWidth < containerWidth.current - contentWidth.current) {
                    newDividerWidth = containerWidth.current - contentWidth.current;
                }
            }
            setDividerWidth(newDividerWidth);
            setIsAutoScrolling(true);
            if (isLTR) {
                offsetX.current.setValue(-(newContentWidth + newDividerWidth));
            }
            reactNative.Animated.loop(reactNative.Animated.timing(offsetX.current, {
                toValue: isLTR ? fx : -(contentWidth.current + fx + newDividerWidth),
                duration: duration || 50 * contentWidth.current,
                delay: delay,
                easing: reactNative.Easing.linear,
                useNativeDriver: true
            })).start();
        }
        function measureContentView(event) {
            var _a = event.nativeEvent.layout,
                width = _a.width,
                x = _a.x;
            if (!containerWidth.current || width === contentWidth.current) return;
            offsetX.current.stopAnimation();
            offsetX.current.setValue(0);
            offsetX.current.setOffset(0);
            checkContent(width, x);
        }
        var childrenProps = children.props;
        var childrenWithProps = React.cloneElement(children, __assign(__assign({}, childrenProps), { onLayout: measureContentView, ref: function (ref) {
                return contentRef.current = ref;
            } }));
        return React.createElement(reactNative.View, { onLayout: measureContainerView, style: style }, React.createElement(reactNative.ScrollView, { horizontal: true, bounces: false, scrollEnabled: false, showsHorizontalScrollIndicator: false }, isLTR ? React.createElement(reactNative.Animated.View, { style: {
                flexDirection: "row",
                transform: [{ translateX: offsetX.current }]
            } }, isAutoScrolling && children, isAutoScrolling && React.createElement(reactNative.View, { style: { width: dividerWidth } }), childrenWithProps) : React.createElement(reactNative.Animated.View, { style: {
                flexDirection: "row",
                transform: [{ translateX: offsetX.current }]
            } }, childrenWithProps, isAutoScrolling && React.createElement(reactNative.View, { style: { width: dividerWidth } }), isAutoScrolling && children)));
    };

    return AutoScrolling;

})));
