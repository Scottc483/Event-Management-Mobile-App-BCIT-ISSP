import { getCancelledEvents } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const events = await getCancelledEvents();

    if (!events) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve event records' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify( events ),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}