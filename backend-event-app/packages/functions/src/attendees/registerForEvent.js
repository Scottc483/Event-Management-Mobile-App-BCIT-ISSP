import { getCapacity, editAttendeeStatus, createAttendee,
         editEventCapacity, createWaitlist } from "@backend-event-app/core/database";

export async function main(event) {

    try {
        const userId = event.pathParameters.userId;
        const eventId = event.pathParameters.eventId;

        const attendee_status = JSON.parse(event.body).status;
    
        if (!eventId || !userId || (attendee_status === null)) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing or invalid parameters' })
          };
        }
    
        // check if event is full. If it is, add user to waitlist for this event
        const remaining = await getCapacity(eventId);

        if (parseInt(remaining) <= 0) {
        // Event is full, create waitlist record for this user
            attendee = await createWaitlist(eventId, userId);
            console.log("attendee", attendee);
            return {
                statusCode: 202,
                body: JSON.stringify({ message: 'Sorry, event is now full', status: 202 })
            };
        }

        // If guest list, change existing attendee record status from Invited to Registered
        var attendee = null;
        if (attendee_status === "Invited") {
            attendee = await editAttendeeStatus(eventId, userId, "Registered");
        }
        else {
        // Not guest list, create attendee record with status of Registered
            attendee = await createAttendee(eventId, userId, "Registered");
        }

        // add 1 to number of attendees for this event
        const capacity = await editEventCapacity(eventId, "add");

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Registration successful', status: 200 })
        };
        
    } catch (error) {
        // Error handling logic
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Unable to register for event at this time, please try again later' })
        };
    }
}