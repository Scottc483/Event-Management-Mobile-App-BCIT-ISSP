import { Api, Cognito, Function } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

export function API({ stack }) {
  const auth = new Cognito(stack, "Auth", {
    cdk: {
      userPool: UserPool.fromUserPoolId(
        stack,
        "EventRSVPApplication-staging",
        process.env.COGNITO_USER_POOL_ID
      ),
      userPoolClient: UserPoolClient.fromUserPoolClientId(
        stack,
        "eventr29718598_app_client",
        process.env.COGNITO_USER_POOL_CLIENT_ID
      ),
    },
  });


  const api = new Api(stack, "api", {
    authorizers: {
      cognito: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId, // Required
        },
      },
      eventAppJwtAuthorizer: {
        type: "lambda",
        function: new Function(stack, "eventAppJwtAuthorizer", {
          handler:
            "packages/functions/src/authorization/postTokenVerifier.handler",
          environment: {
            SECRET_KEY: process.env.SECRET_KEY,
          },
        }),
        resultsCacheTtl: "30 seconds",
      },
    },
    defaults: {
      authorizer: "cognito",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },
    routes: {
      // Routes for getting records from status type tables
      "GET /membership": "packages/functions/src/general/getMembership.main",
      "GET /eligibility": "packages/functions/src/general/getEligibility.main",
      "GET /attendeestatus":
        "packages/functions/src/general/getAttendeeStatus.main",
      "GET /attendancestatus":
        "packages/functions/src/general/getAttendanceStatus.main",
      // Routes for getting single/all users, creating and updating users
      "GET /users": {
        function: "packages/functions/src/users/getUsers.main",
        authorizer: "cognito"
      },
      "GET /user/{userId}": "packages/functions/src/users/getUser.main",
      "GET /user/email/{email}": {
        function: "packages/functions/src/users/getUserByEmail.main",
        authorizer: "eventAppJwtAuthorizer",
      },
      "POST /user": {
        function: "packages/functions/src/users/postUser.main",
        authorizer: "eventAppJwtAuthorizer",
      },
      // "POST /user": "packages/functions/src/users/postUser.main",
      "PUT /user/{userId}": "packages/functions/src/users/putUser.main",
      // Routes for getting single/all/cancelled events, creating and updating events
      "GET /events": "packages/functions/src/events/getEvents.main",
      "GET /events/cancelled":
        "packages/functions/src/events/getCancelledEvents.main",
      "GET /event/{eventId}": "packages/functions/src/events/getEvent.main",
      "POST /event": "packages/functions/src/events/postEvent.main",
      "PUT /event/{eventId}": "packages/functions/src/events/putEvent.main",
      "GET /event/date/{date}": "packages/functions/src/events/getEventWithDate.main",
      "GET /event/years": "packages/functions/src/events/getEventYears.main",
      // Routes for creating and updating event capacity records
      "POST /event/capacity/{eventId}":
        "packages/functions/src/capacity/postEventCapacity.main",
      "PUT /event/capacity/{eventId}":
        "packages/functions/src/capacity/putEventCapacity.main",
      // Routes for creating an attendee, getting attendees for an event, getting events for a specific attendee, getting a specific attendee, deleting an attendee
      "POST /attendee/{eventId}/{userId}":
        "packages/functions/src/attendees/postAttendee.main",
      "DELETE /attendee/{eventId}/{userId}":
        "packages/functions/src/attendees/deleteAttendee.main",
      "GET /attendee/events/{userId}":
        "packages/functions/src/attendees/getAttendeeEvents.main",
      "GET /attendee/users/{eventId}":
        "packages/functions/src/attendees/getAttendeeUsers.main",
      "GET /attendee/{userId}/{eventId}":
        "packages/functions/src/attendees/getAttendee.main",
      "PUT /attendee/{eventId}/{userId}":
        "packages/functions/src/attendees/putAttendee.main",
      // Routes for updating an attendee status or attendance status
      "PUT /attendeestatus/{userId}/{eventId}":
        "packages/functions/src/attendees/putAttendeeStatus.main",
      "PUT /attendancestatus/{userId}/{eventId}":
        "packages/functions/src/attendees/putAttendanceStatus.main",
      // Routes for creating and deleting waitlist entries
      "POST /waitlist/{eventId}/{userId}":
        "packages/functions/src/waitlist/postWaitlist.main",
      "DELETE /waitlist/{eventId}/{userId}":
        "packages/functions/src/waitlist/deleteWaitlist.main",
      // Routes for getting users waitlisted for an event, getting events a user is waitlisted for, checking if a user is waitlisted for a particular event
      "GET /waitlist/users/{eventId}":
        "packages/functions/src/waitlist/getEventWaitlist.main",
      "GET /waitlist/events/{userId}":
        "packages/functions/src/waitlist/getUserWaitlist.main",
      "GET /waitlist/inwaitlist/{eventId}/{userId}":
        "packages/functions/src/waitlist/getUserEventWaitlist.main",
      // Routes for finding a user's position in a waitlist, checking if any capacity remains in an event, getting the count of events a user has attended previously for loyalty events, get attendance counts for all events
      "GET /waitlistposition/{eventId}/{userId}":
        "packages/functions/src/utilities/getWaitlistPosition.main",
      "GET /anycapacity/{eventId}":
        "packages/functions/src/utilities/getAnyCapacity.main",
      "GET /loyalty/{userId}":
        "packages/functions/src/utilities/getLoyaltyCount.main",
      "GET /eventcounts":
        "packages/functions/src/utilities/getEventCounts.main",
      // Routes for registering a user for and withdrawing a user from an event
      "POST /registration/{userId}/{eventId}":
        "packages/functions/src/attendees/registerForEvent.main",
      "POST /withdraw/{userId}/{eventId}":
        "packages/functions/src/attendees/withdrawFromEvent.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    api,
  };
}
