import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import CreateEvent from "./CreateEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { Ionicons } from "@expo/vector-icons";

export default function HostMenu({ navigation }) {
	const formattedDate = new Date().toISOString().slice(0, 10);
	const [eventObj, setEventObj] = useState(null);
	const [errors, setErrors] = useState([]);

	useEffect(() => {
		/**
		 * Fetches the events from the API for a specific date
		 * @returns {Promise} A Promise that resolves to the event object
		 * */
		const getEvents = async () => {
			try {
				const response = await axios.get(
					`${API_END_POINT}event/date/${formattedDate}`
				);
				if (response.status === 200) {
					const eventExists = response.data.eventExists;
					if (eventExists) {
						setEventObj(response.data.eventExists);
					}
				}
			} catch (error) {
				if (error.response && error.response.statusCode === 500) {
				}
			}
		};
		getEvents();
	}, []);

	return (
		<View style={styles.buttonsContainer}>
			<View style={styles.buttonWrapper}>
				{eventObj ? (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("Attendance", { eventObj: eventObj });
						}}>
						<View style={styles.card}>
							<Ionicons name="checkmark-circle" size={40} color="black" />
							<Text style={styles.buttonText}>Todays Attendance</Text>
						</View>
					</TouchableOpacity>
				) : (
					<View style={styles.card}>
						<Text style={styles.buttonText}>No event today</Text>
					</View>
				)}
			</View>
			<View style={styles.listsWrapper}>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("EventsHost");
						}}>
						<View style={styles.listCard}>
							<Ionicons name="ios-calendar" size={40} color="black" />
							<Text style={styles.listText}>Events</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("CreateEvent");
						}}>
						<View style={styles.listCard}>
							<Ionicons name="add-circle-outline" size={40} color="black" />
							<Text style={styles.listText}>Create Event</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.usersWrapper}>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate("Users");
					}}>
					<View style={styles.card}>
						<Ionicons name="ios-people" size={40} color="black" />
						<Text style={styles.buttonText}>Users</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonsContainer: {
		flex: 1,

		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 50,
	},
	buttonWrapper: {
		// flex: 1,
		maxWidth: 300,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	listsWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	listCard: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 30,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: 150,
		height: 150,
		margin: 10,
	},
	listText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
	},

	card: {
		display: "flex",
		height: 100,
		width: 320,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 30,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
		marginLeft: 10,
	},
	usersWrapper: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
