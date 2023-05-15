import { getEvents } from "@backend-event-app/core/database";

export async function main(event) {
  console.log("getEvents:", event.headers.authorization.split(' ')[1])
  try {
    const events = await getEvents();

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