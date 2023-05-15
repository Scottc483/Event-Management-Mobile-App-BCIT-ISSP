import { Auth } from 'aws-amplify';
import { NavigationActions } from 'react-navigation';

const requireAuth = (navigation) => async (nextState, replace) => {
  try {
    await Auth.currentAuthenticatedUser();
    next();
  } catch (error) {
    // console.log('Not authenticated. Redirecting to login page.');
    const navigateAction = NavigationActions.navigate({
      routeName: 'SignIn',
    });
    navigation.dispatch(navigateAction);
  }
};

export default requireAuth;