import { getEvent } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const res = await getEvent(eventId);

    if (!res) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve event record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
