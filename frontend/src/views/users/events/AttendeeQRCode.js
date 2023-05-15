import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { formatLongDate } from "../../../utilities/dates";
import { generateToken } from "../../../components/UserApiComponents";
import QRCode from "react-native-qrcode-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AttendeeQRCode({ route }) {

	const user = useSelector((state) => state.user);
	const { user_id, ...userData } = user;
	const firstName = userData.first_name;
	const lastName = userData.last_name;

	const eventObj = route.params.eventObj;
	
	
	const qrCodeValue = {
		user_id: user_id,
		event_id: eventObj.event_id,
	}

	return (
		<View style={styles.container}>
			<View style={styles.card}>
			<View style={styles.qrcode}>
				{/* <QRCode value="Hello, world!" size={200} /> */}
				<QRCode 
				value={eventObj ? JSON.stringify(qrCodeValue) : "Null Event"} 
				size={200}
				color="black"
				backgroundColor="white" />
			</View>
			<Text style={styles.title}>{firstName} {lastName}</Text>
			<Text style={styles.title}>{eventObj.event_name}</Text>
			<View style={styles.divider} />
			<Text style={styles.location}>{eventObj.event_location}</Text>
	
			<Text style={styles.date}> {formatLongDate(eventObj.event_date, true)}</Text>
			<Text style={styles.instructions}>Please present this QR code on arrival at the tournament as proof of registration.</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	date: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
	},
	location: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
	},
	divider: {
		width: "100%",
		borderBottomColor: "black",
		borderBottomWidth: 1,
		marginBottom: 10,
	},

	qrcode: {
		borderStyle: "solid",
		borderWidth: 5,
		borderColor: "white",

	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 20,
		marginBottom: 10,
	},
	instructions: {

		fontSize: 16,
		textAlign: "left",
		margin: 20,
	}
});
