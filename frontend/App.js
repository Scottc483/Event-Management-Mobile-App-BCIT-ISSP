
import * as React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./src/components/store/index";
import Navigation from "./src/navigation/Navigation";
import { Amplify} from "aws-amplify";
import config from "./src/aws-exports";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from 'react-native-root-siblings';

//Configuring Amplify
Amplify.configure(config);

var Promise = require("bluebird");
Promise.longStackTraces();
Promise.onPossiblyUnhandledRejection(function(error){
  console.log(error);
});

const App = () => {

  return (
    <Provider store={store}>
       <RootSiblingParent>
      <Navigation />
      </RootSiblingParent>
    </Provider>
  );
};


export default App;
