import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { handleResetPassword } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";

const ResetPasswordForm = ({ route }) => {
  const { initialUsername, initialMessage } = route.params;
  const navigation = useNavigation();
  const [username, setUsername] = useState(
    initialUsername ? initialUsername : ""
  );
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState(initialMessage ? initialMessage : "");

  const handleSubmit = async () => {
    setMessage("");
    Keyboard.dismiss();

    if (!username || !code || !password || !passwordConfirmation) {
      setMessage("Please fill out all fields");
      return;
    }
    const { success, message } = await handleResetPassword(
      username,
      code,
      password,
      passwordConfirmation
    );
    if (success === false) {
      console.log("Error resetting password:", message);
      setMessage(message);
      return;
    }
    navigation.navigate("SignInForm", { initialUsername: username , initialMessage: message});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={true}
      onPress={Keyboard.dismiss}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}></Text>
        {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
        <TextInput
          style={styles.input}
          defaultValue={initialUsername ? initialUsername : username}
          onChangeText={setUsername}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Verification Code"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("SignInForm")}>
          <Text
            style={styles.secondaryButton}
          >
            Back to Sign In
          </Text>
          </TouchableOpacity>
          {/* <Button title="Reset Password" onPress={handleSubmit} /> */}
          <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.primaryButton}>Reset Password</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: "100%",
    // maxWidth: 400,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 40,
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
    fontSize: 15,
    color: "#fff",
    backgroundColor: "#159E31",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  secondaryButton: {
    justifyContent: "center",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

export default ResetPasswordForm;
