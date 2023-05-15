import { StyleSheet, Text, View, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventsCal from "../views/users/events/EventsCal";
import { useNavigation } from "@react-navigation/native";
import MainProfile from "../views/users/profile/MainProfile";

import * as React from "react";

/**
 * A component that renders a navigation button to the user's profile page.
 * The button shows an icon of a person and when pressed, it navigates the user to their profile page.
 * @returns {JSX.Element} The JSX representation of the ProfileNavButton component.
 */
export default function ProfileNavButton() {
	const navigation = useNavigation();
	return (
		<View>
			<Ionicons
				style={styles.profileIcon}
				name="person"
				size={24}
				color="white"
				onPress={() => navigation.navigate("MainProfile")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	profileIcon: {
		marginRight: 10,
	},
});
