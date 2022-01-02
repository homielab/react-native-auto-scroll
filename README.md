# @homielab/react-native-auto-scroll

[![npm version](https://badge.fury.io/js/@homielab%2Freact-native-auto-scroll.svg)](https://badge.fury.io/js/@homielab%2Freact-native-auto-scroll) [![CircleCI](https://circleci.com/gh/homielab/react-native-auto-scroll/tree/main.svg?style=svg)](https://circleci.com/gh/homielab/react-native-auto-scroll/tree/main) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/homielab/react-native-auto-scroll/graphs/contributors)

Auto horizontal scroll. You only need to wrap the component between `<AutoScroll>`, it is the same as the `<marquee>` tag in HTML.

There are many solutions, but I prefer this one for the best performance. The animations are using `useNativeDriver`, so they will be sent to native and performed on the UI thread instead of the JS thread.

## Installation

    npm install --save @homielab/react-native-auto-scroll

_or_

    yarn add @homielab/react-native-auto-scroll

## Properties

| Prop                  | Description                                         | Default |
| --------------------- | --------------------------------------------------- | ------- |
| **`style`**           | `View` style                                        | \_      |
| **`endPaddingWidth`** | The padding width to next round                     | 100     |
| **`duration`**        | Time to finish a round (ms).                        | \_      |
| **`delay`**           | Delay time before start auto scroll animation (ms). | 1000    |
| **`isLTR`**           | Is Left to Right?                                   | false   |

## Example:

![Auto Scroll Example](https://github.com/homielab/react-native-auto-scroll/raw/main/screenshots/auto-scrolling.gif "Auto Scroll Example")

Expo: https://snack.expo.io/@minhtc/react-native-auto-scrolling-demo

Example: https://github.com/homielab/react-native-auto-scroll/tree/main/Example

Source:

```js
import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import AutoScroll from "@homielab/react-native-auto-scroll";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AutoScroll style={styles.scrolling1}>
          <Image
            style={styles.image}
            delay={0}
            duration={6000}
            source={require("./assets/merry-christmas-png.png")}
          />
        </AutoScroll>
        <AutoScroll style={styles.scrolling2} endPadding={50}>
          <Text style={styles.welcome}>MERRY CHRISTMAS AND HAPPY NEW YEAR</Text>
        </AutoScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  image: {
    width: 200,
    height: 200,
  },
  scrolling1: {
    width: 400,
    padding: 10,
    marginBottom: 10,
  },
  scrolling2: {
    backgroundColor: "red",
    width: 400,
    padding: 10,
    marginBottom: 10,
  },
  welcome: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
});
```

## Question?

You are welcome to create new issue 👍🏻

https://github.com/homielab/react-native-auto-scroll/issues
