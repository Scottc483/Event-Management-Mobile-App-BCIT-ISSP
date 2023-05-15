import Checkbox from "expo-checkbox";
import axios from "axios";
import {
	View,
	Text,
	Button,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { API_END_POINT } from "@env";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";
import DropDownPicker from "react-native-dropdown-picker";
export default function InviteList({ navigation, route }) {
	const eventObj = route.params.eventObj;
	const eventId = eventObj.event_id;

	// fetch user list from backend
	const [users, setUsers] = useState([]);
	const [selected, setSelected] = useState([]);
	const [originalSelected, setoriginalSelected] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMembershipStatus, setSelectedMembershipStatus] =
		useState("All");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [updateFilter, setUpdateFilter] = useState(false);
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [memberships, setMemberships] = useState([]);
	const [icon, setIcon] = useState("close-circle-outline");

	/**
    Filters an array of users based on a search query
    @returns {Array} The filtered array of users
    */
	const filterUsers = () => {
		const filteredUsers = users.filter(
			(user) =>
				user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		return filteredUsers;
	};

	/**
    Filters users based on search query and membership status
    @param {string} status - The membership status to filter by, or "All" to include all users
    @returns {Promise} A Promise that resolves to the filtered users array
    */
	const filterMembership = async (status) => {
		// filter users based on search query
		const filteredUsersByQuery = filterUsers();
		if (status !== "All") {
			const dropdownFiltered = filteredUsersByQuery.filter(
				(user) => user.membership_status_id === status
			);
			setFilteredUsers(dropdownFiltered);
		} else {
			setFilteredUsers(filteredUsersByQuery);
		}
	};

	/**
	 * Handles the search button press event.
	 * Filters the membership list based on the selected membership status.
	 * Sets the search icon to "close-circle".
	 * @returns {void}
	 */
	const handleSearchPress = () => {
		filterMembership(selectedMembershipStatus);
		setIcon("close-circle");
	};

	/**
	 * Handles the membership search query event.
	 * Sets the search query to the entered value.
	 * Sets the search icon to "close-circle".
	 * @param {string} query - The search query to filter the membership list.
	 * @returns {void}
	 */
	const handleSearchQuery = (query) => {
		setSearchQuery(query);
		setIcon("close-circle");
	};

	/**
	 * Handles the membership status filter change event.
	 * Sets the selected membership status to the selected item.
	 * Sets the search icon to "close-circle".
	 * @param {Object} item - The selected membership status item to filter the membership list.
	 * @returns {void}
	 */
	const handleMembershipFilterChange = (item) => {
		setSelectedMembershipStatus(item);
		setIcon("close-circle");
	};

	useEffect(() => {
		filterMembership(selectedMembershipStatus);
	}, [selectedMembershipStatus, searchQuery]);

	useEffect(() => {
		/**
		 * Fetches the list of users from the backend.
		 * Filters out users with membership status "Rejected" and "None".
		 * Sets the users state to the filtered list of users.
		 * Sets the filteredUsers state to the filtered list of users.
		 * @returns {void}
		 */
		const getUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/users`);
			const data = response.data;
			// get rid of Rejected and None users and host
			const filteredData = await data.filter(
				(user) =>
					user.membership_status_id !== "Rejected" &&
					user.membership_status_id !== "None" &&
					user.role_id === "Attendee"
			);
			setUsers(filteredData);
			setFilteredUsers(filteredData);
		};
		/**
		 * Fetches the membership status from the API and updates the state with the edited membership statuses.
		 * @returns {Promise} A Promise that resolves to the edited membership statuses
		 * */
		const getFilteredMemberships = async () => {
			const apiURL = API_END_POINT;
			const membershipsResponse = await axios.get(`${apiURL}membership`);
			const membershipStatuses = membershipsResponse.data.membershipStatuses;
			// get rid of Rejected and None and add All
			const removed = membershipStatuses.filter(
				(membership) =>
					membership.membership_status_id !== "Rejected" &&
					membership.membership_status_id !== "None"
			);
			const edited = [{ membership_status_id: "All" }, ...removed];
			setMemberships(edited);
		};

		/**
		 * Fetches the list of users invited to an event and sets the state of selected and originalSelected based on the retrieved data
		 * @returns {Promise} A Promise that resolves to the selected user IDs
		 */
		const getInvitedUsers = async () => {
			const apiURL = API_END_POINT;
			const response = await axios.get(`${apiURL}/attendee/users/${eventId}`);
			const data = response.data;
			// create a list of user_ids that are already invited
			const users = data.map((user) => user.user_id);
			if (users) {
				setSelected(users);
				setoriginalSelected(users);
			} else {
				setSelected([]);
				setoriginalSelected([]);
			}
		};

		getUsers();
		getFilteredMemberships();
		getInvitedUsers();

		setIsPickerVisible(true);
		setLoading(false);
	}, []);

	// count how many users are selected
	const numSelected = selected.length;

	/**
	 * Handles selection of a user.
	 * @param {string} user_id - ID of the user to select.
	 * @returns {void} Nothing is returned.
	 * */
	const handleSelect = (user_id) => {
		setSelected((selected) => {
			// if user_id is already in selected, remove it
			if (selected.includes(user_id)) {
				return selected.filter((id) => id !== user_id);
			}
			// otherwise, add it to selected
			return [...selected, user_id];
		});
	};

	/**
    Handles submission of selected attendees for an event
    @async
    @function handleSubmit
    @returns {void}
    */
	const handleSubmit = async () => {
		const apiURL = API_END_POINT;
		// send selected to backend
		// filter out the users that are no longer selected
		const unselected = originalSelected.filter(
			(user_id) => !selected.includes(user_id)
		);
		if (unselected.length > 0) {
			unselected.map(async (user_id) => {
				await axios.delete(`${apiURL}/attendee/${eventId}/${user_id}`);
			});
		}

		// filter out the users that are selected but not in the original selected list
		const invited = selected.filter(
			(user_id) => !originalSelected.includes(user_id)
		);
		if (invited.length > 0) {
			invited.map(async (user_id) => {
				await axios.post(`${apiURL}/attendee/${eventId}/${user_id}`, {
					status: "Invited",
				});
			});
		}

		// navigate back to the event details page
		const attendeesResponse = await axios.get(
			`${apiURL}attendee/users/${eventObj.event_id}`
		);
		const waitlistResponse = await axios.get(
			`${apiURL}waitlist/users/${eventObj.event_id}`
		);
		const attendees = attendeesResponse.data;
		const waitlist = waitlistResponse.data;
		navigation.navigate("EventDetailsHost", {
			upcomingEvent: {
				...eventObj,
				attendees,
				waitlist,
			},
		});
	};

	// if users or eventObj is not loaded, show loading indicator
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
		<View style={styles.container}>
			{isPickerVisible && (
				<View style={styles.header}>
					{/* <Text style={styles.filterTitle}>Filter & Search </Text> */}

					<Text style={styles.title}>Membership Status</Text>
					<View style={{ zIndex: 2000 }}>
						<DropDownPicker
							style={styles.dropdown}
							open={open}
							value={selectedMembershipStatus}
							items={memberships.map((item) => ({
								label: item.membership_status_id,
								value: item.membership_status_id,
							}))}
							setOpen={setOpen}
							setValue={handleMembershipFilterChange}
							listMode="SCROLLVIEW"
							scrollViewProps={{
								nestedScrollEnabled: true,
							}}
							dropDownContainerStyle={{
								position: "relative",
								top: 0,
							}}
						/>
					</View>

					<View style={styles.searchBar}>
						<SearchBar
							value={searchQuery}
							onChangeText={(query) => {
								handleSearchQuery(query);
								filterUsers(searchQuery);
								handleSearchPress();
							}}
							onSubmitEditing={handleSearchPress}
							// onPress={handleSearchPress}
						/>

						<ClearFilterButton
							onPress={() => {
								setSearchQuery("");
								setSelectedMembershipStatus("All");
								setFilteredUsers(users);
								setIcon("close-circle-outline");
							}}
							icon={icon}
						/>
					</View>
				</View>
			)}

			<View style={styles.eventInfoContainer}>
				<Text style={styles.eventTitle}>{eventObj.event_name}</Text>
				<Text style={styles.listNums}>
					Capacity {numSelected}/{eventObj.capacity}
				</Text>
			</View>

			<Text style={styles.title}>Invite the following:</Text>
			<FlatList
				data={filteredUsers}
				renderItem={({ item }) => (
					<View style={styles.userContainer}>
						<Text
							onPress={() => navigation.navigate("UserDetails", { user: item })}
							style={styles.userName}>
							{item.first_name} {item.last_name}
						</Text>
						<Checkbox
							value={selected.includes(item.user_id)}
							onValueChange={() => handleSelect(item.user_id)}
							style={styles.checkbox}
						/>
					</View>
				)}
			/>
			<View style={styles.buttonContainer}>
				{/* <Button title="Save" onPress={handleSubmit} /> */}
				<TouchableOpacity onPress={handleSubmit} style={styles.button}>
					<Text style={styles.buttonText}>Save</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 20,
		paddingTop: 20,
	},

	filterTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20,
	},
	memberShipContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	dropdown: {
		width: 150,
		marginBottom: 5,
	},
	searchBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		marginRight: 10,
	},
	eventInfoContainer: {
		marginBottom: 5,
	},
	eventTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	listNums: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20,
	},

	userContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	userName: {
		flex: 1,
		fontSize: 16,
	},
	checkbox: {
		marginRight: 10,
	},
	buttonContainer: {
		marginTop: 20,
	},
	header: {
		marginBottom: 20,
	},

	button: {
		// width: 300,
		height: 50,
		backgroundColor: "#159E31",
		justifyContent: "center",
		textAlign: "center",
		marginBottom: 20,
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: 500,
		fontSize: 15,
	},
});
