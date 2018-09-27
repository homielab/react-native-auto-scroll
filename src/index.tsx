/**
 * @format
 */
import * as React from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View
} from "react-native";

interface Props {
  children: React.ReactElement<any>;
  style?: StyleProp<ViewStyle>;
  endPaddingWidth?: number;
  duration?: number;
  delay?: number;
}

interface State {
  endPaddingWidth: number;
}

export default class AutoScrolling extends React.PureComponent<Props, State> {
  offsetX: Animated.AnimatedValue = new Animated.Value(0);
  maxOffsetX: number = 0;
  duration: number = 0;
  delay: number = 1000;
  childComponentRef: any;

  constructor(props: Props) {
    super(props);
    const { duration, delay, endPaddingWidth } = props;
    if (duration) this.duration = duration;
    if (delay) this.delay = delay;
    this.state = {
      endPaddingWidth: endPaddingWidth || 100
    };
    this.run = this.run.bind(this);
    this.measureContainerView = this.measureContainerView.bind(this);
  }

  run() {
    Animated.loop(
      Animated.timing(this.offsetX, {
        toValue: this.maxOffsetX,
        duration: this.duration,
        delay: this.delay,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }

  measureContainerView(event: any) {
    if (this.maxOffsetX !== 0) return;
    const containerWidth = event.nativeEvent.layout.width;
    this.childComponentRef.measure((fx: number, fy: number, width: number) => {
      const componentWidth = width;
      let { endPaddingWidth } = this.state;
      if (componentWidth <= containerWidth) {
        endPaddingWidth = containerWidth - componentWidth;
        this.setState({
          endPaddingWidth
        });
      }

      this.maxOffsetX = -1 * (componentWidth + endPaddingWidth + fx);
      if (!this.duration) this.duration = componentWidth * 20;
      this.run();
    });
  }

  render() {
    const { children, style } = this.props;
    const { endPaddingWidth } = this.state;
    const childrenProps = children.props;
    const childrenWithProps = React.cloneElement(children, {
      ...childrenProps,
      style: {
        ...childrenProps.style,
        marginRight: endPaddingWidth
      },
      ref: (ref: any) => (this.childComponentRef = ref)
    });

    return (
      <View style={style}>
        <ScrollView
          horizontal
          bounces={false}
          scrollEnabled={false}
          onLayout={this.measureContainerView}
        >
          <Animated.View
            style={[
              styles.row,
              {
                transform: [
                  {
                    translateX: this.offsetX
                  }
                ]
              }
            ]}
          >
            {childrenWithProps}
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  }
});
