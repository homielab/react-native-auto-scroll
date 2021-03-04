import * as React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import AutoScrolling from "react-native-auto-scrolling";

const MSG = [
  "Happy Birthday!",
  "Congratulations on another year well lived",
  "Best wishes on your birthday – may you have many, many more",
  "Wishing you the happiest of birthdays",
  "Best wishes for a fantastic person on your birthday",
  "I hope you treat yourself to something special on your birthday – you deserve it!",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class App extends React.Component {
  state = {
    welcomeMsg: MSG[0],
  };

  updateText = () => {
    this.setState({
      welcomeMsg: MSG[getRandomInt(5)],
    });
  };

  render() {
    const { welcomeMsg } = this.state;
    return (
      <View style={styles.container}>
        <AutoScrolling style={styles.scrolling1} duration={2500}>
          <Image
            style={styles.image}
            source={require("./assets/merry-christmas-png.png")}
          />
        </AutoScrolling>
        <AutoScrolling style={styles.scrolling2}>
          <Text style={styles.welcome}>{welcomeMsg}</Text>
        </AutoScrolling>
        <AutoScrolling isLTR style={styles.scrolling2}>
          <Text style={styles.welcome}>{welcomeMsg}</Text>
        </AutoScrolling>
        <TouchableOpacity onPress={this.updateText} style={styles.button}>
          <Text style={styles.buttonText}>Change Birthday Wish</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 200,
  },
  scrolling1: {
    marginVertical: 10,
  },
  scrolling2: {
    backgroundColor: "red",
    alignItems: "center",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  welcome: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    margin: 20,
    backgroundColor: "blue",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
