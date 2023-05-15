import { editAttendee } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const attendanceStatus = JSON.parse(event.body).attendance_status
    const eventId = event.pathParameters.eventId;
    const userId = event.pathParameters.userId;
    console.log(attendanceStatus)
    console.log(eventId)
    console.log(userId)
    
    if (!eventId || !userId || !attendanceStatus) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const attendee = await editAttendee(eventId, userId, attendanceStatus);

    if (!attendee) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create event attendee' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ attendee: attendee }),
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