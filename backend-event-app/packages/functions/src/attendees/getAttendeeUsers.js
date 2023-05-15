import { getAttendeesByEvent } from "@backend-event-app/core/database";

export async function main(event) {
  
  try {

    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendees = await getAttendeesByEvent(eventId);

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
