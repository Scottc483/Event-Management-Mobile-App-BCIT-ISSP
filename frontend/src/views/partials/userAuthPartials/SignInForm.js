import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	Button,
	SafeAreaView,
	View,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";



import { Logo } from "../../../components/Logo";
import { handleSignIn } from "../../../components/AuthComponents";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

const SignInForm = ({ route }) => {
	const { initialUsername, initialMessage } = route?.params ?? {};

	const [password, setPassword] = useState("");

	const [username, setUsername] = useState(initialUsername ?? "");
	const [formMessage, setFormMessage] = useState(initialMessage ?? "");

	// const { initialUsername, initialMessage } = route.params;

	const dispatch = useDispatch();

	// const [password, setPassword] = useState("");

	// const [username, setUsername] = useState(initialUsername ? initialUsername : "");
	// const [formMessage, setFormMessage] = useState(initialMessage ? initialMessage : "");

	const navigation = useNavigation();

	const handleSubmit = async () => {
		Keyboard.dismiss();
		setFormMessage("");
		if (!username || !password) {
			setFormMessage("Please enter a username and password");
			return;
		}
		try {
			Toast.show("Signing In...", {
				duration: Toast.durations.SHORT,
				position: -200,
			});
			const signInAttempt = await handleSignIn(username, password, dispatch);
			if (
				signInAttempt.success === false &&
				signInAttempt.confirmation === false
			) {
				navigation.navigate("ConfirmationForm", {
					initialUsername: username,
					confirmationMessage: signInAttempt.message,
				});
				return;
			}

			if (signInAttempt.success === false) {
				setFormMessage(signInAttempt.message);
				return;
			}
			return;
		} catch (error) {}
	};


	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
			enabled={true}
			onPress={Keyboard.dismiss}>
			<SafeAreaView>
				<View style={styles.viewContainer}>
					<View
						style={{
							display: "flex",
							width: "100%",
							alignItems: "center",
							justifyContent: "center",
							marginTop: 30,
						}}>
						<Logo />
					</View>

					{/* <Text style={styles.title}></Text> */}
					<Text style={styles.errorMessage}>
						{!!formMessage ? formMessage : null}
					</Text>
					<Text style={styles.confirmationMessage}>
						{!!initialMessage ? initialMessage : null}
					</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							defaultValue={username}
							onChangeText={setUsername}
							placeholder="Email"
							keyboardType="email-address"
						/>
						<TextInput
							style={styles.input}
							value={password}
							onChangeText={setPassword}
							placeholder="Password"
							secureTextEntry
						/>
					</View>
					<View style={[styles.buttonContainer, styles.signInButton]}>
						<TouchableOpacity
							onPress={() =>
								Keyboard.dismiss() &
								setFormMessage("") &
								setUsername("") &
								setPassword("") &
								navigation.navigate("ForgotPasswordForm", {
									initialUsername: username,
								})
							}>
							<Text style={styles.secondaryButton}>Forgot Password </Text>
						</TouchableOpacity>
						{/* <Button title="Sign In" onPress={handleSubmit} /> */}
						<TouchableOpacity onPress={handleSubmit}>
							<Text style={styles.primaryButton}>Sign In </Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.buttonContainer, styles.signUpButton]}>
						<TouchableOpacity
							onPress={() =>
								Keyboard.dismiss() &
								setFormMessage("") &
								setUsername("") &
								setPassword("") &
								navigation.navigate("SignUpForm")
							}>
							<Text style={styles.signUpText}>Don't have an account? </Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	confirmationMessage: {
		color: "#00a86b",
		fontSize: 16,
		marginBottom: 20,
	},
	errorMessage: {
		color: "#ff0000",
		fontSize: 16,
		marginBottom: 20,
	},

	container: {
		flex: 3,
		width: "100%",
		// maxWidth: 400,

		backgroundColor: "#fff",
		paddingHorizontal: 20,
	},
	viewContainer: {
		height: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		marginVertical: 30,
	},
	inputContainer: {
		marginBottom: 20,
	},

	input: {
		width: "100%",
		height: 40,
		marginVertical: 10,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	signInButton: {
		justifyContent: "space-between",
		marginBottom: 40,
	},
	signUpText: {
		fontSize: 16,
		color: "#888",
		alignItems: "center",
		textDecorationLine: "underline",
	},
	signUpButton: {
		justifyContent: "flex-end",
		marginTop: 20,
	},
	primaryButton: {
		fontSize: 15,
		color: "#fff",
		backgroundColor: "#159E31",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	secondaryButton: {
		fontSize: 13,
		textDecorationLine: "underline",
		color: "#888",
	},


	testButtons: {
		flex: 1,
	},
});

export default SignInForm;
