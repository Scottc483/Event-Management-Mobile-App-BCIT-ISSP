import { getAttendeesByUser } from "@backend-event-app/core/database";

export async function main(event) {

  try {

    const userId = event.pathParameters.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendees = await getAttendeesByUser(userId);

    if (!attendees) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve attendee records' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(attendees),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
