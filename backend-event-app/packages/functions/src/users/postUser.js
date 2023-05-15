import { createUser } from "@backend-event-app/core/database";
export async function main(event) {
  
  try {
    const body = JSON.parse(event.body);

    if (!body.email || !body.firstName || !body.lastName || !body.roleId || !body.membershipStatusId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required input parameters' })
      };
    }

    const user = await createUser(body.email, body.firstName, body.lastName, body.roleId, body.membershipStatusId);

    if (!user) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create user' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: user }),
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
