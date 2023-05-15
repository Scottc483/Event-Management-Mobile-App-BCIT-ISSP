import { StyleSheet, Text, View, Button } from "react-native";

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>Home Screen</Text>
			<Button
				title="Go to Details"
				onPress={() =>
					navigation.navigate("Home", {
						itemId: 1,
						navigation: "Here are the details you requested",
					})
				}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
