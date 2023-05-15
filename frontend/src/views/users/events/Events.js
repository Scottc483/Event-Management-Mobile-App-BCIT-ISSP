// test
import { StyleSheet, ActivityIndicator } from "react-native";

import * as React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useState, useEffect } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { API_END_POINT } from "@env";

import MyEvents from "./MyEvents";
import Upcoming from "./Upcoming";
import { generateToken } from "../../../components/UserApiComponents";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function Events({ navigation }) {
  const user = useSelector((state) => state.user);
  const { user_id, ...userData } = user;
  const membership_status = userData.membership_status_id;

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [selectedFilterU, setSelectedFilterU] = useState("All");
  const [selectedFilterM, setSelectedFilterM] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [displayTab, setDisplayTab] = useState("");

  const [refresh, setRefresh] = useState(false);

  const today = new Date();

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			await getEvents();
			setIsLoading(false);
			setRefresh(false);
		}
		fetchData();
	}, [refresh]);

  useEffect(() => {
    applyFilters("upcoming", selectedFilterU);
    applyFilters("myevents", selectedFilterM);
  }, [events]);

  const handleSetDisplayTab = (tab) => {
    setDisplayTab(tab);
  };

  const handleFilterChange = (filterValue, type) => {
    if (type === "upcoming") {
      setSelectedFilterU(filterValue);
    } else {
      setSelectedFilterM(filterValue);
    }
    setRefresh(true);
  };

	const handleRefresh = () => {
		setRefresh(true);
    };

	const getEvents = async () => {

		const loyaltyCount = await getLoyaltyCount(user_id);
		
    // get all events and filter by event date greater than today
    try {
      const response = await axios.get(`${API_END_POINT}attendee/events/${user_id}`);
      const data = response.data;

      if (!data) {
        setEvents([]);
      }
      else {
        const eventData = data.filter(eventObj => new Date(eventObj.event_date) > today);
      await Promise.all(
        eventData.map(async (eventObj) => {
          await determineEventFlags(eventObj, loyaltyCount);
        })
      );
      setEvents(eventData);
      }
    } catch (error) {
      console.log(error);
    }
	};

  // get the number of past events this user has attended
	const getLoyaltyCount = async (userid) => {
		const response = await axios.get(`${API_END_POINT}loyalty/${userid}`);
		return response.data.eventCount;
	}
	
  // set flags for each event to indicate if the user is eligible for it, if it has 
  // any room left, if the user is already registered for it, or whether they are in
  // the waitlist for it
	const determineEventFlags = (eventObj, loyaltyCount) => {
		const eligibility = [];
		switch (eventObj.type_id) {
			case ("Bronze Tier"):
				eligibility.push("Bronze");
			case ("Silver Tier"):
				eligibility.push("Silver");
			case ("Gold Tier"):
				eligibility.push("Gold");
			default:
				break;
		}
		// Check if there is any capacity available in the event
		eventObj.hasRoom = parseInt(eventObj.number_of_attendees) < parseInt(eventObj.capacity) ? true : false;

		eventObj.capacityAvailable = parseInt(eventObj.capacity) - parseInt(eventObj.number_of_attendees);
		
		// User is already attending if status is "Registered"
		eventObj.isAttending = eventObj.attendee_status_id === "Registered"  ? true : false;

    // User is eligible if status is "Invited", or type is "Guest List"
    // and status is "Registered", or type is "Loyalty" and event count for
    // this user exceeds the count required for this event.
    // If none of these conditions are met, the user is eligible if their
    // membership status qualifies for this tier.

    eventObj.loyaltyCount = parseInt(loyaltyCount);
    if (eventObj.attendee_status_id === "Invited" ||
      (eventObj.type_id === "Guest List" &&
        eventObj.attendee_status_id === "Registered") ||
      (eventObj.type_id === "Loyalty" && eventObj.loyaltyCount >= parseInt(eventObj.loyalty_max))
    ) {
      eventObj.isEligible = true;
    } else {
      eventObj.isEligible = eligibility.includes(membership_status)
        ? true
        : false;
    }
    // User is in the waitlist if the query returned the user_id from the
    // waitlist table. If the user_id is null then no record was returned
    // from the waitlist table.
    eventObj.isInWaitlist = eventObj.user_id === null ? false : true;

    // set colors for the event icons, depending on the flags
    if (eventObj.isInWaitlist) {
      eventObj.color = "orange";
    } else if (eventObj.isAttending) {
      eventObj.color = "green";
    } else if (eventObj.isEligible) {
      eventObj.color = "black";
    } else {
      eventObj.color = "red";
    }
  };

  // apply the filter selected in the dropdown picker
  const applyFilters = (type, filterValue) => {
    if (type === "upcoming") {
      switch (filterValue) {
        case "All":
          setUpcomingEvents(events);
          break;
        case "Eligible":
          setUpcomingEvents(
            events.filter(
              (eventObj) => eventObj.isEligible || eventObj.isInWaitlist
            )
          );
          break;
        default:
          break;
      }
    } else {
      switch (filterValue) {
        case "All":
          setMyEvents(
            events.filter(
              (eventObj) =>
                eventObj.attendee_status_id === "Registered" ||
                eventObj.isInWaitlist
            )
          );
          break;
        case "Registered":
          setMyEvents(
            events.filter(
              (eventObj) => eventObj.attendee_status_id === "Registered"
            )
          );
          break;
        case "Waitlisted":
          setMyEvents(events.filter((eventObj) => eventObj.isInWaitlist));
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          animating={true}
          style={styles.activityIndicator}
        />
      ) : (
        <Tab.Navigator initialRouteName={`${displayTab}`}>
          <Tab.Screen
            name="Upcoming"
            component={Upcoming}
            initialParams={{
              eventObjs: upcomingEvents,
              handleFilterChange: handleFilterChange,
              filterValueU: selectedFilterU,
              filterValueM: selectedFilterM,
              handleRefresh: handleRefresh,
              handleSetDisplayTab: handleSetDisplayTab,
            }}
          />
          <Tab.Screen
            name="My Events"
            component={MyEvents}
            initialParams={{
              eventObjs: myEvents,
              handleFilterChange: handleFilterChange,
              filterValueU: selectedFilterU,
              filterValueM: selectedFilterM,
              handleRefresh: handleRefresh,
              handleSetDisplayTab: handleSetDisplayTab,
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
});
