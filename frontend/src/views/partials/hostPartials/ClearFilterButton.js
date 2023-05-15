import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * A button component used to clear filters.
 * @param {Function} onPress - The function to be executed when the button is pressed.
 * @param {string} color - The color of the button icon. Default is black (#000).
 * @param {string} icon - The name of the Ionicons icon to be displayed. Default is "filter-outline".
 */
export default function ClearFilterButton({
	onPress,
	color = "#000",
	icon = "filter-outline",
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Ionicons name={icon} size={24} color={color} />
		</TouchableOpacity>
	);
}
