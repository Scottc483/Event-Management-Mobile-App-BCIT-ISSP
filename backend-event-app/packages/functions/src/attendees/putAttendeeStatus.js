import { editAttendeeStatus } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const userId = event.pathParameters.userId;
    const eventId = event.pathParameters.eventId;

    const attendeeStatus = JSON.parse(event.body).status;

    if (!eventId || !userId || !attendeeStatus) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendee = await editAttendeeStatus(eventId, userId, attendeeStatus);

    if (!attendee || !attendee.user_id || !attendee.event_id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update attendee record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(attendee),
    }
  } catch (error) {
    // Error handling logic
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
