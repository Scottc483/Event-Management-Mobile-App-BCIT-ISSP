import { Linking } from "react-native";

export const openEmailSupport = () => {
    Linking.openURL(
      `mailto:support@example.com?subject=Membership Inquiry&to=support@example.com`
    );
  };