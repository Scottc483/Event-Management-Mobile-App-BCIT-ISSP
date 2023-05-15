import { getAttendanceStatuses } from "@backend-event-app/core/database";

export async function main(event) {
  try {
    const attendanceStatuses = await getAttendanceStatuses()

    if (!attendanceStatuses) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve attendance statuses' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ attendanceStatuses: attendanceStatuses }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}