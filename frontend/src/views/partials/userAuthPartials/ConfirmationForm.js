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
  Touchable,
} from "react-native";
import { handleConfirmation } from "../../../components/AuthComponents";
import { useNavigation } from "@react-navigation/native";


const ConfirmationForm = ({ route }) => {
  const navigation = useNavigation();
  const { initialUsername, initialMessage, confirmationMessage } = route.params;
  const [confirmation , setConfirmation] = useState(confirmationMessage ? confirmationMessage : "");
  const [username, setUsername] = useState(initialUsername ? initialUsername : "");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [formMessage, setFormMessage] = useState(initialMessage ? initialMessage : "");

  const handleSubmit = async () => {

    Keyboard.dismiss();
    setFormMessage("");

    if (!username || !confirmationCode) {
      setFormMessage("Please enter a username and confirmation code");
      return;
    }
    
      const { success, message } = await handleConfirmation(username, confirmationCode);
      
      if (success === true) {
        console.log("Successfully confirmed user");
        // Handle successful confirmation here
        navigation.navigate("SignInForm", {
          initialUsername: username,
          initialMessage: "Account confirmed. Please sign in.",

        });
        return;
      }
      setFormMessage(message);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={true}
      onPress={Keyboard.dismiss}
    >
      <SafeAreaView>
          <Text style={styles.title}></Text>
            <Text style={styles.errorMessage}>{formMessage ? formMessage : ""}</Text>
            <Text style={styles.confirmationMessage}>{confirmation ? confirmation : ""}</Text>
          <TextInput
            defaultValue={username}
            onChangeText={setUsername}
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            placeholder="Confirmation Code"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("SignInForm")}>
            <Text
              style={styles.secondaryButton}
            >
              Back to Sign In
            </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.primaryButton}>Confirm</Text>
            </TouchableOpacity>

          </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  confirmationMessage: {
    color: "#159E31",
    marginBottom: 10,
  },
  container: {
    flex: 1,
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
    marginTop: 30,
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
    fontSize: 15,
    textDecorationLine: "underline",
    color: "#888",
  },
  errorMessage: {
    color : "red",
    marginBottom: 10,
  }
});

export default ConfirmationForm;