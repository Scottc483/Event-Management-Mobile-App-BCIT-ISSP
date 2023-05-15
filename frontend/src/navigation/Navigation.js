// Imports
import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";


import jwt_decode from "jwt-decode";
// View imports
import MainProfile from "../../src/views/users/profile/MainProfile";
import AuthForm from "../../src/views/AuthForm";
import EventDetails from "../../src/views/users/events/EventDetails";
import AttendeeQRCode from "../../src/views/users/events/AttendeeQRCode";
import EventsList from "../../src/views/users/events/EventsList";
import EventsCal from "../../src/views/users/events/EventsCal";


import Events from "../../src/views/users/events/Events";
import PendingMembership from "../views/users/profile/PendingMembership";
import RejectedMembership from "../views/users/profile/RejectedMembership";

import HostMenu from "../../src/views/hosts/events/HostMenu";
import CreateEvent from "../../src/views/hosts/events/CreateEvent";
import EventsHost from "../../src/views/hosts/events/EventsHost";
import EventDetailsHost from "../../src/views/hosts/events/EventDetailsHost";


import EventWaitlist from "../views/hosts/events/EventWaitlist";
import Attendance from "../views/hosts/events/Attendance";
import EventsListHost from "../views/hosts/events/EventsListHost";

import InviteList from "../../src/views/hosts/events/InviteList";
import Users from "../views/hosts/users/Users";
import UserDetails from "../views/hosts/users/UserDetails";
import AttendanceRecords from "../views/hosts/users/AttendanceRecords";

// Component imports
// import store from "../../src/components/store/index";
import EventListItem from "../../src/components/EventListItem";
import ProfileNavButton from "../../src/components/ProfileNavButton";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";
import {
	getUserData,
	removeCognitoTokens,
	amplifyRefreshTokens,
} from "../components/UserApiComponents";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Amplify imports
import { Amplify, Hub, Auth } from "aws-amplify";
import config from "../../src/aws-exports";
Amplify.configure(config);
import { handleAutoSignIn } from "../components/AuthComponents";

// Navigation stack
const Stack = createNativeStackNavigator();

/**
 * Navigation component renders the navigation stack and listens to auth events using Amplify Hub.
 * When user is signed in, it sets `authenticated` state to true and adds Bearer token to axios headers.
 * When user signs out, it clears the async storage and sets `authenticated` state to false.
 * @returns {JSX.Element} - Rendered component tree
 */
/**
 * Navigation component renders the navigation stack and listens to auth events using Amplify Hub.
 * When user is signed in, it sets `authenticated` state to true and adds Bearer token to axios headers.
 * When user signs out, it clears the async storage and sets `authenticated` state to false.
 * @returns {JSX.Element} - Rendered component tree
 */
const Navigation = () => {
	const [authenticated, setAuthenticated] = React.useState(false);
	const [user, setUser] = React.useState(null);
	const dispatch = useDispatch();
	const [refreshMessage, setRefreshMessage] = React.useState("");
	const [autoLoginLoading, setAutoLoginLoading] = React.useState(false);

	axios.interceptors.request.use(
		async (config) => {
			let expiration = 0;
			// Do something before request is sent
			const userToken = await AsyncStorage.getItem("accessToken");
			if (userToken) {
				try {
					expiration = await jwt_decode(userToken).exp;
					//compare expiration to now If expiration is in 10 minutes or less, refresh token
					if (
						(expiration !== 0 && expiration - Date.now() / 1000 < 600) ||
						expiration - Date.now() / 1000 < 0
					) {
						const refreshResult = amplifyRefreshTokens();
						if (
							refreshResult.success == false &&
							refreshResult.message == "NotAuthorizedException"
						) {
							removeCognitoTokens();
							setRefreshMessage(
								"Your session has expired. Please log in again."
							);
							setAuthenticated(false);
						}
					}
				} catch (error) {
					// console.log("ERROR", error);
					return Promise.reject(error);
				}
			}

			return config;
		},
		(error) => {
			// console.log("ERROR", error);
			return Promise.reject(error);
		}
	);

	useEffect(() => {
		// Check if user is signed in async
		const checkAuth = async () => {
			try {
				const autoSignInStatus = await handleAutoSignIn(dispatch);
				setAutoLoginLoading(true);
				if (!autoSignInStatus) {
					setAuthenticated(false);
					setAutoLoginLoading(false);
					return;
				}
				if (autoSignInStatus.success == true) {

					const userToken = await AsyncStorage.getItem("accessToken");
					console.log("userToken", userToken)
					axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${userToken}`;
					setAuthenticated(true);
					setAutoLoginLoading(false);
				}
			} catch (e) {
				// console.log("ERROR NAVIGATION", e);
				setAuthenticated(false);
				setAutoLoginLoading(false);
			}
		};
		checkAuth();
		// Listen to "auth" events using Amplify Hub
		Hub.listen("auth", (data) => {
			switch (data.payload.event) {
				case "signIn":
					// Get user data from database
					try {
						const fetchData = async () => {
							const userAuth = await Auth.currentSession();
							const userEmail = userAuth.idToken.payload.email;
							const userData = await getUserData(userEmail, dispatch);
							
							if (userData.success == true) {
								// console.log("userData", userData);
								const userToken = await AsyncStorage.getItem("accessToken");
								axios.defaults.headers.common[
									"Authorization"
								] = `Bearer ${userToken}`;
								setAuthenticated(true);
							} else {
								setAuthenticated(false);
								setRefreshMessage(
									"Error Retrieving User Data. Please try again, Or contact support."
								);
							}
						};
						fetchData();
					} catch (e) {
						// console.log("ERROR NAVIGATION", e);
						setAuthenticated(false);
						setRefreshMessage(
							"Error Retrieving User Data. Please try again, Or contact support."
						);
					}
					// When user signs in, set authenticated to true
					break;
				case "signOut":
					//CLEAR ASYNC STORAGE
					removeCognitoTokens();
					// When user signs out, set authenticated to false
					setAuthenticated(false);
					break;
			}
		});
	}, []);

	const contextUser = useSelector((state) => state.user);

	useEffect(() => {
		if (contextUser) {
			setUser(contextUser);
		}
	}, [contextUser]);

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						backgroundColor: "#159E31",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					headerRight: () => <ProfileNavButton />,
				}}>
				{autoLoginLoading ? (
					<Stack.Screen
						name="Loading"
						component={LoadingScreen}
						options={{ title: "" }}
					/>
				) : authenticated == false ? (
					<Stack.Screen
						name="AuthForm"
						options={{
							headerShown: false,
							headerRight: () => "",
						}}
						initialParams={{
							refreshMessage: refreshMessage !== "" ? refreshMessage : "",
						}}>
						{() => <AuthForm />}
					</Stack.Screen>
				) : (
					<>
						{(user &&
							user !== null &&
							user.role_id !== "Host" &&
							user.membership_status_id === "None") ||
						user.membership_status_id === "Rejected" ? (
							<Stack.Screen
								name={
									user.membership_status_id === "None"
										? "PendingMembership"
										: "RejectedMembership"
								}
								component={
									user.membership_status_id === "None"
										? PendingMembership
										: RejectedMembership
								}
								options={{ headerRight: () => "" }}
							/>
						) : (
							<>
								{user.role_id === "Host" ? (
									<Stack.Screen
										name="HostMenu"
										component={HostMenu}
										options={{
											title: "Menu",
										}}
									/>
								) : (
									<Stack.Screen name="Events" component={Events} />
								)}
								<Stack.Screen
									name="MainProfile"
									component={MainProfile}
									options={
										({ headerRight: () => "" }, { title: "User Profile" })
									}
								/>
								<Stack.Screen
									name="EventsList"
									component={EventsList}
									options={{
										title: "Events",
									}}
								/>
								<Stack.Screen
									name="EventsCal"
									component={EventsCal}
									options={{
										title: "Calendar",
									}}
								/>
								<Stack.Screen name="EventListItem" component={EventListItem} />
								<Stack.Screen
									name="EventDetails"
									component={EventDetails}
									options={{
										title: "Event Details",
									}}
								/>
								{/* <Stack.Screen name="Confirmation" component={Confirmation} /> */}
								<Stack.Screen
									name="AttendeeQRCode"
									component={AttendeeQRCode}
									options={{
										title: "QR Code",
									}}
								/>
								<Stack.Screen
									name="ProfileNavButton"
									component={ProfileNavButton}
								/>
								<Stack.Screen
									name="CreateEvent"
									component={CreateEvent}
									options={{
										title: "Create Event",
									}}
								/>
								<Stack.Screen
									name="EventsHost"
									component={EventsHost}
									options={{
										title: "Events",
									}}
								/>
								<Stack.Screen
									name="EventDetailsHost"
									component={EventDetailsHost}
									options={{
										title: "Event Details",
									}}
								/>
								<Stack.Screen
									name="EventsListHost"
									component={EventsListHost}
									options={{
										title: "Events",
									}}
								/>
								<Stack.Screen
									name="InviteList"
									component={InviteList}
									options={{
										title: "Event Invitations",
									}}
								/>
								<Stack.Screen name="Users" component={Users} />
								<Stack.Screen
									name="UserDetails"
									component={UserDetails}
									options={{
										title: "User Details",
									}}
								/>
								<Stack.Screen
									name="EventWaitlist"
									component={EventWaitlist}
									options={{ title: "Waitlist" }}
								/>
								<Stack.Screen
									name="Attendance"
									component={Attendance}
									options={{
										title: "Event Attendance",
									}}
								/>
								<Stack.Screen
									name="AttendanceRecords"
									component={AttendanceRecords}
									options={{
										title: "Event Attendance",
									}}
								/>
							</>
						)}
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
