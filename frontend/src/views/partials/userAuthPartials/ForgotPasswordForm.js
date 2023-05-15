import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Touchable,
} from "react-native";
import { handleForgotPassword } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordForm = ({ route }) => {
  const { initialUsername } = route.params;
  const navigation = useNavigation();
  const [username, setUsername] = useState(
    initialUsername ? initialUsername : ""
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setMessage("");
    if (!username) {
      setMessage("Please enter your email address to reset your password.");
      return;
    }
      const { success, message } = await handleForgotPassword(username);
      if (success === false) {
        console.log("Error sending reset password email:", message);
        setMessage(message);
        return;
      }
      navigation.navigate("ResetPasswordForm", { initialUsername: username });  
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={true}
      onPress={Keyboard.dismiss}
    >
      <SafeAreaView>
        <View>
          <Text style={styles.title}></Text>
          {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
          <TextInput
            style={styles.input}
            defaultValue={initialUsername ? initialUsername : ""}
            onChangeText={setUsername}
            placeholder="Email"
            keyboardType="email-address"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignInForm")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.primaryButton}>Send Reset Code</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonContainer, styles.resetContainer]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ResetPasswordForm", { initialUsername: username })}
              style={styles.secondaryButton}
            >
              <Text style={styles.resetPasswordText}>Have a reset code?</Text>
            </TouchableOpacity>
            </View>
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
    marginBottom: 20,
    marginVertical: 30,
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
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryButton: {
    fontSize: 15,
    color: "#fff",
    backgroundColor: "#159E31",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  secondaryButtonText: {
    width: "100%",
    fontSize: 13,
    textDecorationLine: "underline",
    color: "#888",
    alignSelf: "center",
  },
  resetContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  resetPasswordText: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textDecorationLine: "underline",
    color: "#888",
    alignSelf: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
  
});

export default ForgotPasswordForm;
