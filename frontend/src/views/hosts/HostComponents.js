import axios from "axios";
import { API_END_POINT } from "@env";

/**
 * Fetches all events and their respective attendees and waitlist from the API.
 * @returns {Promise<Array>} An array of event objects, each containing information about the event,
 * its attendees, and whether it's upcoming or past.
 */
export const getEventsWithAttendees = async () => {
	const apiURL = API_END_POINT;

	try {
		const eventsResponse = await axios.get(`${apiURL}events`);
		const events = eventsResponse.data;

		const eventsWithAttendees = await Promise.all(
			events.map(async (event) => {
				const waitlistResponse = await axios.get(
					`${apiURL}waitlist/users/${event.event_id}`
				);

				const waitlist = waitlistResponse.data;
				const today = new Date();
				const eventDate = new Date(event.event_date);
				const type = eventDate >= today ? "upcoming" : "past";
				return {
					...event,
					waitlist,
					type,
				};
			})
		);
		return eventsWithAttendees;
	} catch (error) {
		console.log(error);
		const events = [];
		return events;
	}
};
