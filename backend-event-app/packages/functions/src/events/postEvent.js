import { createEvent } from "@backend-event-app/core/database";

export async function main(event) {
  try {
    const body = JSON.parse(event.body);
    if (!body.eventName || !body.eventDate || !body.eventStart || !body.eventEnd || !body.eventLocation || !body.capacity || !body.eligibilityType || body.loyaltyMax < 0 ) {
      console.log("Missing required input parameters")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required input parameters' })
      };
    }
    
    const res = await createEvent(body.eventName, body.eventDate, body.eventStart, body.eventEnd, body.eventLocation, body.capacity, body.eligibilityType, body.loyaltyMax)

    console.log(res)
    if (!res) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create event' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ event: res }),
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

