import { getUser } from "@backend-event-app/core/database";
export async function main(event) {

  try {

    const userId = event.pathParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const user = await getUser(userId);

    if (!user) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve user record' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}
