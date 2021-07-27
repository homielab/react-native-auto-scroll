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
}

const AutoScrolling = ({
  style,
  children,
  endPaddingWidth = 100,
  duration,
  delay = 0,
  isLTR = false,
}: Props) => {
  const containerWidth = React.useRef(0);
  const contentWidth = React.useRef(0);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [dividerWidth, setDividerWidth] = React.useState(endPaddingWidth);
  const offsetX = React.useRef(new Animated.Value(0));
  const contentRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Clean up to avoid calling measureContainerView after unmount.
    return () => {
      contentRef.current = null;
    };
  });

  function measureContainerView(event: LayoutChangeEvent) {
    const newContainerWidth = event.nativeEvent.layout.width;
    if (containerWidth.current === newContainerWidth) return;
    containerWidth.current = newContainerWidth;
    if (!contentRef.current) return;
    contentRef.current.measure((fx: number, fy: number, width: number) => {
      checkContent(width, fx);
    });
  }

  function checkContent(newContentWidth: number, fx: number) {
    if (!newContentWidth) {
      setIsAutoScrolling(false);
      return;
    }

    if (contentWidth.current === newContentWidth) return;
    contentWidth.current = newContentWidth;
    let newDividerWidth = endPaddingWidth;
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
    Animated.loop(
      Animated.timing(offsetX.current, {
        toValue: isLTR ? fx : -(contentWidth.current + fx + newDividerWidth),
        duration: duration || 50 * contentWidth.current,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  function measureContentView(event: LayoutChangeEvent) {
    const { width, x } = event.nativeEvent.layout;
    if (!containerWidth.current || width === contentWidth.current) return;
    offsetX.current.stopAnimation();
    offsetX.current.setValue(0);
    offsetX.current.setOffset(0);
    checkContent(width, x);
  }

  const childrenProps = children.props;
  const childrenWithProps = React.cloneElement(children, {
    ...childrenProps,
    onLayout: measureContentView,
    ref: (ref: any) => (contentRef.current = ref),
  });

  return (
    <View onLayout={measureContainerView} style={style}>
      <ScrollView
        horizontal={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {isLTR ? (
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [{ translateX: offsetX.current }],
            }}
          >
            {isAutoScrolling && children}
            {isAutoScrolling && <View style={{ width: dividerWidth }} />}
            {childrenWithProps}
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [{ translateX: offsetX.current }],
            }}
          >
            {childrenWithProps}
            {isAutoScrolling && <View style={{ width: dividerWidth }} />}
            {isAutoScrolling && children}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default AutoScrolling;
