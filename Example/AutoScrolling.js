/**
 * @format
 */
import * as React from "react";
import { Animated, Easing, ScrollView, StyleSheet, View } from "react-native";

export default class AutoScrolling extends React.PureComponent {
  offsetX = new Animated.Value(0);
  maxOffsetX = 0;
  duration = 0;
  delay = 1000;
  childComponentRef = null;

  constructor(props) {
    super(props);
    const { duration, delay, endPaddingWidth } = props;
    if (typeof duration === "number") this.duration = duration;
    if (typeof delay === "number") this.delay = delay;
    this.state = {
      endPaddingWidth:
        typeof endPaddingWidth === "number" ? endPaddingWidth : 100
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

  measureContainerView(event) {
    if (this.maxOffsetX !== 0) return;
    const containerWidth = event.nativeEvent.layout.width;
    this.childComponentRef.measure((fx, fy, width) => {
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
      style: [childrenProps.style, { marginRight: endPaddingWidth }],
      ref: ref => (this.childComponentRef = ref)
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
