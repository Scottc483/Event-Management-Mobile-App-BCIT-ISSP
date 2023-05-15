import {
	View,
	Text,
	Button,
	FlatList,
	LogBox,
	SectionList,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Keyboard,
} from "react-native";

import { ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_END_POINT } from "@env";

import UserDetails from "./UserDetails";
import SearchBar from "../../partials/hostPartials/SearchBar";
import ClearFilterButton from "../../partials/hostPartials/ClearFilterButton";
import UsersListItem from "../../../components/UsersListItem";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
]);

export default function Users({ navigation }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [editedMemberships, setEditedMemberships] = useState([]);
	const [selectedMembershipStatus, setSelectedMembershipStatus] =
		useState("All");
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [updateFilter, setUpdateFilter] = useState(false);
	const [selectedRole, setSelectedRole] = useState("Attendee");
	const [icon, setIcon] = useState("close-circle-outline");

	const roles = [{ role_id: "Attendee" }, { role_id: "Host" }];

	/**
	 * Refreshes the page by fetching the list of users again and resetting selected membership status,
	 * search query, and icon.
	 * @returns {Promise<void>}
	 */
	const handlePageRefresh = async () => {
		const newUsers = await getUsers();
		setUsers(newUsers);
		setSelectedMembershipStatus("All");
		setSearchQuery("");
		setIcon("close-circle-outline");
	};

	/**
	 * Updates the search query state when the user types in the search bar
	 * @param {string} query - The search query entered by the user
	 * @returns {void}
	 */
	const handleSearchQuery = (query) => {
		setSearchQuery(query);
		setIcon("close-circle");
	};

	/**
	 * Dismisses the keyboard when the user submits their search query
	 * @returns {void}
	 */
	const handleSearchSubmit = () => {
		Keyboard.dismiss();
	};

	/**
	 * Clears the search query and selected membership status, and resets the icon state
	 * @returns {void}
	 */
	const handleClearFilter = () => {
		setSearchQuery("");
		setSelectedMembershipStatus("All");
		setIcon("close-circle-outline");
	};

	/**
	 * Updates the selected role state when the user selects a role from the dropdown menu
	 * @param {string} itemValue - The value of the selected role
	 * @returns {void}
	 */
	const handleSelectRole = (itemValue) => {
		setSelectedRole(itemValue);
	};

	/**
	 * Filter users based on search query and selected membership status and role.
	 * If selectedMembershipStatus is "All", it will filter users only based on role and searchQuery.
	 * Otherwise, it will filter users based on membership status, role, and searchQuery.
	 * @returns {void}
	 */
	const filterUsers = () => {
		if (selectedMembershipStatus === "All") {
			setFilteredUsers(
				users.filter(
					(user) =>
						user.role_id === selectedRole &&
						(user.first_name
							.toLowerCase()
							.includes(searchQuery.toLowerCase().trim()) ||
							user.last_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase().trim()) ||
							user.email
								.toLowerCase()
								.includes(searchQuery.toLowerCase().trim()))
				)
			);
		} else {
			setIcon("close-circle");
			setFilteredUsers(
				users.filter(
					(user) =>
						user.membership_status_id === selectedMembershipStatus &&
						user.role_id === selectedRole &&
						(user.first_name
							.toLowerCase()
							.includes(searchQuery.toLowerCase().trim()) ||
							user.last_name
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) ||
							user.email
								.toLowerCase()
								.includes(searchQuery.toLowerCase().trim()))
				)
			);
		}
	};

	/**
	 * A function that retrieves users from an API endpoint.
	 * @async
	 * @returns {Array} An array of users retrieved from the API endpoint.
	 */
	const getUsers = async () => {
		const apiURL = API_END_POINT;
		try {
			const usersResponse = await axios.get(`${apiURL}users`);
			return usersResponse.data;
		} catch {
			console.log("error");
			return [];
		}
	};
	/**
	 * Returns an array of membership statuses that can be used as filter options.
	 * If the API call fails, it returns an array with a single "All" option.
	 * @returns {Array} An array of membership status objects with a "membership_status_id" property.
	 */
	const getFilteredMemberships = async () => {
		const apiURL = API_END_POINT;
		try {
			const membershipsResponse = await axios.get(`${apiURL}membership`);
			const membershipStatuses = membershipsResponse.data.membershipStatuses;
			const edited = [{ membership_status_id: "All" }, ...membershipStatuses];
			return edited;
		} catch {
			console.log("error");
			return [{ membership_status_id: "All" }];
		}
	};

	/**
	 * Function that gets the filtered membership statuses and users using Promise.all.
	 * It then sets the state variables editedMemberships, users, and updateFilter.
	 * @returns {void}
	 */
	const handleGetEditedMemberships = async () => {
		const [edited, users] = await Promise.all([
			getFilteredMemberships(),
			getUsers(),
		]);
		setEditedMemberships(edited);
		setUsers(users);
		setUpdateFilter(true);
	};

	/**
	 * Handle changes to the selected membership status filter.
	 * @param {string} itemValue - The selected value of the membership filter.
	 * @param {number} itemIndex - The index of the selected value in the membership filter.
	 */
	const handleMembershipFilterChange = (itemValue, itemIndex) => {
		setSelectedMembershipStatus(itemValue);
	};

	useEffect(() => {
		/**
		 * Fetches filtered memberships and users, and sets the state for edited memberships and users.
		 * Also sets the state for displaying the membership status filter picker.
		 */
		const fetchData = async () => {
			await handleGetEditedMemberships();
			setIsPickerVisible(true);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (users && users.length > 0) {
			filterUsers();
		}
	}, [selectedMembershipStatus, users]);

	useEffect(() => {
		if (updateFilter) {
			handleMembershipFilterChange(selectedMembershipStatus);
			setUpdateFilter(false);
		}
	}, [updateFilter]);

	useEffect(() => {
		if (users && users.length > 0) {
			filterUsers();
		}
	}, [searchQuery, selectedRole]);

	return (
		<View style={styles.container}>
			{isPickerVisible ? (
				<>
					<View style={styles.header}>
						<Text style={styles.title}>Filter by membership:</Text>
						<View style={{ zIndex: 2000 }}>
							<DropDownPicker
								open={open}
								value={selectedMembershipStatus}
								items={editedMemberships.map((item) => ({
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
									// backgroundColor: "#91C4D9",
								}}
								// style={{ backgroundColor: "#91C4D9" }}
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								gap: 20,
								justifyContent: "center",
							}}>
							{roles.map((role, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handleSelectRole(role.role_id)}
									style={[
										styles.radioButton,
										{
											backgroundColor:
												selectedRole === role.role_id ? "#4CAF50" : "#fff",
										},
									]}>
									<Text
										style={{
											color: selectedRole === role.role_id ? "#fff" : "#000",
										}}>
										{`${role.role_id}s`}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						<View
							style={{
								flexDirection: "row",
								marginVertical: 10,
								paddingHorizontal: 20,
							}}>
							<SearchBar
								value={searchQuery}
								onChangeText={(query) => {
									handleSearchQuery(query);
									filterUsers(searchQuery);
								}}
								onSubmitEditing={handleSearchSubmit}
							/>
							<ClearFilterButton onPress={handleClearFilter} icon={icon} />
						</View>
					</View>
					{filteredUsers && filteredUsers.length > 0 ? (
						<>
							<FlatList
								style={styles.list}
								data={filteredUsers}
								keyExtractor={(item) => `${item.user_id}`}
								renderItem={({ item }) => (
									<View>
										<TouchableOpacity
											onPress={() =>
												navigation.navigate("UserDetails", {
													user: item,
													handleRefresh: handlePageRefresh,
												})
											}>
											<UsersListItem userObj={item} />
										</TouchableOpacity>
									</View>
								)}
							/>
						</>
					) : (
						<View style={{ alignItems: "center", justifyContent: "center" }}>
							<Text style={styles.title}>No users found</Text>
						</View>
					)}
				</>
			) : (
				<View style={[styles.container, { justifyContent: "center" }]}>
					<ActivityIndicator
						size="large"
						color="#0000ff"
						animating={true}
						style={styles.activityIndicator}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 5,
		paddingRight: 5,
		backgroundColor: "#fff",
		width: "100%",
		// maxWidth: 400,
		paddingTop: 20,
	},
	header: {
		flexDirection: "column",
		rowGap: 10,
		paddingLeft: 10,
		paddingRight: 10,
	},

	list: {
		paddingTop: 10,
	},

	title: {
		marginVertical: 10,
		fontWeight: "bold",
	},

	radioButton: {
		padding: 10,
		marginVertical: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#ccc",
		width: 100,
		alignItems: "center",
		color: "#fff",
	},
});
