import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { handleSignUp } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { Logo } from "../../../components/Logo";

const SignUpForm = ({}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async () => {
    setFormMessage("");
    Keyboard.dismiss();
    if (
      !email ||
      !password ||
      !passwordConfirmation ||
      !firstName ||
      !lastName
    ) {
      setFormMessage("All fields are required");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFormMessage("First name should only contain alphabetic characters");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(lastName)) {
      setFormMessage("Last name should only contain alphabetic characters");
      return;
    }
    Toast.show("Signing Up...", {
      duration: Toast.durations.SHORT,
      position: -200,
    });

    const { success, message } = await handleSignUp(
      email,
      password,
      passwordConfirmation,
      firstName,
      lastName
    );

    if (success === true) {
      // Handle successful sign-up here
      navigation.navigate("ConfirmationForm", {
        initialUsername: email,
        confirmationMessage:
          "Account created. Please enter confirmation code found in your email.",
        initialMessage: "",
      });
    } else {
      setFormMessage(message);
    }
  };

  const onFocus = () => {
    this.setState({
      backgroundColor: "green",
    });
  };

  const onblur = () => {
    this.setState({
      backgroundColor: "#ededed",
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled={true}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Logo />
          </View>

          <View style={styles.inner}>
            <Text style={styles.errorMessage}>
              {formMessage ? formMessage : ""}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChangeText={(text) => setPasswordConfirmation(text)}
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SignInForm", { initialUsername: "" })
                }
              >
                <Text style={styles.secondaryButton}>
                  Already have an account?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.primaryButton}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
  },
  scrollView: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginVertical: 30,
  },
  inputContainer: {
    // marginBottom: 40,
  },

  input: {
    width: "100%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#00A600",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  secondaryButton: {
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
    paddingVertical: 10,

    borderRadius: 5,
  },
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
});
