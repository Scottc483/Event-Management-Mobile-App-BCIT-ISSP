import { API } from "./stacks/ApiStack";

export default {
  config(_input) {
    return {
      name: "backend-event-app",
      region: "us-west-2",
      
    };
  },
  stacks(app) {
    app.stack(API);
  }
} 