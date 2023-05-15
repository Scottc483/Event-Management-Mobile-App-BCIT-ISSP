import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { CalendarList } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import Calendar from "../../../components/Calendar";

export default function EventsCal({ navigation, route }) {
	// set today for selected
	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;
	const {
		eventObjs,
		handleFilterChange,
		type,
		filterValueU,
		filterValueM,
		handleRefresh,
		handleSetDisplayTab,
	} = route.params;
	const [selected, setSelected] = useState(
		new Date().toISOString().slice(0, 10)
	);
	const [events, setEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const contextEvent = useSelector((state) => state.event);
	let dateColor = "blue";
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if(!eventObjs) {
			return;
		}
		setEvents(eventObjs);
	}, []);

	useEffect(() => {
		const eventDatesArray = events.map((event) => {
			// check the date is valid
			if (event.event_date && Date.parse(event.event_date)) {
				const originalDate = new Date(event.event_date);
				// format the date to YYYY-MM-DD
				const formattedDate = originalDate.toISOString().slice(0, 10);
				// return the formatted date as a key to the markedDates object
				if (event.isInWaitlist) {
					dateColor = "orange";
				} else if (event.isAttending) {
					dateColor = "green";
				} else if (event.isEligible) {
					dateColor = "grey";
				} else {
					dateColor = "red";
				}
				return {
					[formattedDate]: {
						selected: true,
						selectedColor: dateColor,
						disabled: false,
						eventId: event.event_id,
					},
				};
			} else {
				return null; // invalid date
			}
		});

		// merge all the markedDates objects into one
		const mergedMarkedDates = Object.assign({}, ...eventDatesArray);
		setMarkedDates(mergedMarkedDates);
		setLoading(false);
	}, [events]);

	// when a day is pressed, navigate to the event details screen
	const handleDateSelect = (day) => {
		const { eventId } = markedDates[day];
		if (eventId) {
			const selectedEvent = events.find((event) => event.event_id === eventId);
			navigation.navigate("EventDetails", {
				eventObj: selectedEvent,
				userId: user_id,
				navigation: navigation,
				handleRefresh: handleRefresh,
				type: type,
				handleSetDisplayTab: handleSetDisplayTab,
			});
		}
	};

	const infoPressed = () => {
		// show alert that has descriptions of the different colors
		Alert.alert(
			"Event Calendar",
			"Blue: Eligible to register\nGreen: Registered\nOrange: In Waitlist\nRed: Not Available",
			[
				{
					text: "OK",
					onPress: () => console.log("OK Pressed"),
				},
			],
			{ cancelable: false }
		);
	};
	if(!eventObjs) {
		return(
			<View style={styles.titleContainer}>
				<Text style={styles.title}>
					There is no events to display
				</Text>
			</View>
		)
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
		marginTop: 10,
		width: "100%",
		height: "100%",
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
