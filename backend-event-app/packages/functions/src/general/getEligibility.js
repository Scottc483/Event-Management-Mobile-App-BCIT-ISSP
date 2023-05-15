import { getEligibilityTypes } from "@backend-event-app/core/database";

export async function main(event) {
  try {
    const eligibilityTypes = await getEligibilityTypes()

    if (!eligibilityTypes) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve eligibility types' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ eligibilityTypes: eligibilityTypes }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
}