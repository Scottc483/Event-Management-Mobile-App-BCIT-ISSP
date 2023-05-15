import { getEventWithDate } from "@backend-event-app/core/database";

export async function main(event) {
  try {
    const eventDate = event.pathParameters.date;
    console.log(eventDate)

    if (!eventDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const eventExists = await getEventWithDate(eventDate);
    console.log(eventExists);

    return {
      statusCode: 200,
      body: JSON.stringify({ eventExists }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
