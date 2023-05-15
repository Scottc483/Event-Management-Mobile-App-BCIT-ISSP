import { anyCapacity } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const numberOfAttendees = await anyCapacity(eventId);
    return {
      statusCode: 200,
      body: JSON.stringify({ numberOfAttendees }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
