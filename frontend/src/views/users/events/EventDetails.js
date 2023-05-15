import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert,
	ActivityIndicator } from "react-native";
import { formatLongDate, formatTime } from "../../../utilities/dates";

import { registerForEvent, withdrawFromEvent } from "../../../actions/EventActions";
import { waitlistForEvent, removeFromEventWaitlist } from "../../../actions/WaitlistActions";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from '@env';

export default function EventDetails({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const userId = route.params.userId;
	const handleRefresh = route.params.handleRefresh;
	const type = route.params.type;
	const handleSetDisplayTab = route.params.handleSetDisplayTab;

	const [waitlistPosition, setWaitlistPosition] = useState(0);
	const [status, setStatus] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const yourStatus = 
		eventObj.isInWaitlist
			? "Waitlisted"
			: eventObj.isEligible && eventObj.attendee_status_id === null
				? "Eligible"
				: eventObj.isEligible && eventObj.attendee_status_id !== null
					? eventObj.attendee_status_id
					: !eventObj.isEligible
						? "Ineligible"
						: "";
		setStatus(yourStatus);
    }, []);

	useEffect(() => {
		const findWaitlistPosition = async () => {
			const response = await axios.get(
				`${API_END_POINT}waitlistposition/${eventObj.event_id}/${userId}`
			);
			position = response.data.waitlistPosition;
			setWaitlistPosition(position);
			setIsLoading(false);
		};
		if (eventObj.isInWaitlist) {
			findWaitlistPosition();
		}
	}, []);

	function displayProgressAlert(action, eventObj) {
		var progressMessage = "";
		switch (action) {
			case "Waitlist":
				progressMessage = `Adding you to the waitlist for ${eventObj.event_name}...`;
				break;
			case "Remove":
				progressMessage = `Removing you from the waitlist for ${eventObj.event_name}...`;
				break;
			case "Register":
				progressMessage = `Registering you for ${eventObj.event_name}...`;
				break;
			case "Withdraw":
				progressMessage = `Withdrawing you from ${eventObj.event_name}...`;
				break;
			default:
				break;
		}
		displayAlert(progressMessage, false);
	}
       
	function displayCompletionAlert(action, eventObj) {
		var completionMessage = "";
		switch (action) {
			case "Waitlist":
				completionMessage = `You are waitlisted for ${eventObj.event_name}`;
				break;
			case "Remove":
				completionMessage = `You have been removed from the waitlist for ${eventObj.event_name}`;
				break;
			case "Register":
				completionMessage = `You are registered for ${eventObj.event_name}`;
				break;
			case "Withdraw":
				completionMessage = `You have been withdrawn from ${eventObj.event_name}`;
				break;
			case "Full":
				completionMessage = `Sorry, this event is now full. Unable to register you for ${eventObj.event_name}. You have been added to the waitlist.`;
				break;	
			default:
				completionMessage = "";
				break;
		}
		displayAlert(completionMessage, true);
	}

	function displayAlert(message, showButton) {
		if (showButton) {
			Alert.alert("Updates complete.", message);
		}
		else {
			Alert.alert("Updates in progress...", message, [], {cancelable: false});
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{eventObj.event_name}</Text>
			<View style={styles.eventInfoContainer}>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Event date:</Text>
					<Text style={styles.value}>{formatLongDate(eventObj.event_start, true)}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Event start:</Text>
					<Text style={styles.value}>{formatTime(eventObj.event_start)}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Location:</Text>
					<Text style={styles.value}>{eventObj.event_location}</Text>
				</View>
				<View style={styles.eventInfoItem}>
					<Text style={styles.label}>Your status:</Text>
					<Text style={styles.value}>{status}</Text>
				</View>
				{eventObj.isInWaitlist &&
					<View style={styles.eventInfoItem}>
						<Text style={styles.label}>Waitlist position:</Text>

						{isLoading ? (
							<ActivityIndicator size="small" color="#0000ff" />
						) : (
							<Text style={styles.value}>
								{waitlistPosition}
							</Text>
						)}

						{/* <Text style={styles.value}>{waitlistPosition}</Text> */}
					</View>
				}
				{eventObj.type_id === "Loyalty" &&
					<View style={styles.eventInfoItem}>
						<Text style={styles.label}>Loyalty count:</Text>
						<Text style={styles.value}>{eventObj.loyaltyCount}</Text>
					</View>
				}
				<View style={styles.actionButtons}>
					{/* If eligible and in the waitlist,
					button should say "Remove" */}
					{eventObj.isEligible && eventObj.isInWaitlist && (
						<TouchableOpacity
							style={styles.button}
							onPress={async () => {
								displayProgressAlert("Remove", eventObj);
								await removeFromEventWaitlist(eventObj, userId);
								displayCompletionAlert("Remove", eventObj);
								handleSetDisplayTab(type);
								handleRefresh();
								navigation.goBack();
							}}>
							<Text style={styles.buttonText}>Remove from Waitlist</Text>
						</TouchableOpacity>
					)}
					{/* If eligible and already attending and not in waitlist,
					button should say "Withdraw", also show QR code button */}
					{eventObj.isEligible && eventObj.isAttending && !eventObj.isInWaitlist && (
						<>
							<TouchableOpacity
								style={styles.button}
								onPress={() =>
									//Will also need to pass the user information through to this screen.
									navigation.navigate("AttendeeQRCode", {
										eventObj: eventObj,
									})
								}>
								<Text style={styles.buttonText}>QR Code</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={async () => {
									displayProgressAlert("Withdraw", eventObj);
									await withdrawFromEvent(eventObj, userId);
									displayCompletionAlert("Withdraw", eventObj);
									handleSetDisplayTab(type);
									handleRefresh();
									navigation.goBack();
								}}>
								<Text style={styles.buttonText}>Withdraw</Text>
							</TouchableOpacity>
						</>
					)}
					{/* If eligible and not already attending and event has room,
					button should say "Register" */}
					{eventObj.isEligible && !eventObj.isAttending && eventObj.hasRoom && (
						<TouchableOpacity
							style={styles.button}
							onPress={async () => {
								displayProgressAlert("Register", eventObj);
								let msg = await registerForEvent(eventObj, userId);
								displayCompletionAlert(msg, eventObj);
								handleSetDisplayTab(type);
								handleRefresh();
								navigation.goBack();
							}}>
							<Text style={styles.buttonText}>Register</Text>
						</TouchableOpacity>
					)}
					{/* If eligible and not already attending and event has no room,
					button should say "Waitlist" */}
					{eventObj.isEligible && !eventObj.isAttending && !eventObj.hasRoom && !eventObj.isInWaitlist && (
						<TouchableOpacity
							style={styles.button}
							onPress={async () => {
								displayProgressAlert("Waitlist", eventObj);
								await waitlistForEvent(eventObj, userId);
								displayCompletionAlert("Waitlist", eventObj);
								handleSetDisplayTab(type);
								handleRefresh();
								navigation.goBack();
							}}>
							<Text style={styles.buttonText}>Waitlist</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
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
		alignItems: "center",
		rowGap: 10,
		width: "100%",
	},
	button: {
		width: 300,
        height: 50,
		marginBottom: 5,
        backgroundColor: "#159E31",
        justifyContent:"center",
        textAlign:"center",
		borderRadius: 5,
	},
	buttonText:{
        color:"white",
        textAlign:"center",
        fontWeight:500,
        fontSize:15,
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
});