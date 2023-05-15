import { getUserEventWaitlist } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const eventId = event.pathParameters.eventId;
    const userId = event.pathParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const waitlist = await getUserEventWaitlist(eventId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({ waitlist }),
    }

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
