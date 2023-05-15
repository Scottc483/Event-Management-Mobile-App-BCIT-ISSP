import { getAttendee } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const userId = event.pathParameters.userId;
    const eventId = event.pathParameters.eventId;

    if (!eventId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendee = await getAttendee(userId, eventId);

    if (!attendee) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve attendee record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(attendee),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
