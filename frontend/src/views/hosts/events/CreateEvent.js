import {
	StyleSheet,
	View,
	Text,
	Button,
	TextInput,
	KeyboardAvoidingView,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { API_END_POINT } from "@env";
import { useEffect, useState } from "react";
import MyDateTimePicker from "../../../components/DateTimePicker";
import { ValidateInputs } from "../../../components/CreateErrorHandling";

export default function CreateEvent({ navigation }) {
	const defaultValue = "Guest List";
	const [selectedEventType, setSelectedEventType] = useState(defaultValue);
	const [inpEvnName, setInpEvnName] = useState("");
	const [inpEvnMax, setInpEvnMax] = useState("");
	const [inpEvnLocation, setInpEvnLocation] = useState("");
	const [eligibilityData, setEligibilityData] = useState([]);
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [loyaltyMinimum, setLoyaltyMinimum] = useState(0);
	const [startDate, setStartDate] = useState(new Date());
	const [startTime, setStartTime] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [startDateTime, setStartDateTime] = useState(new Date());
	const [endDateTime, setEndDateTime] = useState(new Date());
	const apiURL = API_END_POINT;
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	/**
	 * Update the start and end date/time based on the selected date/time and identifier.
	 * @param {Date} selectedDateTime The selected date/time
	 * @param {String} identifier The identifier to determine which date/time to update
	 * @returns {void}
	 */
	const handleDateTimeChange = (selectedDateTime, identifier) => {
		if (identifier === "startDate") {
			setStartDate(selectedDateTime);
			setStartDateTime(
				new Date(
					selectedDateTime.setHours(
						startTime.getHours(),
						startTime.getMinutes()
					)
				)
			);
		} else if (identifier === "startTime") {
			setStartTime(selectedDateTime);
			setStartDateTime(
				new Date(
					startDate.setHours(
						selectedDateTime.getHours(),
						selectedDateTime.getMinutes()
					)
				)
			);
		} else if (identifier === "endDate") {
			setEndDate(selectedDateTime);
			setEndDateTime(
				new Date(
					selectedDateTime.setHours(endTime.getHours(), endTime.getMinutes())
				)
			);
		} else if (identifier === "endTime") {
			setEndTime(selectedDateTime);
			setEndDateTime(
				new Date(
					endDate.setHours(
						selectedDateTime.getHours(),
						selectedDateTime.getMinutes()
					)
				)
			);
		}
	};

	/**
	 * Update the state with the selected event type value
	 * @param {string} itemValue - The value of the selected event type option
	 * @param {number} itemIndex - The index of the selected event type option in the dropdown menu
	 * */
	const handleEventTypeChange = (itemValue, itemIndex) => {
		setSelectedEventType(itemValue); // Update the state with the selected event type value
	};

	useEffect(() => {
		/**
		 * Fetches the eligibility data from the backend API and updates the component's state with it.
		 * Sets the state of 'isPickerVisible' to true, allowing the eligibility picker component to be rendered.
		 * @returns {void}
		 * */
		const geteligibility = async () => {
			const response = await axios.get(`${apiURL}eligibility`);
			const data = response.data;
			setEligibilityData(data);
			setIsPickerVisible(true);
		};
		geteligibility();
	}, []);

	/**
	 * Handles creating a new event and posts the event object to the API.
	 * Validates user inputs and checks if there are any errors, if there are it sets the errors state and returns.
	 * If there are no errors it sends a post request to the API with the event object and creates an event capacity.
	 * It then resets the input states and navigates to the appropriate screen depending on the selected event type.
	 * @returns {void}
	 */
	const handleCreateEvent = async () => {
		// error handling for inputs
		const errors = await ValidateInputs(
			inpEvnName,
			inpEvnMax,
			inpEvnLocation,
			selectedEventType,
			loyaltyMinimum,
			startDateTime,
			endDateTime
		);
		console.log(errors);
		// error occured
		if (Object.keys(errors).length > 0) {
			console.log("error occured");
			setErrors(errors);
			return;
		}
		// no errors go to POST
		try {
			const postEventObj = {
				eligibilityType: selectedEventType,
				eventName: inpEvnName,
				capacity: inpEvnMax,
				eventDate: startDateTime.toISOString().slice(0, 10),
				eventStart: startDateTime.toISOString(),
				eventEnd: endDateTime.toISOString(),
				eventLocation: inpEvnLocation,
				loyaltyMax: selectedEventType == "Loyalty" ? loyaltyMinimum : 0,
				reason_cancelled: "NULL",
			};
			setLoading(true);
			const response = await axios.post(`${apiURL}/event`, postEventObj);

			// create event capacity
			const response_capacity = await axios.post(
				`${apiURL}/event/capacity/${response.data.event.event_id}`,
				{
					capacity: inpEvnMax,
				}
			);
			// Reset the state
			setInpEvnName("");
			setInpEvnMax("");
			setInpEvnLocation("");
			setLoyaltyMinimum(0);
			setStartDate(new Date());
			setStartTime(new Date());
			setEndDate(new Date());
			setEndTime(new Date());
			setStartDateTime(new Date());
			setEndDateTime(new Date());
			setSelectedEventType(defaultValue);
			setErrors({});

			setLoading(false);
			// Navigate to InviteList screen if event type is Guest List
			if (selectedEventType == "Guest List") {
				// Navigate to InviteList screen
				navigation.navigate("InviteList", {
					eventObj: response.data.event,
				});
			} else {
				navigation.navigate("EventDetailsHost", {
					upcomingEvent: {
						...response.data.event,
						attendees: [],
						waitlist: [],
					},
				});
			}
		} catch (error) {
			console.log("Error creating event:", error);
		}
	};

	if (loading) {
		return (
			<ActivityIndicator
				size="large"
				color="#0000ff"
				animating={true}
				style={styles.activityIndicator}
			/>
		);
	}
	return (
		<KeyboardAvoidingView behavior={"padding"} enabled style={styles.wrapper}>
			<FlatList
				style={styles.container}
				data={[{ key: "eventForm" }]}
				renderItem={({ item }) => (
					<View style={styles.container}>
						{isPickerVisible && (
							<>
								<Text syle={styles.labelText}>Event Type</Text>
								<View style={{ zIndex: 2000, marginBottom: 20, marginTop: 10 }}>
									<DropDownPicker
										open={open}
										value={selectedEventType}
										items={eligibilityData.eligibilityTypes.map((item) => ({
											label: item.type_id,
											value: item.type_id,
										}))}
										setOpen={setOpen}
										setValue={handleEventTypeChange}
									/>
								</View>
								{selectedEventType === "Loyalty" && (
									<>
										{errors.loyaltyMinimum && (
											<Text style={{ color: "red" }}>
												{errors.loyaltyMinimum}
											</Text>
										)}
										<Text style={styles.labelText}>Loyalty Minimum:</Text>
										<TextInput
											value={loyaltyMinimum.toString()}
											style={styles.nameInput}
											onChangeText={(loyaltyMinimum) => {
												const formatted = loyaltyMinimum.replaceAll(/\s+/g, "");
												if (
													formatted !== "" &&
													formatted !== null &&
													isNaN(formatted) === false
												) {
													setLoyaltyMinimum(parseInt(formatted));
												} else {
													setLoyaltyMinimum("");
												}
											}}
											keyboardType="numeric"
										/>
									</>
								)}

								{errors.inpEvnName && (
									<Text style={{ color: "red" }}>{errors.inpEvnName}</Text>
								)}
								<Text syle={styles.labelText}>Event name</Text>
								<TextInput
									value={inpEvnName}
									style={styles.nameInput}
									onChangeText={(inpEvnName) => setInpEvnName(inpEvnName)}
								/>
								{errors.inpEvnMax && (
									<Text style={{ color: "red" }}>{errors.inpEvnMax}</Text>
								)}
								<Text syle={styles.labelText}>Max Participants</Text>
								<TextInput
									value={inpEvnMax}
									style={styles.nameInput}
									onChangeText={(inpEvnMax) => setInpEvnMax(inpEvnMax)}
									keyboardType="numeric"
								/>
								<View style={styles.dateTimeContainer}>
									<View style={styles.dateContainer}>
										<Text style={styles.labelText}>Start</Text>
										{errors.startDateTime && (
											<Text style={{ color: "red" }}>
												{errors.startDateTime}
											</Text>
										)}
										<View>
											<MyDateTimePicker
												style={styles.dateTimePicker}
												value={startDate}
												buttonTitle="Change Date"
												mode={"date"}
												date={startDate}
												onDateChange={(selectedDate) =>
													handleDateTimeChange(selectedDate, "startDate")
												}
											/>
										</View>
										<Text style={styles.selectedDateTimeText}>
											{startDateTime.toDateString()}
										</Text>
									</View>

									<View style={styles.dateContainer}>
										<Text style={styles.labelText}>End</Text>
										<MyDateTimePicker
											style={styles.dateTimePicker}
											value={endDate}
											buttonTitle="Change Date"
											mode={"date"}
											date={endDate}
											onDateChange={(selectedDate) =>
												handleDateTimeChange(selectedDate, "endDate")
											}
										/>
										<Text style={styles.selectedDateTimeText}>
											{endDateTime.toDateString()}
										</Text>
									</View>
								</View>
								<View style={styles.dateTimeContainer}>
									<View style={styles.timeContainer}>
										<MyDateTimePicker
											style={styles.dateTimePicker}
											value={startDateTime}
											buttonTitle="Change Time"
											mode={"time"}
											date={startDateTime}
											onDateChange={(selectedTime) =>
												handleDateTimeChange(selectedTime, "startTime")
											}
										/>
										<Text style={styles.selectedDateTimeText}>
											{startDateTime.toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
									</View>

									<View style={styles.timeContainer}>
										<MyDateTimePicker
											style={styles.dateTimePicker}
											value={endDateTime}
											buttonTitle="Change Time"
											mode={"time"}
											date={endDateTime}
											onDateChange={(selectedTime) =>
												handleDateTimeChange(selectedTime, "endTime")
											}
										/>
										<Text style={styles.selectedDateTimeText}>
											{endDateTime.toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
									</View>
								</View>
								{errors.inpEvnLocation && (
									<Text style={{ color: "red" }}>{errors.inpEvnLocation}</Text>
								)}
								<Text>Location</Text>
								<TextInput
									value={inpEvnLocation}
									style={styles.nameInput}
									onChangeText={(inpEvnLocation) =>
										setInpEvnLocation(inpEvnLocation)
									}
								/>
								{errors.sameDate && (
									<Text style={{ color: "red" }}>{errors.sameDate}</Text>
								)}
								<TouchableOpacity
									style={styles.submitButton}
									onPress={handleCreateEvent}>
									<Text style={styles.submitText}> Create </Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				)}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		height: "100%",
		flex: 1, // Add this line
	},
	container: {
		flex: 1,
		padding: 15,
		paddingTop: 30,
		backgroundColor: "#fff",
	},
	labelText: {
		fontSize: 18,
		marginLeft: -10,
		marginBottom: 5,
	},
	nameInput: {
		paddingBottom: 8,
		fontSize: 24,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
	dateTimeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 20,
	},
	dateContainer: {
		flex: 1,
		alignItems: "center",
	},
	timeContainer: {
		flex: 1,
		alignItems: "center",
	},
	activityIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: 80,
	},
	dateTimePicker: {
		backgroundColor: "#159E31",
	},
	submitButton: {
		marginTop: 20,
		alignItems: "center",
		backgroundColor: "#159E31",
		height: 50,
		borderRadius: 5,
	},
	submitText: {
		color: "white",
		fontSize: 19,
		padding: 10,
	},
	selectedDateTimeText: {
		alignItems: "center",
		fontSize: 16,
		justifyContent: "center",
		marginLeft: -7,
	},
});
