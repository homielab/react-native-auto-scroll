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
  vertical: boolean;
}

const AutoScrolling = ({
  style,
  children,
  endPaddingWidth = 100,
  duration,
  delay = 0,
  isLTR = false,
  vertical = false,
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
    const newContainerSize = vertical ? event.nativeEvent.layout.height : event.nativeEvent.layout.width;
    if (vertical ? containerHeight.current === newContainerSize : containerWidth.current === newContainerSize) return;

    containerWidth.current = newContainerSize;
    containerHeight.current = newContainerSize;
    if (!contentRef.current) return;
    contentRef.current.measure((fx: number, fy: number, width: number, height: number) => {
      vertical ? checkContent(height, fy) : checkContent(width, fx);
    });
  }

  function checkContent(newContentSize: number, fx: number) {
    if (!newContentSize) {
      setIsAutoScrolling(false);
      return;
    }

    if (vertical ? contentHeight.current === newContentSize : contentWidth.current === newContentSize) return;
    contentWidth.current = newContentSize;
    contentHeight.current = newContentSize;

    let newDividerSize = endPaddingWidth;
    if (vertical ? contentHeight.current < containerHeight.current : contentWidth.current < containerWidth.current) {
      if (vertical ? endPaddingWidth < containerHeight.current - contentHeight.current : endPaddingWidth < containerWidth.current - contentWidth.current) {
        newDividerSize = vertical ? containerHeight.current - contentHeight.current : containerWidth.current - contentWidth.current;
      }
    }
    vertical ? setDividerHeight(newDividerSize) : setDividerWidth(newDividerSize);
    setIsAutoScrolling(true);

    if (isLTR) {
      if (vertical) {
        offsetY.current.setValue(-(newContentSize + newDividerSize));
      }
      else {
        offsetX.current.setValue(-(newContentSize + newDividerSize));
      }
    }
    Animated.loop(
      vertical ? Animated.timing(offsetY.current, {
        toValue: isLTR ? fx : -(contentHeight.current + fx + newDividerSize),
        duration: duration || 50 * contentHeight.current,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }) :

        Animated.timing(offsetX.current, {
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
    if (!vertical) {
      if (!containerWidth.current || width === contentWidth.current)
        return;
      offsetX.current.stopAnimation();
      offsetX.current.setValue(0);
      offsetX.current.setOffset(0);
      checkContent(width, x);

    }
    else {

      if (!containerHeight.current || height === contentHeight.current)
        return;
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
              flexDirection: vertical ? 'column' : 'row',
              transform: vertical ? [{ translateY: offsetY.current }] : [{ translateX: offsetX.current }],
            }}
          >
            {isAutoScrolling && children}
            {isAutoScrolling && <View style={vertical ? { height: dividerHeight } : { width: dividerWidth }} />}
            {childrenWithProps}
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              flexDirection: vertical ? 'column' : 'row',
              transform: vertical ? [{ translateY: offsetY.current }] : [{ translateX: offsetX.current }],
            }}
          >
            {childrenWithProps}
            {isAutoScrolling && <View style={vertical ? { height: dividerHeight } : { width: dividerWidth }} />}
            {isAutoScrolling && children}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default AutoScrolling;
