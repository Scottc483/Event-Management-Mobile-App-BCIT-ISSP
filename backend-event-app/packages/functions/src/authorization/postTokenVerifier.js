import jwt from 'jsonwebtoken';

export async function handler(event, context) {

  // Check if Authorization header is set
  if (!event.headers || !event.headers.authorization) {
    const effect = 'Deny';
    const policy = generatePolicy('user', effect, event.methodArn);
    return policy;
 
  }

  const token = event.headers.authorization.split(' ')[1];
  const secret = process.env.SECRET_KEY;

  try {
    const decodedToken = jwt.verify(token, secret);
   
    
    if (!decodedToken || !decodedToken.email) {
      const effect = 'Deny';
      const policy = generatePolicy('user', effect, event.methodArn);
      return policy;
    }
    
    // Check if decodedToken has the necessary fields and is not expired
    // If valid, return allow policy
    const effect = 'Allow';
    const policy = generatePolicy('user', effect, event.methodArn);
    return policy;
  } catch (err) {
    // Return deny policy if token is invalid
    const effect = 'Deny';
    const policy = generatePolicy('user', effect, event.methodArn);
    return policy;
  }
};

function generatePolicy(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}
