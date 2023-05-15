import { StyleSheet, Text, View } from "react-native";
import { formatLongDate } from "../utilities/dates";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EventListItem({ eventObj }) {
	const colorToIconNameMap = {
		orange: "timer-outline",
		red: "close-circle-outline",
		green: "checkmark-circle-outline",
		black: "alert-circle-outline",
	};

	const iconName = colorToIconNameMap[eventObj.color] || "alert-circle-outline";

	var eventDescription = "";
	var loyaltyDescription = "";

	if (eventObj.type_id === "Loyalty") {
		loyaltyDescription = ` (minimum ${eventObj.loyalty_max})`;
	}	
	
	if (!eventObj.hasRoom) {
		eventDescription = `FULL`;
	} else {
		eventDescription = `${eventObj.number_of_attendees} / ${eventObj.capacity}`
	}

	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Ionicons name={iconName} size={36} color={eventObj.color} />
			</View>
			<View
				style={styles.eventItem}
				key={`${eventObj.event_id}${eventObj.user_id}`}>
				<Text style={[styles.boldText]}>{eventObj.event_name}</Text>
				<Text>{`${formatLongDate(eventObj.event_start, true)}`}</Text>
				<View style={styles.textline}>
					<Text>
						{eventObj.type_id}
						{loyaltyDescription}
					</Text>
					<Text>{eventDescription}</Text>
				</View>
			</View>
			<View>
				<Ionicons name="chevron-forward-outline" size={24} color="grey" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: "row",
		width: "98%",
		backgroundColor: "#eee",
		//	backgroundColor: "#faeede",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: 10,
		margin: 5,
		padding: 5,
	},
	icon: {
		height: 40,
		width: 40,
		marginLeft: 5,
	},
	eventItem: {
		flex: 1,
		flexDirection: "column",
		width: "100%",
		margin: 5,
		marginLeft: 15,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
	},
	textline: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginRight: 20,
	}
});
