import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { handleSignOut } from "../../../components/AuthComponents";
import { openEmailSupport } from "../../../utilities/emailLink";

const RejectedMembership = () => {
  const handleSubmit = () => {
    handleSignOut();
  };

  const handleEmailSupport = () => {
    openEmailSupport();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Please contact support:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleEmailSupport}>
          <Text style={styles.label}>support@example.com</Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <Button title="Sign Out" onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

export default RejectedMembership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    // width: "100%",
    flexDirection: "column",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    marginVertical: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginBottom: 20,
  },

  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
