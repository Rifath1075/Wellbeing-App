// components/signup.js

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import firebase from "../loginFire";
import { db } from "../bookingFire";

function addUser(uuid, eemail, ccreated) {
  db.collection("users").add({
    uid: uuid,
    email: eemail,
    created: ccreated,
  });
}

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      uid: "",
      password: "",
      isLoading: false,
    };
  }

  updateInputVal = (val, prop) => {
    // const state = this.state;
    // state[prop] = val;
    this.setState({ [prop]: val });
  };

  error = () => {
    Alert.alert("Something went wrong!");
  };

  registerUser = () => {
    if (this.state.email === "" || this.state.password === "") {
      Alert.alert("Enter details to signup!");
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((data) => {
          this.setState({ uid: data.user.uid });
          console.log("User registered successfully!");
          addUser(
            this.state.uid,
            this.state.email,
            new Date().toLocaleDateString("en-GB")
          );
          Alert.alert("Registration successfull!");
          this.setState({
            isLoading: false,
            email: "",
            uid: "",
            password: "",
          });
          this.props.navigation.navigate("Login");
        })
        .catch((error) => this.error());
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, "email")}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, "password")}
          maxLength={15}
          secureTextEntry={true}
        />
        <Button
          color="#800080"
          title="Signup"
          onPress={() => this.registerUser()}
        />

        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          Already Registered? Click here to login
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: "#fff",
  },
  inputStyle: {
    width: "100%",
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
  },
  loginText: {
    color: "#800080",
    marginTop: 25,
    textAlign: "center",
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
