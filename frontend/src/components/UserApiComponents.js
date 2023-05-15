import { Auth } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userSlice";

import JWT from "expo-jwt";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_END_POINT, SECRET_KEY } from "@env";

export const removeCognitoTokens = async () => {
  try {
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("idToken");
  } catch (error) {
    // console.log("Error removing cognito tokens", error);
  }
};

export const amplifyRefreshTokens = async () => {
  try {
    
    const userAuth = Auth.currentSession();
    const refreshToken = await userAuth.getRefreshToken().getToken();
    const accessToken = await userAuth.getAccessToken().getJwtToken();
    const idToken = await userAuth.getIdToken().getJwtToken();

    AsyncStorage.setItem("refreshToken", refreshToken);
    AsyncStorage.setItem("accessToken", accessToken);
    AsyncStorage.setItem("idToken", idToken);

    return {
      success: true,
      message: "Successfully refreshed tokens",
    };
  } catch (error) {
    if (error.code === "NotAuthorizedException") {
      return {
        success: false,
        message: "NotAuthorizedException",
      };
    }
    return {
      success: false,
      message: "Error refreshing tokens",
    };
  }
};

export const generateToken = async (email) => {
  const key = SECRET_KEY;
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    email: email,
  };
  try {
    const token = JWT.encode(payload, key);

    return {
      success: true,
      message: "Successfully created token",
      token: token,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error creating token",
    };
  }
};

export const handleSignUpApi = async (email, firstName, lastName) => {
  try {
    const bearerToken = await generateToken(email);
    if (!bearerToken.success) {
      return {
        success: false,
        message: "Error signing up, please try again",
      };
    }


    const existingUser = await fetch(`${API_END_POINT}user/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken.token}`,
      },
    });
    if (existingUser.status === 200) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    console.log("bearerToken", bearerToken);
    const userData = JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
      roleId: "Attendee",
      membershipStatusId: "None",
    });
    const apiEndpoint = `${API_END_POINT}user`;
    const apiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken.token}`,
      },
      body: userData
    });
    return {
      success: true,
      message: "Successfully signed up",
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Error signing up",
    };
  }
};

export const getCognitoTokens = async () => {
  try {
    const session = await Auth.currentSession();
    const refreshToken = await session.getRefreshToken().getToken();
    const accessToken = await session.getAccessToken().getJwtToken();
    const idToken = await session.getIdToken().getJwtToken();

    //ASYNC STORAGE
    AsyncStorage.setItem("refreshToken", refreshToken);
    AsyncStorage.setItem("accessToken", accessToken);
    AsyncStorage.setItem("idToken", idToken);
      
    return {
      success: true,
      message: "Successfully stored tokens",
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Error retrieving tokens",
    };
  }
};

export const getUserData = async (username, dispatch) => {
  try {
    const userJwtToken = await generateToken(username);
    if (!userJwtToken.success) {
      return {
        success: false,
        message: "Failed to retrieve user data, Check your email and try again",
      };
    }
    // console.log(getTokens);
    // const accessToken = await AsyncStorage.getItem("accessToken");
    const session = await Auth.currentSession();
    const accessToken = await session.getAccessToken().getJwtToken();
    // console.log("ACCESS TOKEN", accessToken);
  
    // console.log("USER JWT TOKEN", userJwtToken);
    const apiEndpoint = `${API_END_POINT}user/email/${username}`;
    const apiResponse = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwtToken.token}`,
      },
    });
    // console.log("API Response", apiResponse);
    if (!apiResponse.ok) {
      return {
        success: false,
        message: "Failed to retrieve user data, Check your email and try again",
      };
    }

    const apiResponseJson = await apiResponse.json();
    // console.log("USER ID", apiResponseJson.user_id)
    // console.log("ACCESS TOKEN", accessToken)
    const loyalty = await fetch(
      `${API_END_POINT}loyalty/${apiResponseJson.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,   
        },
      }
    );
    
    const loyaltyJson = await loyalty.json();


    
    const mergedUserData = {
      ...apiResponseJson,
      ...loyaltyJson,
    };

    // console.log("MERGED USER DATA", mergedUserData);
    dispatch(setUser(mergedUserData));

    const tokens = await getCognitoTokens();
    // console.log("TOKENS", tokens);
    await amplifyRefreshTokens();
    return {
      success: true,
      message: "Successfully signed in",
    };
  } catch (error) {

    let message = "Error signing in: " + error.message;
    return {
      success: false,
      message: message,
    };
  }
};
