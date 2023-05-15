import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

/**
 * Renders a screen that displays the attendees for an event, allows the host to edit their attendance, and submit the changes.
 * @param {object} navigation - The navigation object passed by the React Navigation library.
 * @param {object} route - The route object passed by the React Navigation library, containing the event object
 * and a function to refresh the event details page.
 * @returns {JSX.Element} - A JSX.Element representing the Attendance screen.
 */
export default function Attendance({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const handleRefreshDetails = route.params.handleRefreshDetails;
	const today = new Date().toISOString().slice(0, 10);
	const [attendees, setAttendees] = useState([]);
	const [editAttendance, setEditAttendance] = useState({});
	const [loading, setLoading] = useState(true);
	const attendedColor = "#159E31";
	const noShowColor = "#E31E1E";

	useEffect(() => {
		/**
		 * Retrieves the attendees for the current event.
		 * It sends a request to the API to fetch the attendee data for the event.
		 * The attendee data is filtered to include only registered attendees.
		 * If there are registered attendees, the editAttendance object is updated with user IDs as keys and attendance statuses as values.
		 * Finally, the attendees state is updated with the registered attendees, and the loading state is set to false.
		 * @returns {void}
		 */
		const getAttendees = async () => {
			const response = await axios.get(
				`${API_END_POINT}attendee/users/${eventObj.event_id}`
			);
			const data = response.data;
			const registeredAttendees = data.filter(
				(attendee) => attendee.attendee_status_id == "Registered"
			);

			if (registeredAttendees.length > 0) {
				const editAttendanceObj = {};
				registeredAttendees.map((attendee) => {
					editAttendanceObj[attendee.user_id] = attendee.attendance_status_id;
				});
				setEditAttendance(editAttendanceObj);
			}
			setAttendees(registeredAttendees);
			setLoading(false);
		};
		getAttendees();
	}, []);

	/**
	 * 	Handle attendance button click event, which toggles attendance status for the specified user
	 * @param {string} userId - The user id of the attendee whose attendance status needs to be updated
	 * @returns {void}
	 * */
	const handleAttendanceButton = (userId) => {
		setEditAttendance((editAttendance) => ({
			...editAttendance,
			[userId]: editAttendance[userId] === "Attended" ? "No Show" : "Attended",
		}));
	};

	/**
	 * Handles the submission of edited attendance data for an event.
	 * If there are changes to the attendance status for any of the attendees, updates the database with a PUT request.
	 * Then fetches the updated attendee list and navigates back to the event details page with the updated data.
	 * Also triggers a refresh of the event details page and sets the loading state to true.
	 * @returns {Promise<void>} - A Promise that resolves when the function finishes executing.
	 */
	const handleSubmit = async () => {
		try {
			// check if there is value in the editattendance array
			// if there is value, then update the database by put request
			// if there is no value, then do nothing
			if (Object.keys(editAttendance).length > 0) {
				const editAttendanceArray = Object.entries(editAttendance);
				editAttendanceArray.map(async (attendee) => {
					const userId = attendee[0];
					const attendanceStatus = attendee[1];
					const response = await axios.put(
						`${API_END_POINT}attendee/${eventObj.event_id}/${userId}`,
						{ attendance_status: attendanceStatus }
					);
				});

				setTimeout(async () => {
					setLoading(true);
					const response = await axios.get(
						`${API_END_POINT}attendee/users/${eventObj.event_id}`
					);
					const attendees = response.data;

					navigation.navigate("EventDetailsHost", {
						upcomingEvent: {
							...eventObj,
							attendees,
						},
					});
				}, 500);
			}
			handleRefreshDetails();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<View style={styles.eventInfoContainer}>
					<Text style={styles.eventTitle}>{eventObj.event_name}</Text>
					<View style={styles.labelContainer}>
						<Text style={styles.title}>Attendees</Text>
						<View style={styles.statusContainer}>
							<Text style={styles.label}>ATTENDED</Text>
							<Text style={styles.label}>NO SHOW</Text>
						</View>
					</View>
				</View>
				{loading ? (
					<ActivityIndicator
						size="large"
						color="#0000ff"
						animating={true}
						style={styles.activityIndicator}
					/>
				) : (
					<FlatList
						data={attendees}
						keyExtractor={(attendee) => attendee.user_id.toString()}
						renderItem={({ item: attendee }) => (
							<View style={styles.item} key={attendee.user_id}>
								<Text style={styles.itemText}>
									{attendee.first_name} {attendee.last_name}
								</Text>
								{eventObj.event_date <= today && (
									<View style={styles.attendanceButtons}>
										<TouchableOpacity
											style={[
												styles.attendedButton,
												editAttendance[attendee.user_id] === "Attended" &&
													styles.attended,
											]}
											onPress={() =>
												handleAttendanceButton(attendee.user_id)
											}></TouchableOpacity>
										<TouchableOpacity
											style={[
												styles.noshowButton,
												editAttendance[attendee.user_id] === "No Show" &&
													styles.noShow,
											]}
											onPress={() =>
												handleAttendanceButton(attendee.user_id)
											}></TouchableOpacity>
									</View>
								)}
							</View>
						)}
					/>
				)}
				{eventObj.event_date <= today && (
					<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
						<Text style={styles.submitButtonText}> Save </Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container: {
		margin: 5,
	},
	eventInfoContainer: {
		justifyContent: "center",
		height: 100,
	},
	eventTitle: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		margin: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 5,
	},
	statusContainer: {
		width: 180,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	label: {
		fontSize: 14,
		margin: 5,
	},
	buttonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	buttonWrapper: {
		margin: 10,
	},
	item: {
		marginVertical: 3,
		marginHorizontal: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemText: {
		fontSize: 16,
	},
	attendanceButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 140,
		marginRight: 10,
	},
	attendedButton: {
		backgroundColor: "#ffffff",
		borderRadius: 20,
		padding: 15,
		elevation: 2,
		margin: 10,
		borderWidth: 1,
		borderColor: "#159E31",
	},
	noshowButton: {
		backgroundColor: "#ffffff",
		borderRadius: 20,
		padding: 15,
		elevation: 2,
		margin: 10,
		borderWidth: 1,
		borderColor: "#E31E1E",
	},
	attended: {
		backgroundColor: "#159E31",
	},
	noShow: {
		backgroundColor: "#E31E1E",
	},
	submitButton: {
		backgroundColor: "#159E31",
		height: 50,
		justifyContent: "center",
		alignContent: "center",
		borderRadius: 5,
		margin: 10,
	},
	submitButtonText: {
		color: "white",
		textAlign: "center",
		fontSize: 15,
		fontWeight: "bold",
	},
});
