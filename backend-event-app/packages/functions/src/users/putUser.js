import { editUser } from "@backend-event-app/core/database";

export async function main(event) {

  try {
    const userId = event.pathParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const body = JSON.parse(event.body);
    const user = await editUser(userId, body.firstName, body.lastName, body.membershipStatusId);

    if (!user || !user.user_id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update user record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
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