import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsCalHost from "./EventsCalHost";
import EventsListHost from "./EventsListHost";

import { setFilters } from "../../../components/store/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();
/**
 * Component for displaying upcoming events for host
 * @component
 * @returns view of upcoming events for host
 */
export default function Upcoming({ route }) {
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
