import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SignUpForm from "./partials/userAuthPartials/SignUpForm";
import SignInForm from "./partials/userAuthPartials/SignInForm";
import ForgotPasswordForm from "./partials/userAuthPartials/ForgotPasswordForm";
import ConfirmationForm from "./partials/userAuthPartials/ConfirmationForm";
import ResetPasswordForm from "./partials/userAuthPartials/ResetPasswordForm";
import { HideWithKeyboard } from "react-native-hide-with-keyboard";
import { SafeAreaView } from "react-navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const AuthForm = ({ route }) => {
  const { initialUsername, initialMessage, refreshMessage } =
    route?.params ?? {};
  const [message, setMessage] = useState("");
  const [formType, setFormType] = useState("signIn");
  const [username, setUsername] = useState("");

  const navigation = useNavigation();

  const Stack = createNativeStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#159E31",
            //    backgroundColor: "#f6d5a7",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="SignInForm"
          component={SignInForm}
          options={{
            title: "Sign In",
            // headerShown: false,
          }}
          initialParams={{
            initialUsername: initialUsername ?? "",
            initialMessage: initialMessage ?? "",
            refreshMessage: refreshMessage ?? "",
          }}
        />
        <Stack.Screen
          name="SignUpForm"
          component={SignUpForm}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="ForgotPasswordForm"
          component={ForgotPasswordForm}
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="ConfirmationForm"
          component={ConfirmationForm}
          options={{ title: "Account Confirmation" }}
        />
        <Stack.Screen
          name="ResetPasswordForm"
          component={ResetPasswordForm}
          options={{ title: "Reset Password" }}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  formView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  tabBar: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    flexDirection: "row",
    height: 60,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#eee",
    width: 100,
  },
  tabText: {
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  activeTabText: {
    color: "blue",
  },
});

export default AuthForm;