import { getCapacity, editAttendeeStatus, deleteAttendee,
         editEventCapacity, getEventWaitlist, createAttendee,
         deleteWaitlist } from "@backend-event-app/core/database";

export async function main(event) {

    try {
        const userId = event.pathParameters.userId;
        const eventId = event.pathParameters.eventId;

        const event_type = JSON.parse(event.body).event_type;

        if (!eventId || !userId || !event_type) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid parameters' })
            };
        }
      
        // Get remaining capacity for this event
        const remaining = await getCapacity(eventId);

        // If guest list, change existing attendee record status from Registered to Invited
        var attendee = null;
        if (event_type === "Guest List") {
            attendee = await editAttendeeStatus(eventId, userId, "Invited");
        }
        else {
        // Not guest list, delete attendee record
            const deletedEntry = await deleteAttendee(eventId, userId);
        }

        // subtract 1 to number of attendees for this event
        const capacity = await editEventCapacity(eventId, "subtract");

        // If event was full, it now has an open spot, so find first waitlist record
        // Delete waitlist record and create attendee record with status "Registered"
        var newAttendee = null;
        if (parseInt(remaining) <= 0) {
            const waitlist = await getEventWaitlist(eventId);
            newAttendee = waitlist[0];
        }

        // create attendee record for first person on waitlist
        if (newAttendee) {
            const attendee = await createAttendee(eventId, newAttendee.user_id, "Registered");
        
            // delete waitlist record
            const deletedEntry = await deleteWaitlist(eventId, newAttendee.user_id);

            // add 1 to number of attendees for this event
            const capacity = await editEventCapacity(eventId, "add");
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Withdrawal successful' })
        };

    } catch (error) {
        // Error handling logic
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Unable to withdraw from event at this time, please try again later' })
        };
    }
}