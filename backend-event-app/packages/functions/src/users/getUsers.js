import { getUsers } from "@backend-event-app/core/database";

export async function main(event) {
console.log("getUsers:", event.headers.authorization.split(' ')[1])
  try {
    const users = await getUsers();

    if (!users) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve user records' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}