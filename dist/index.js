(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-native')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-native'], factory) :
    (global['react-native-auto-scrolling'] = factory(global.React,global.ReactNative));
}(this, (function (React,reactNative) { 'use strict';

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
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

    var AutoScrolling = /** @class */ (function (_super) {
        __extends(AutoScrolling, _super);
        function AutoScrolling(props) {
            var _this = _super.call(this, props) || this;
            _this.offsetX = new reactNative.Animated.Value(0);
            _this.maxOffsetX = 0;
            _this.duration = 0;
            _this.delay = 1000;
            var duration = props.duration, delay = props.delay, endPaddingWidth = props.endPaddingWidth;
            if (typeof duration === "number")
                _this.duration = duration;
            if (typeof delay === "number")
                _this.delay = delay;
            _this.state = {
                endPaddingWidth: typeof endPaddingWidth === "number" ? endPaddingWidth : 100
            };
            _this.run = _this.run.bind(_this);
            _this.measureContainerView = _this.measureContainerView.bind(_this);
            return _this;
        }
        AutoScrolling.prototype.run = function () {
            reactNative.Animated.loop(reactNative.Animated.timing(this.offsetX, {
                toValue: this.maxOffsetX,
                duration: this.duration,
                delay: this.delay,
                easing: reactNative.Easing.linear,
                useNativeDriver: true
            })).start();
        };
        AutoScrolling.prototype.measureContainerView = function (event) {
            var _this = this;
            if (this.maxOffsetX !== 0)
                return;
            var containerWidth = event.nativeEvent.layout.width;
            this.childComponentRef.measure(function (fx, fy, width) {
                var componentWidth = width;
                var endPaddingWidth = _this.state.endPaddingWidth;
                if (componentWidth <= containerWidth) {
                    endPaddingWidth = containerWidth - componentWidth;
                    _this.setState({
                        endPaddingWidth: endPaddingWidth
                    });
                }
                _this.maxOffsetX = -1 * (componentWidth + endPaddingWidth + fx);
                if (!_this.duration)
                    _this.duration = componentWidth * 20;
                _this.run();
            });
        };
        AutoScrolling.prototype.render = function () {
            var _this = this;
            var _a = this.props, children = _a.children, style = _a.style;
            var endPaddingWidth = this.state.endPaddingWidth;
            var childrenProps = children.props;
            var childrenWithProps = React.cloneElement(children, __assign({}, childrenProps, { style: [childrenProps.style, { marginRight: endPaddingWidth }], ref: function (ref) { return (_this.childComponentRef = ref); } }));
            return (React.createElement(reactNative.View, { style: style },
                React.createElement(reactNative.ScrollView, { horizontal: true, bounces: false, scrollEnabled: false, onLayout: this.measureContainerView },
                    React.createElement(reactNative.Animated.View, { style: [
                            styles.row,
                            {
                                transform: [
                                    {
                                        translateX: this.offsetX
                                    }
                                ]
                            }
                        ] },
                        childrenWithProps,
                        children))));
        };
        return AutoScrolling;
    }(React.PureComponent));
    var styles = reactNative.StyleSheet.create({
        row: {
            flexDirection: "row"
        }
    });

    return AutoScrolling;

})));
