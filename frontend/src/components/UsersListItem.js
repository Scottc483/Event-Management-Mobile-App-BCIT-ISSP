import { StyleSheet, Text, View } from "react-native";
import { formatLongDate } from "../utilities/dates";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * A component that represents a user item in a list.
 * It displays user information such as name, email, membership status, and date of signup.
 * It also shows an icon corresponding to the membership status.
 * By default, it includes an arrow icon indicating navigation to another screen, but it can be optionally hidden.
 * @param {object} userObj - The user object containing user information.
 * @param {boolean} showArrow - Determines whether to show the arrow icon for navigation (default: true).
 * @returns {JSX.Element} - The rendered UsersListItem component.
 */
export default function UsersListItem({ userObj, showArrow = true }) {
	const statusToIconNameMap = {
		Gold: "checkmark-circle-outline",
		Silver: "checkmark-circle-outline",
		Bronze: "checkmark-circle-outline",
		Rejected: "close-circle-outline",
		None: "alert-circle-outline",
	};

	const statusToIconColorMap = {
		Gold: "#e0a524",
		Silver: "#a39b98",
		Bronze: "#a85331",
		Rejected: "red",
		None: "black",
	};

	const iconName =
		statusToIconNameMap[userObj.membership_status_id] || "alert-circle-outline";
	const iconColor =
		statusToIconColorMap[userObj.membership_status_id] ||
		"alert-circle-outline";

	return (
		<View style={styles.card}>
			<View style={styles.icon}>
				<Ionicons name={iconName} size={36} color={iconColor} />
			</View>
			<View style={styles.userItem} key={`${userObj.user_id}`}>
				<Text style={[styles.boldText]}>
					{userObj.first_name} {userObj.last_name}
				</Text>
				<Text style={styles.text}>{userObj.email}</Text>
				<Text style={styles.text}>Status: {userObj.membership_status_id}</Text>
				<Text style={styles.text}>
					Member since: {`${formatLongDate(userObj.date_signed_up, false)}`}
				</Text>
				{/* Add Loyalty? */}
			</View>
			{showArrow === true && (
				<View>
					<Ionicons name="chevron-forward-outline" size={24} color="grey" />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: "row",
		width: "98%",
		backgroundColor: "#eee",
		//	backgroundColor: "#faeede",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: 10,
		margin: 5,
		padding: 5,
	},
	userItem: {
		flex: 1,
		flexDirection: "column",
		width: "100%",
		margin: 5,
		marginLeft: 10,
	},
	boldText: {
		fontWeight: "bold",
		fontSize: 16,
		// color: "#fff",
	},
	text: {
		fontSize: 12,
		// color: "#fff",
	},
});
