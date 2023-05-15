import axios from "axios";
import { API_END_POINT } from "@env";

export async function ValidateInputs(inpEvnName, inpEvnMax, inpEvnLocation, selectedEventType, loyaltyMinimum, startDateTime, endDateTime) {
    let errors = {};
  
    try {
      // check if event name already exists
        const response = await axios.get(`${API_END_POINT}event/date/${startDateTime.toISOString().slice(0, 10)}`);
        if (response.status === 200) {
          const eventExists = response.data.eventExists;
          // if there is no events on that date it eventExists will have a value of null
          if (eventExists != null) {
            errors.sameDate="Another event already starts on that date! Please choose another date and try again.";
          }
        }
      } catch (error) {
        if (error.response && error.response.statusCode === 500) {
        }
      }

      // other errors
      if (!inpEvnName) {
        errors.inpEvnName = "Please fill in event name!";
      }
      // integer validation
      if (inpEvnMax % 1 !== 0) {
        errors.inpEvnMax = "Please enter a valid capacity!";
      }
      if (!inpEvnMax) {
        errors.inpEvnMax = "Please fill in event capacity!";
      } else if (inpEvnMax < 1) {
        errors.inpEvnMax = "Please enter a valid capacity!";
      }
      if (!inpEvnLocation) {
        errors.inpEvnLocation = "Please fill in event location!";
      }
      if (selectedEventType === "Loyalty" && loyaltyMinimum < 1) {
        errors.loyaltyMinimum = "Please enter a valid loyalty minimum!";
      }
      if (startDateTime > endDateTime) {
        errors.startDateTime = "Please enter a valid start and end date!";
        errors.endDateTime = "Please enter a valid start and end date!";
      }
      if (startDateTime < new Date() || endDateTime < new Date()) {
        errors.startDateTime = "The start and end dates cannot be in the past!";
        errors.endDateTime = "The start and end dates cannot be in the past!";
      }

      console.log("errors", errors)
    return errors;
  }
