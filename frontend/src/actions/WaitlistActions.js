import axios from "axios";
import { API_END_POINT } from '@env';

export async function waitlistForEvent(eventObj, userId)
{
    // If joining the waitlist, create waitlist record
    try {
        const response = await axios.post(`${API_END_POINT}waitlist/${eventObj.event_id}/${userId}`);
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }	
}

export async function removeFromEventWaitlist(eventObj, userId)
{
    // If removing from waitlist, delete waitlist record
    try {
        const response = await axios.delete(`${API_END_POINT}waitlist/${eventObj.event_id}/${userId}`);
    } catch (error) {
        console.error(error); // log the error for debugging
        // handle the error here
    }	
}