import { deleteWaitlist } from "@backend-event-app/core/database";

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

    const deletedEntry = await deleteWaitlist(eventId, userId);
    if (!deletedEntry) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Failed to delete waitlist record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ deletedEntry }),
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