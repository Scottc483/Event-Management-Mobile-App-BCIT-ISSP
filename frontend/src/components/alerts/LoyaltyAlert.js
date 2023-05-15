
import { Alert } from "react-native";


export const showLoyaltyCalculation = () => {
  Alert.alert(
    "Loyalty",
    "Your loyalty level is calculated based on the number of events you have attended. Any event you attend will increase your loyalty level by 1. Events that are cancelled or that you do not attend will not affect your loyalty level.",
    [{ text: "OK" }]
  );
};
