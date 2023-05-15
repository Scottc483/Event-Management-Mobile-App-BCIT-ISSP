import EventsListHost from "./EventsListHost";
import EventsCalHost from "./EventsCalHost";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

import { StyleSheet } from "react-native";

import { setFilters } from "../../../components/store/filtersSlice";
import { useDispatch, useSelector } from "react-redux";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

/**
 * Component for displaying past events for host
 * @component
 * @returns view of past events for host
 */

export default function PastEvents({ route }) {
	const { eventObjs, handleRefresh } = route.params;

	return <EventsListHost eventObjs={eventObjs} handleRefresh={handleRefresh} />;
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
