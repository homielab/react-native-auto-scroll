import * as React from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";

interface Props {
  children: React.ReactElement<any>;
  style?: StyleProp<ViewStyle>;
  endPaddingWidth?: number;
  duration?: number;
  delay?: number;
  isLTR?: boolean;
  isVertical: boolean;
}

const AutoScrolling = ({
  style,
  children,
  endPaddingWidth = 100,
  duration,
  delay = 0,
  isLTR = false,
  isVertical = false,
}: Props) => {
  const containerWidth = React.useRef(0);
  const contentWidth = React.useRef(0);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [dividerWidth, setDividerWidth] = React.useState(endPaddingWidth);
  const offsetX = React.useRef(new Animated.Value(0));
  const contentRef = React.useRef<any>(null);
  const containerHeight = React.useRef(0);
  const contentHeight = React.useRef(0);
  const [dividerHeight, setDividerHeight] = React.useState(endPaddingWidth);
  const offsetY = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    // Clean up to avoid calling measureContainerView after unmount.
    return () => {
      contentRef.current = null;
    };
  });

  function measureContainerView(event: LayoutChangeEvent) {
    const newContainerSize = isVertical
      ? event.nativeEvent.layout.height
      : event.nativeEvent.layout.width;
    if (
      isVertical
        ? containerHeight.current === newContainerSize
        : containerWidth.current === newContainerSize
    )
      return;

    containerWidth.current = newContainerSize;
    containerHeight.current = newContainerSize;
    if (!contentRef.current) return;
    contentRef.current.measure(
      (fx: number, fy: number, width: number, height: number) => {
        isVertical ? checkContent(height, fy) : checkContent(width, fx);
      }
    );
  }

  function checkContent(newContentSize: number, fx: number) {
    if (!newContentSize) {
      setIsAutoScrolling(false);
      return;
    }

    if (
      isVertical
        ? contentHeight.current === newContentSize
        : contentWidth.current === newContentSize
    )
      return;
    contentWidth.current = newContentSize;
    contentHeight.current = newContentSize;

    let newDividerSize = endPaddingWidth;
    if (
      isVertical
        ? contentHeight.current < containerHeight.current
        : contentWidth.current < containerWidth.current
    ) {
      if (
        isVertical
          ? endPaddingWidth < containerHeight.current - contentHeight.current
          : endPaddingWidth < containerWidth.current - contentWidth.current
      ) {
        newDividerSize = isVertical
          ? containerHeight.current - contentHeight.current
          : containerWidth.current - contentWidth.current;
      }
    }
    isVertical
      ? setDividerHeight(newDividerSize)
      : setDividerWidth(newDividerSize);
    setIsAutoScrolling(true);

    if (isLTR) {
      if (isVertical) {
        offsetY.current.setValue(-(newContentSize + newDividerSize));
      } else {
        offsetX.current.setValue(-(newContentSize + newDividerSize));
      }
    }
    Animated.loop(
      isVertical
        ? Animated.timing(offsetY.current, {
            toValue: isLTR
              ? fx
              : -(contentHeight.current + fx + newDividerSize),
            duration: duration || 50 * contentHeight.current,
            delay,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        : Animated.timing(offsetX.current, {
            toValue: isLTR ? fx : -(contentWidth.current + fx + newDividerSize),
            duration: duration || 50 * contentWidth.current,
            delay,
            easing: Easing.linear,
            useNativeDriver: true,
          })
    ).start();
  }

  function measureContentView(event: LayoutChangeEvent) {
    const { width, x, y, height } = event.nativeEvent.layout;
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

  const childrenProps = children.props;
  const childrenWithProps = React.cloneElement(children, {
    ...childrenProps,
    onLayout: measureContentView,
    ref: (ref: any) => (contentRef.current = ref),
  });

  const animatedViewStyle = isVertical
    ? {
        flexDirection: "column",
        transform: [{ translateY: offsetY.current }],
      }
    : {
        flexDirection: "row",
        transform: [{ translateX: offsetX.current }],
      };

  const viewStyle = isVertical
    ? { height: dividerHeight }
    : { width: dividerWidth };

  return (
    <View onLayout={measureContainerView} style={style}>
      <ScrollView
        horizontal={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {isLTR ? (
          <Animated.View style={animatedViewStyle}>
            {isAutoScrolling && children}
            {isAutoScrolling && <View style={viewStyle} />}
            {childrenWithProps}
          </Animated.View>
        ) : (
          <Animated.View style={animatedViewStyle}>
            {childrenWithProps}
            {isAutoScrolling && <View style={viewStyle} />}
            {isAutoScrolling && children}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default AutoScrolling;
