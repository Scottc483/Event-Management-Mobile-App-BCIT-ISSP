import { createAttendee } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const attendeeStatus = JSON.parse(event.body).status;

    const eventId = event.pathParameters.eventId;
    const userId = event.pathParameters.userId;

    if (!eventId || !userId || !attendeeStatus) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendee = await createAttendee(eventId, userId, attendeeStatus);

    if (!attendee) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create event attendee' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ attendee: attendee }),
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