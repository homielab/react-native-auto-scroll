import React, {
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

interface AutoScrollingProps {
  children: React.ReactElement<ViewProps & { ref?: React.Ref<View> }>;
  style?: StyleProp<ViewStyle>;
  endPaddingWidth?: number;
  duration?: number;
  delay?: number;
  isLTR?: boolean; // default is false, which means RTL
}

const useNativeDriver = Platform.OS !== 'web';

const AutoScrolling: React.FC<AutoScrollingProps> = ({
  style,
  children,
  endPaddingWidth = 100,
  duration,
  delay = 0,
  isLTR = false,
}) => {
  const isMounted = useRef(true);
  const [dividerWidth, setDividerWidth] = useState(endPaddingWidth);
  const containerWidth = useRef(0);
  const contentWidth = useRef(0);
  const offsetX = useRef(new Animated.Value(0));
  const contentRef = useRef<View>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const checkContent = useCallback(
    (newContentWidth: number, fx: number) => {
      if (!newContentWidth) {
        setIsAutoScrollEnabled(false);
        return;
      }

      if (contentWidth.current === newContentWidth) return;
      contentWidth.current = newContentWidth;

      // Calculate divider width
      let newDividerWidth = endPaddingWidth;
      if (contentWidth.current < containerWidth.current) {
        if (endPaddingWidth < containerWidth.current - contentWidth.current) {
          newDividerWidth = containerWidth.current - contentWidth.current;
        }
      }
      setDividerWidth(newDividerWidth);
      setIsAutoScrollEnabled(true);

      // Compute scroll range
      const checkPoint = -(contentWidth.current + fx + newDividerWidth);
      const startValue = isLTR ? checkPoint : fx;
      const endValue = isLTR ? fx : checkPoint;
      offsetX.current.setValue(startValue);

      // Calculate duration based on distance and speed
      const scrollDuration =
        duration || Math.max(3000, 50 * contentWidth.current);

      // Recursive scroll function for smooth looping
      const scroll = (inital = true) => {
        if (!isMounted.current) return;
        Animated.timing(offsetX.current, {
          toValue: endValue,
          duration: scrollDuration,
          delay: inital ? delay : 0,
          easing: Easing.linear,
          useNativeDriver,
        }).start(() => {
          if (!isMounted.current) return;
          offsetX.current.setValue(startValue);
          scroll(false);
        });
      };

      scroll(true);
    },
    [endPaddingWidth, isLTR, duration, delay]
  );

  const childrenCloned = useMemo(
    () =>
      React.cloneElement(children, {
        ...children.props,
        onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
          if (!containerWidth.current || layout.width === contentWidth.current)
            return;
          checkContent(layout.width, layout.x);
        },
        ref: (ref: View) => {
          contentRef.current = ref;
        },
      }),
    [children, checkContent]
  );

  const animateStyle = {
    transform: [
      {
        translateX: offsetX.current,
      },
    ],
  };

  return (
    <View
      onLayout={({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        if (containerWidth.current === layout.width) return;
        containerWidth.current = layout.width;
        contentRef.current?.measure(
          (fx: number, _fy: number, width: number) => {
            checkContent(width, fx);
          }
        );
      }}
      style={style}
    >
      <ScrollView
        horizontal
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <Animated.View style={[styles.container, animateStyle]}>
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

export default React.memo(AutoScrolling);
