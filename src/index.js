"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var react_native_1 = require("react-native");
var AutoScrolling = function (_a) {
    var style = _a.style, children = _a.children, _b = _a.endPaddingWidth, endPaddingWidth = _b === void 0 ? 100 : _b, duration = _a.duration, _c = _a.delay, delay = _c === void 0 ? 0 : _c;
    var containerWidth = React.useRef(0);
    var contentWidth = React.useRef(0);
    var _d = React.useState(false), isAutoScrolling = _d[0], setIsAutoScrolling = _d[1];
    var _e = React.useState(endPaddingWidth), dividerWidth = _e[0], setDividerWidth = _e[1];
    var offsetX = React.useRef(new react_native_1.Animated.Value(0));
    var contentRef;
    function measureContainerView(event) {
        var newContainerWidth = event.nativeEvent.layout.width;
        if (containerWidth.current === newContainerWidth)
            return;
        containerWidth.current = newContainerWidth;
        if (!contentRef)
            return;
        contentRef.measure(function (fx, fy, width) {
            checkContent(width, fx);
        });
    }
    function checkContent(newContentWidth, fx) {
        if (!newContentWidth) {
            setIsAutoScrolling(false);
            return;
        }
        if (contentWidth.current === newContentWidth)
            return;
        contentWidth.current = newContentWidth;
        var newDividerWidth = endPaddingWidth;
        if (contentWidth.current < containerWidth.current) {
            if (endPaddingWidth < containerWidth.current - contentWidth.current) {
                newDividerWidth = containerWidth.current - contentWidth.current;
            }
        }
        setDividerWidth(newDividerWidth);
        setIsAutoScrolling(true);
        react_native_1.Animated.loop(react_native_1.Animated.timing(offsetX.current, {
            toValue: -(contentWidth.current + fx + newDividerWidth),
            duration: duration || 50 * contentWidth.current,
            delay: delay,
            easing: react_native_1.Easing.linear,
            useNativeDriver: true
        })).start();
    }
    function measureContentView(event) {
        var _a = event.nativeEvent.layout, width = _a.width, x = _a.x;
        if (!containerWidth.current || width === contentWidth.current)
            return;
        offsetX.current.stopAnimation();
        offsetX.current.setValue(0);
        offsetX.current.setOffset(0);
        checkContent(width, x);
    }
    var childrenProps = children.props;
    var childrenWithProps = React.cloneElement(children, __assign(__assign({}, childrenProps), { onLayout: measureContentView, ref: function (ref) { return (contentRef = ref); } }));
    return (<react_native_1.View onLayout={measureContainerView} style={style}>
      <react_native_1.ScrollView horizontal={true} bounces={false} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
        <react_native_1.Animated.View style={{
        flexDirection: "row",
        transform: [{ translateX: offsetX.current }]
    }}>
          {childrenWithProps}
          {isAutoScrolling && <react_native_1.View style={{ width: dividerWidth }}/>}
          {isAutoScrolling && children}
        </react_native_1.Animated.View>
      </react_native_1.ScrollView>
    </react_native_1.View>);
};
exports["default"] = React.memo(AutoScrolling);
