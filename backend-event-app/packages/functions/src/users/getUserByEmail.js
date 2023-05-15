import { getUserByEmail } from "@backend-event-app/core/database";
export async function main(event) {

  try {

    const email = event.pathParameters.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid parameters' })
      };
    }

    const user = await getUserByEmail(email);

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