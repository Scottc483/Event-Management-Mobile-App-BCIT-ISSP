import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { useSelector } from "react-redux";
import { handleSignOut } from "../../../components/AuthComponents";

const PendingMembership = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {
    handleSignOut();
  };

  if (user.membership_status_id === "None") {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Your membership is pending.</Text>
        <Button title="Sign Out" onPress={handleSubmit} />
      </View>
    );
  }

  return null;
};

export default PendingMembership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
