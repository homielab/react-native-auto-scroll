import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

interface AutoScrollProps {
  children: React.ReactElement<ViewProps & { ref?: React.Ref<View> }>;
  style?: StyleProp<ViewStyle>;
  endPaddingWidth?: number;
  duration?: number;
  delay?: number;
  isLTR?: boolean; // default is false, which means RTL
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const DEFAULT_END_PADDING_WIDTH = 100;
const DEFAULT_DELAY = 0;
const MIN_SCROLL_DURATION = 3000;
const SCROLL_SPEED_FACTOR = 50;

const AutoScroll: React.FC<AutoScrollProps> = ({
  style,
  children,
  endPaddingWidth = DEFAULT_END_PADDING_WIDTH,
  duration,
  delay = DEFAULT_DELAY,
  isLTR = false,
}) => {
  // Refs
  const isMountedRef = useRef(true);
  const containerWidthRef = useRef(0);
  const contentWidthRef = useRef(0);
  const offsetXRef = useRef(new Animated.Value(0));
  const contentRef = useRef<View | null>(null);

  // States
  const [dividerWidth, setDividerWidth] = useState(endPaddingWidth);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleContentLayout = useCallback(
    (newContentWidth: number, fx: number) => {
      if (!newContentWidth) {
        setIsAutoScrollEnabled(false);
        return;
      }

      if (contentWidthRef.current === newContentWidth) return;
      contentWidthRef.current = newContentWidth;

      // Calculate divider width
      let newDividerWidth = endPaddingWidth;
      if (contentWidthRef.current < containerWidthRef.current) {
        if (
          endPaddingWidth <
          containerWidthRef.current - contentWidthRef.current
        ) {
          newDividerWidth = containerWidthRef.current - contentWidthRef.current;
        }
      }
      setDividerWidth(newDividerWidth);
      setIsAutoScrollEnabled(true);

      // Compute scroll range
      const checkPoint = -(contentWidthRef.current + fx + newDividerWidth);
      const startValue = isLTR ? checkPoint : fx;
      const endValue = isLTR ? fx : checkPoint;
      offsetXRef.current.setValue(startValue);

      // Calculate duration based on distance and speed
      const scrollDuration =
        duration ||
        Math.max(
          MIN_SCROLL_DURATION,
          SCROLL_SPEED_FACTOR * contentWidthRef.current
        );

      // Recursive scroll function for smooth looping
      const scroll = (inital = true) => {
        if (!isMountedRef.current) return;
        Animated.timing(offsetXRef.current, {
          toValue: endValue,
          duration: scrollDuration,
          delay: inital ? delay : 0,
          easing: Easing.linear,
          useNativeDriver: USE_NATIVE_DRIVER,
        }).start(({ finished }) => {
          if (!isMountedRef.current || !finished) return;
          offsetXRef.current.setValue(startValue);
          scroll(false);
        });
      };

      scroll(true);
    },
    [endPaddingWidth, isLTR, duration, delay]
  );

  const setContentRef = useCallback((ref: View | null) => {
    contentRef.current = ref;
  }, []);

  const handleChildrenLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      if (
        !containerWidthRef.current ||
        layout.width === contentWidthRef.current
      )
        return;
      handleContentLayout(layout.width, layout.x);
    },
    [handleContentLayout]
  );

  const handleContainerLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      if (containerWidthRef.current === layout.width) return;
      containerWidthRef.current = layout.width;
      contentRef.current?.measure((fx: number, _fy: number, width: number) => {
        handleContentLayout(width, fx);
      });
    },
    [handleContentLayout]
  );

  const childrenCloned = useMemo(
    () =>
      React.cloneElement(children, {
        ...children.props,
        onLayout: handleChildrenLayout,
        ref: setContentRef,
      }),
    [children, handleChildrenLayout, setContentRef]
  );

  const animatedStyle = useMemo(
    () => ({
      transform: [{ translateX: offsetXRef.current }],
    }),
    []
  );

  return (
    <View onLayout={handleContainerLayout} style={style}>
      <ScrollView
        horizontal
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <View>{childrenCloned}</View>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default memo(AutoScroll);
