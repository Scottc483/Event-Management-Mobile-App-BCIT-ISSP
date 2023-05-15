import {
	View,
	Text,
	Button,
	TextInput,
	StyleSheet,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import { formatLongDateShortDay, formatTime } from "../../../utilities/dates";

export default function EventDetailsHost({ navigation, route }) {
	const eventObj = route.params.upcomingEvent;
	const eventId = eventObj.event_id;
	const [updatedEventObj, setUpdatedEventObj] = useState(eventObj);
	const handleRefresh = route.params.handleRefresh;
	const [isEdit, setIsEdit] = useState(false);
	const [editedName, setEditedName] = useState(eventObj.event_name);
	const [editedStartDate, setEditedStartDate] = useState(eventObj.event_start);
	const [editedEndDate, setEditedEndDate] = useState(eventObj.event_end);
	const [editedLocation, setEditedLocation] = useState(eventObj.event_location);
	const [editedCapacity, setEditedCapacity] = useState(eventObj.capacity);
	const [response, setResponse] = useState("");
	const [attended, setAttended] = useState("0");
	const [noShow, setNoShow] = useState("0");
	const [isLoading, setIsLoading] = useState(true);
	const [refreshDetails, setRefreshDetails] = useState(false);

	const formattedStartDate = new Date(eventObj.event_start);
	const currentDate = new Date();
	const apiURL = API_END_POINT;

	const getAttendanceStatusData = async () => {
		try {
			const response = await axios.get(`${apiURL}eventcounts`);
			setResponse(response);
		} catch (error) {
			console.error("Error getting attendance records:", error);
		}
	};

	/**
	 * Handles refreshing the attendance details for an event. Sets the state of
	 * 'refreshDetails' to true and 'isLoading' to true, then fetches the attendance
	 * data for the event from the API. If successful, sets the state of 'attended' and
	 * 'noShow' based on the data retrieved from the API. If there is an error, logs it
	 * to the console.
	 * @returns {void}
	 */
	const handleRefreshDetails = () => {
		setRefreshDetails(true);
		setIsLoading(true);
		const apiURL = API_END_POINT;
		const fetchData = async () => {
			try {
				const response = await axios.get(`${apiURL}event/${eventId}`);
				const data = response.data;
				setAttended(
					data.filter(
						(item) =>
							item.attendance_status_id === "Attended" &&
							item.event_id === eventId
					)[0].count
				);
			} catch (error) {
				console.log("Error getting attendace details:", error);
				//setAttended("0")
			}

			try {
				setNoShow(
					data.filter(
						(item) =>
							item.attendance_status_id === "No Show" &&
							item.event_id === eventId
					)[0].count
				);
			} catch (error) {
				console.log("Error getting no-show details:", error);
				// setNoShow("0");
			}
		};
		fetchData();
	};

	/**
	 * Set the attended and no-show counts for the specified event based on the response data.
	 * If the data is not available, sets the attended and no-show counts to "0".
	 * @returns {void}
	 */
	const setAttendanceStatusData = async () => {
		if (response && response.data) {
			const data = response.data;
			try {
				setAttended(
					data.filter(
						(item) =>
							item.attendance_status_id === "Attended" &&
							item.event_id === eventId
					)[0].count
				);
			} catch {
				setAttended("0");
			}

			try {
				setNoShow(
					data.filter(
						(item) =>
							item.attendance_status_id === "No Show" &&
							item.event_id === eventId
					)[0].count
				);
			} catch (error) {
				setNoShow("0");
			}
		}
	};

	useEffect(() => {
		/**
		 * Asynchronously fetches attendance status data and sets the isLoading state to false when finished.
		 * @returns {void}
		 */
		const fetchData = async () => {
			await getAttendanceStatusData();
			setIsLoading(false);
		};
		fetchData();
	}, [eventObj, refreshDetails]);

	useEffect(() => {
		/**
		 * Asynchronously retrieves attendance status data from the API
		 * and sets it using the `setAttendanceStatusData` function.
		 * @returns {void}
		 */
		const fetchData = async () => {
			await setAttendanceStatusData();
		};
		fetchData();
	}, [response]);

	/**
	 * Handles the submission of the form to update an event.
	 * Updates the event details on the backend based on the edited values.
	 * Navigates back to the event details page with the updated event data.
	 * @returns {void}
	 */
	const handleSubmit = async () => {
		// formart setInpEvnStartDatetime with just date
		const eventDate = editedStartDate.slice(0, 10);

		try {
			// send editedName, editedDate, editedLocation, editedCapacity to backend
			const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
				eventName: editedName,
				eventDate: eventDate,
				eventStart: editedStartDate,
				eventEnd: editedEndDate,
				eventLocation: editedLocation,
				capacity: editedCapacity,
				eligibilityType: eventObj.type_id,
				loyaltyMax: eventObj.loyalty_max,
				cancelled: eventObj.cancelled,
				reasonCancelled: eventObj.reason_cancelled,
			});
			const data = response.data;
			setIsEdit(false);
			// push to event details page
			const waitlist = eventObj.waitlist;
			handleRefresh();
			Alert.alert("Event Updated");
			navigation.goBack({
				upcomingEvent: {
					...data,
					waitlist,
				},
			});
		} catch (error) {
			alert("An error occurred while updating event");
			console.error("Error updating event:", error);
		}
	};

	/**
	 * Function that sends a delete request to the backend API to cancel an event.
	 * If the request is successful, it triggers the handleRefresh function to reload the event data,
	 * and navigates back to the event list page ("EventsHost").
	 * If the request is unsuccessful, it logs an error message to the console.
	 * @throws {Error} if the delete request fails
	 * @returns {void}
	 */
	const handleDelete = async () => {
		try {
			const response = await axios.put(`${API_END_POINT}/event/${eventId}`, {
				eventName: eventObj.event_name,
				eventDate: eventObj.event_date,
				eventStart: eventObj.event_start,
				eventEnd: eventObj.event_end,
				eventLocation: eventObj.event_location,
				capacity: eventObj.capacity,
				eligibilityType: eventObj.type_id,
				loyaltyMax: eventObj.loyalty_max,
				cancelled: true,
			});
			// check if the request was successful
			if (response.status === 200) {
				console.log("Event successfully cancelled");
				handleRefresh();
				// go back to event list
				Alert.alert("Event Deleted");
				navigation.navigate("EventsHost");
			} else {
				console.log("Error cancelling event");
			}
		} catch (error) {
			console.log("Error cancelling event:", error.message);
		}
	};
	return (
		<View style={styles.container}>
			{isEdit ? (
				<View style={styles.editView}>
					<Text>Event name</Text>
					<TextInput
						value={editedName}
						onChangeText={setEditedName}
						placeholder="Event name"
						style={styles.textInput}
					/>
					<Text>Location</Text>
					<TextInput
						value={editedLocation}
						onChangeText={setEditedLocation}
						placeholder="Event location"
						style={styles.textInput}
					/>
					<View style={styles.buttonRow}>
						<TouchableOpacity
							onPress={() => setIsEdit(false)}
							style={styles.button}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleSubmit()}
							style={styles.button}>
							<Text style={styles.buttonText}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				eventObj && (
					<View style={styles.container}>
						<Text style={styles.title}>{eventObj.event_name}</Text>
						<View style={styles.eventInfoContainer}>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Start: </Text>
								<Text style={styles.value}>
									{formatLongDateShortDay(eventObj.event_start)}
								</Text>
								<Text style={styles.value}>
									{formatTime(eventObj.event_start)}
								</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>End: </Text>
								<Text style={styles.value}>
									{formatLongDateShortDay(eventObj.event_end)}
								</Text>
								<Text style={styles.value}>
									{formatTime(eventObj.event_end)}
								</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Location:</Text>
								<Text style={styles.value}>{eventObj.event_location}</Text>
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Capacity:</Text>
								<Text style={styles.value}>{eventObj.capacity}</Text>
							</View>
							{/* <Text>Capacity: {eventObj.capacity}</Text> */}

							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Registered:</Text>
								{isLoading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<Text style={styles.value}>
										{eventObj.number_of_attendees !== undefined
											? eventObj.number_of_attendees
											: 0}

										{console.log(
											"eventAttendees: ",
											typeof eventObj.number_of_attendees
										)}
									</Text>
								)}
							</View>
							<View style={styles.eventInfoItem}>
								<Text style={styles.label}>Waitlisted:</Text>
								{isLoading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<Text style={styles.value}>{eventObj.waitlist.length}</Text>
								)}
							</View>

							{formattedStartDate < currentDate && (
								<>
									<View style={styles.eventInfoItem}>
										<Text style={styles.label}>Attended:</Text>
										{isLoading ? (
											<ActivityIndicator size="small" color="#0000ff" />
										) : (
											<Text style={styles.value}>{attended}</Text>
										)}
									</View>

									<View style={styles.eventInfoItem}>
										<Text style={styles.label}>No Show:</Text>
										{isLoading ? (
											<ActivityIndicator size="small" color="#0000ff" />
										) : (
											<Text style={styles.value}>{noShow}</Text>
										)}
									</View>
								</>
							)}
							<View style={styles.actionButtons}>
								{eventObj.type_id === "Guest List" &&
									formattedStartDate >= currentDate && (
										<TouchableOpacity
											style={styles.inviteButton}
											onPress={() =>
												navigation.navigate("InviteList", { eventObj })
											}>
											<Text style={styles.buttonText}>Set Invites</Text>
										</TouchableOpacity>
									)}
								<View style={styles.buttonRow}>
									{formattedStartDate >= currentDate && (
										<>
											<TouchableOpacity
												style={styles.button}
												onPress={() => setIsEdit(true)}>
												<Text style={styles.buttonText}>Edit</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => handleDelete()}
												style={styles.button}>
												<Text style={styles.buttonText}>Delete</Text>
											</TouchableOpacity>
										</>
									)}
								</View>
								<View style={styles.buttonRow}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate("Attendance", {
												eventObj: eventObj,
												handleRefreshDetails: handleRefreshDetails,
											});
										}}
										style={styles.button}>
										<Text style={styles.buttonText}>Attendance</Text>
									</TouchableOpacity>
									{formattedStartDate >= currentDate &&
										eventObj.hasRoom === false && (
											<TouchableOpacity
												style={styles.button}
												onPress={() => {
													navigation.navigate("EventWaitlist", {
														eventObj: eventObj,
													});
												}}>
												<Text style={styles.buttonText}>Waitlist</Text>
											</TouchableOpacity>
										)}
								</View>
							</View>
						</View>
					</View>
				)
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#fff",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	eventInfoContainer: {
		width: "100%",
		backgroundColor: "#eee",
		borderRadius: 10,
		padding: 20,
	},
	actionButtons: {
		marginTop: 20,
		flexDirection: "column",
		justifyContent: "center",
		rowGap: 10,
		width: "100%",
		alignItems: "center",
	},
	inviteButton: {
		width: 300,
		height: 50,
		backgroundColor: "#159E31",
		justifyContent: "center",
		borderRadius: 5,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		columnGap: 10,
	},
	button: {
		width: 145,
		height: 50,
		backgroundColor: "#159E31",
		justifyContent: "center",
		textAlign: "center",
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: 500,
		fontSize: 15,
	},
	eventInfoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	label: {
		fontWeight: "bold",
	},
	value: {},
	editView: {
		flex: 1,
		flexDirection: "column",
		marginTop: 150,
		//justifyContent: "center",
	},
	textInput: {
		paddingBottom: 8,
		fontSize: 18,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		marginBottom: 20,
	},
});
