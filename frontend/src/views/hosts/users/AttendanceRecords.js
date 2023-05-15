import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";
import DropDownPicker from "react-native-dropdown-picker";
import { formatLongDate } from "../../../utilities/dates";

/**
 * AttendanceRecords component displays a list of attendance records for a user. The component fetches attendance records for a user from an API and filters the records based on a selected filter option.
 * @param {Object} route - The route object contains the user object as a parameter
 * @returns {JSX.Element} - Rendered component tree
 */
export default function AttendanceRecords({ route }) {
	const [eventObjs, setEventObjs] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState("Upcoming");
	const [filteredEventObjs, setFilteredEventObjs] = useState([]);
	const [open, setOpen] = useState(false);
	const user = route.params.user;

	/**
	 * Fetches the attendance records of a user from the API and sets it to the component state
	 * @returns {void}
	 */
	const handleGetAttendanceRecords = async () => {
		const apiURL = API_END_POINT;
		const response = await axios.get(
			`${apiURL}attendee/events/${user.user_id}`
		);
		const data = response.data;
		setEventObjs(data);
	};

	/**
	 * Filters the attendance records based on the selected filter option and updates the state with the filtered data
	 * @returns {void}
	 */
	const filterRecords = () => {
		if (selectedFilter === "Attended") {
			setFilteredEventObjs(
				eventObjs.filter(
					(eventObj) => eventObj.attendance_status_id === "Attended"
				)
			);
		} else if (selectedFilter === "Upcoming") {
			setFilteredEventObjs(
				eventObjs.filter(
					(eventObj) => eventObj.attendance_status_id === "Unknown"
				)
			);
		} else if (selectedFilter === "No Show") {
			setFilteredEventObjs(
				eventObjs.filter(
					(eventObj) => eventObj.attendance_status_id === "No Show"
				)
			);
		}
	};

	/**
	 * Handle the change of the selected filter value
	 * @param {string} value - The value of the selected filter
	 * @returns {void}
	 */
	const handleFilterChange = (value) => {
		setSelectedFilter(value);
	};

	useEffect(() => {
		/**
		 * Fetches attendance records for a user and sets it to the component state
		 * @returns {void}
		 */
		const fetchData = async () => {
			await handleGetAttendanceRecords();
		};
		fetchData();
	}, [user]);

	useEffect(() => {
		filterRecords();
	}, [selectedFilter, eventObjs]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{user.first_name} {user.last_name}
			</Text>
			<View style={[{ paddingTop: 20 }, styles.eventInfoContainer]}>
				<View style={{ zIndex: 2000 }}>
					<DropDownPicker
						open={open}
						items={[
							{ label: "Attended", value: "Attended" },
							{ label: "Upcoming", value: "Upcoming" },
							{ label: "No Show", value: "No Show" },
						]}
						value={selectedFilter}
						containerStyle={{ height: 40 }}
						style={{ backgroundColor: "#fafafa" }}
						itemStyle={{ justifyContent: "flex-start" }}
						dropDownStyle={{ backgroundColor: "#fafafa" }}
						onChangeItem={(item) => handleFilterChange(item.value)}
						setOpen={setOpen}
						setValue={setSelectedFilter}
					/>
				</View>

				<FlatList
					data={filteredEventObjs}
					keyExtractor={(eventObj) => eventObj.event_id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={styles.eventItem} key={`${item.event_id}`}>
								<Text style={styles.boldText}>{item.event_name}</Text>
								<Text>{`${formatLongDate(item.event_date, true)}`}</Text>
								<Text>
									{item.attendance_status_id === "Unknown"
										? `${item.attendee_status_id}`
										: `${item.attendance_status_id}`}
								</Text>
							</View>
						</View>
					)}
					style={{ paddingTop: 20 }}
				/>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	nameInput: {
		paddingBottom: 8,
		fontSize: 24,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},

	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		padding: 20,
	},
	text: {
		fontSize: 16,
		textAlign: "center",
		padding: 10,
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
		marginTop: 5,
		flexDirection: "column",
		justifyContent: "center",
		rowGap: 10,
		width: "100%",
	},
	eventInfoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 10,
	},
	label: {
		fontWeight: "bold",
	},

	buttonLabel: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 15,
	},
	value: {},

	underline: {
		textDecorationLine: "underline",
	},
	button: {
		marginTop: 20,
		backgroundColor: "#607D8B",
		padding: 10,
		borderRadius: 5,
		textAlign: "center",
		color: "white",
	},
	card: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#eee",
		//	backgroundColor: "#faeede",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: 10,
		margin: 5,
		padding: 5,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
	},
});
