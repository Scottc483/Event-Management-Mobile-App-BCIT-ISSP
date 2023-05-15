import { getAttendeeStatuses } from "@backend-event-app/core/database";

export async function main(event) {
  try {
    const attendeeStatuses = await getAttendeeStatuses()

    if (!attendeeStatuses) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve attendee statuses' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ attendeeStatuses: attendeeStatuses }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}