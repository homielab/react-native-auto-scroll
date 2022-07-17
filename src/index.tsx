import * as React from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
    Platform,
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
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = React.useState(false);
  const [dividerWidth, setDividerWidth] = React.useState(endPaddingWidth);
  const containerWidth = React.useRef(0);
  const contentWidth = React.useRef(0);
  const offsetX = React.useRef(new Animated.Value(0));
  const contentRef = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      contentRef.current = null;
    };
  });

  const measureContainerView = React.useCallback(
    ({
      nativeEvent: {
        layout: { width },
      },
    }: LayoutChangeEvent) => {
      if (containerWidth.current === width) return;
      containerWidth.current = width;
      if (!contentRef.current) return;
      contentRef.current.measure((fx: number, _fy: number, width: number) => {
        checkContent(width, fx);
      });
    },
    []
  );

  const checkContent = React.useCallback(
    (newContentWidth: number, fx: number) => {
      if (!newContentWidth) {
        setIsAutoScrollEnabled(false);
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
      setIsAutoScrollEnabled(true);

      if (isLTR) {
        offsetX.current.setValue(-(newContentWidth + newDividerWidth));
      }
      Animated.loop(
        Animated.timing(offsetX.current, {
          toValue: isLTR ? fx : -(contentWidth.current + fx + newDividerWidth),
          duration: duration || 50 * contentWidth.current,
          delay,
          easing: Easing.linear,
          useNativeDriver: Platform.os === "web" ? false : true,
        })
      ).start();
    },
    []
  );

  const childrenCloned = React.useMemo(
    () =>
      React.cloneElement(children, {
        ...children.props,
        onLayout: ({
          nativeEvent: {
            layout: { width, x },
          },
        }: LayoutChangeEvent) => {
          if (!containerWidth.current || width === contentWidth.current) return;
          offsetX.current.stopAnimation();
          offsetX.current.setValue(0);
          offsetX.current.setOffset(0);
          checkContent(width, x);
        },
        ref: (ref: any) => (contentRef.current = ref),
      }),
    [children]
  );

  return (
    <View onLayout={measureContainerView} style={style}>
      <ScrollView
        horizontal={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <Animated.View
          style={[
            { flexDirection: "row" },
            { transform: [{ translateX: offsetX.current }] },
          ]}
        >
          {childrenCloned}
          {isAutoScrollEnabled && (
            <>
              <View style={{ width: dividerWidth }} />
              {children}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default React.memo(AutoScrolling);
