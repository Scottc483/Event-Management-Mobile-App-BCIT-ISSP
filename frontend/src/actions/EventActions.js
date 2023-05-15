import axios from "axios";
import { API_END_POINT } from '@env';

export async function registerForEvent(eventObj, userId) {
    // Register this user for this event
    try {
        const response = await axios.post(`${API_END_POINT}registration/${userId}/${eventObj.event_id}`, {status: eventObj.attendee_status_id || ""});
        if (response.data.status === 202) {
            return "Full";
        }
        if (response.data.status === 200) {
            return "Register";
        }
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }
}

export async function withdrawFromEvent(eventObj, userId) {
    // Withdraw this user from this event
    try {
        const response = await axios.post(`${API_END_POINT}withdraw/${userId}/${eventObj.event_id}`, {event_type: eventObj.type_id});
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }
}