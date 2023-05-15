import { getEventYears } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const years = await getEventYears();

    if (!years) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve event records' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify( years ),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}