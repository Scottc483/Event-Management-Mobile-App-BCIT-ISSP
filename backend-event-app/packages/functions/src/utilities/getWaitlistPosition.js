import { getWaitlistPosition } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const eventId = event.pathParameters.eventId;
    const userId = event.pathParameters.userId;

    if (!eventId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }
    
    const waitlistPosition = await getWaitlistPosition(eventId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({ waitlistPosition }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}