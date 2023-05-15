import { editEventCapacity } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const functionType = JSON.parse(event.body).function_type;
    const eventId = event.pathParameters.eventId;
    
    if (!eventId || !functionType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const capacity = await editEventCapacity(eventId, functionType);

    if (!capacity) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update event capacity record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ capacity: capacity }),
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