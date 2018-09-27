# react-native-auto-scrolling

Auto horizontal scrolling , You just need wrap the component between `<AutoScrolling>`, it is the same like `marquee` tag in html.

There are many solutions, but I prefer this one for the best performance. The animations are using `useNativeDriver`, so they will be send to native and will be perform on the UI thread instead of JS thread.

## Installation

    npm install --save react-native-auto-scrolling

_or_

    yarn add react-native-auto-scrolling

## Example:

![Auto SCrolling Example](https://github.com/minhtc/react-native-auto-scrolling/raw/master/screenshots/auto-scrolling.gif "Auto Scrolling Example")

source:

```js
import React from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import AutoScrolling from "react-native-auto-scrolling";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AutoScrolling style={styles.scrolling1}>
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 25
            }}
            delay={0}
            duration={6000}
            source={require("./merry-christmas-png.png")
          />
        </AutoScrolling>
        <AutoScrolling style={styles.scrolling2} endPadding={50}>
          <Text style={styles.welcome}>MERRY CHRISTMAS AND HAPPY NEW YEAR</Text>
        </AutoScrolling>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  scrolling1: {
    width: 400,
    padding: 10,
    marginBottom: 10
  },
  scrolling2: {
    backgroundColor: "red",
    width: 400,
    padding: 10,
    marginBottom: 10
  },
  welcome: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10
  }
});
```

## Properties

| Prop                  | Description                                         | Default |
| --------------------- | --------------------------------------------------- | ------- |
| **`style`**           | `View` style                                        | \_      |
| **`endPaddingWidth`** | The padding width to next round                     | 100     |
| **`duration`**        | Time to finish a round (ms).                        | \_      |
| **`delay`**           | Delay time before start auto scroll animation (ms). | 1000    |

## Question?

minhtcx@gmail.com
