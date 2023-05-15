import { editEvent } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const eventId = event.pathParameters.eventId;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const body = JSON.parse(event.body);
    const res = await editEvent(eventId, body.eventName, body.eventDate, body.eventStart, body.eventEnd, body.eventLocation, body.capacity, body.eligibilityType, body.loyaltyMax, body.cancelled, body.reasonCancelled);

    if (!res || !res.event_id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update event record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
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
