import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CalendarList } from "react-native-calendars";
import YearPicker from "../../../components/YearPicker";
import Calendar from "../../../components/Calendar";

/**
 * Component for displaying calendar of events for host
 * @component
 * @returns view of calendar of events for host
 */
export default function EventsCalHost({ route, navigation }) {
	const { eventObjs, handleRefresh } = route.params;
	const [markedDates, setMarkedDates] = useState({});
	// use filter to filter events by upcoming, past, or all
	// type is the upcoming or past
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState("");
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const handleYearSelect = (year) => {
		setSelectedYear(year);
		setSelected(year + "-01-01");
	};

	//first time load, set selected date to the first day of the year
	useEffect(() => {
		setSelected(selectedYear + "-01-01");
	}, [selectedYear]);

	// create marked array
	useEffect(() => {
		if (!eventObjs) {
			return;
		}
		const eventDatesArray = eventObjs.map((event) => {
			// check the date is valid
			if (event.event_date && Date.parse(event.event_date)) {
				const originalDate = new Date(event.event_date);
				// format the date to YYYY-MM-DD
				const formattedDate = originalDate.toISOString().slice(0, 10);
				let color = "blue";
				if (event.type === "past") {
					color = "grey";
				} else if (event.capacity - event.number_of_attendees <= 0) {
					color = "orange";
				} else {
					color = "green";
				}
				// return the formatted date as a key to the markedDates object
				return {
					[formattedDate]: {
						selected: true,
						selectedColor: color,
						disabled: false,
						eventId: event.event_id,
					},
				};
			}
		});
		// merge all the markedDates objects into one
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray);

		setMarkedDates(mergedMarkedDates);
		setLoading(false);
	}, [eventObjs]);

	/**
	 * Displays an alert with descriptions of the different colors used in the event calendar.
	 * @function infoPressed
	 * @description Shows an alert box containing information about the color codes used in the event calendar.
	 */
	const infoPressed = () => {
		// show alert that has descriptions of the different colors
		Alert.alert(
			"Event Calendar",
			"Green: Upcoming event with available capacity\nOrange: Upcoming event with no available capacity\nGrey: Past event",
			[
				{
					text: "OK",
					onPress: () => console.log("OK Pressed"),
				},
			],
			{ cancelable: false }
		);
	};

	/**
	 * Handle the selection of a specific day on the event calendar.
	 * If there is an event scheduled for the selected day, navigate to the EventDetailsHost screen with the details of the event.
	 * @param {Date} day - The selected day on the calendar.
	 * */
	const handleDateSelect = (day) => {
		const selectedDate = day;
		const { eventId } = markedDates[day];
		if (eventId) {
			const selectedEvent = eventObjs.find(
				(event) => event.event_id === eventId
			);
			console.log(selectedEvent);
			navigation.navigate("EventDetailsHost", {
				upcomingEvent: selectedEvent,
			});
		}
	};

	if (!eventObjs) {
		return (
			<View style={styles.titleContainer}>
				<Text style={styles.title}>There is no events to display</Text>
			</View>
		);
	}

	return (
		<>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>
					Calendar{" "}
					<Ionicons
						name="information-circle-outline"
						style={styles.informationIcon}
						// use infoPressed function to show alert
						onPress={() => {
							infoPressed();
						}}
					/>
				</Text>
			</View>
			<View style={{ zIndex: 5000 }}>
				<YearPicker onSelect={handleYearSelect} />
			</View>
			{loading ? (
				<ActivityIndicator
					size="large"
					color="#0000ff"
					animating={true}
					style={styles.activityIndicator}
				/>
			) : (
				<View style={styles.calendarContainer}>
					<Calendar
						onDateSelect={handleDateSelect}
						key={selected}
						markedDates={markedDates}
						current={selected}
					/>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	calendarContainer: {
		width: "100%",
		height: "100%", // or any other desired height
		zIndex: 1,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	title: {
		textAlign: "center",
		flex: 1,
		fontSize: 20,
		fontWeight: "bold",
	},
	iconContainer: {
		marginRight: 10,
	},
	informationIcon: {
		fontSize: 18,
		color: "grey",
	},
});
