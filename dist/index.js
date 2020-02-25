(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-native')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-native'], factory) :
    (global = global || self, global['react-native-auto-scrolling'] = factory(global.React, global.ReactNative));
}(this, (function (React, reactNative) { 'use strict';

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
            delay = _c === void 0 ? 0 : _c;
        var containerWidth = React.useRef(0);
        var contentWidth = React.useRef(0);
        var _d = React.useState(false),
            isAutoScrolling = _d[0],
            setIsAutoScrolling = _d[1];
        var _e = React.useState(endPaddingWidth),
            dividerWidth = _e[0],
            setDividerWidth = _e[1];
        var offsetX = React.useRef(new reactNative.Animated.Value(0));
        var contentRef;
        function measureContainerView(event) {
            var newContainerWidth = event.nativeEvent.layout.width;
            if (containerWidth.current === newContainerWidth) return;
            containerWidth.current = newContainerWidth;
            if (!contentRef) return;
            contentRef.measure(function (fx, fy, width) {
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
            reactNative.Animated.loop(reactNative.Animated.timing(offsetX.current, {
                toValue: -(contentWidth.current + fx + newDividerWidth),
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
                return contentRef = ref;
            } }));
        return React.createElement(reactNative.View, { onLayout: measureContainerView, style: style }, React.createElement(reactNative.ScrollView, { horizontal: true, bounces: false, scrollEnabled: false, showsHorizontalScrollIndicator: false }, React.createElement(reactNative.Animated.View, { style: {
                flexDirection: "row",
                transform: [{ translateX: offsetX.current }]
            } }, childrenWithProps, isAutoScrolling && React.createElement(reactNative.View, { style: { width: dividerWidth } }), isAutoScrolling && children)));
    };
    var index = React.memo(AutoScrolling);

    return index;

})));
//# sourceMappingURL=index.js.map
