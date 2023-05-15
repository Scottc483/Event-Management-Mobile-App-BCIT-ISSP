import { TextInput, StyleSheet, Button } from "react-native";

/**
 * SearchBar component displays a text input field that allows users to search for items.
 * @param {string} value - The current value of the text input.
 * @param {function} onChangeText - A function to be called when the text input's value changes.
 * @param {function} onSubmitEditing - A function to be called when the user submits the search query.
 * @param {string} color - The color of the text in the search bar.
 * @returns {JSX.Element} A text input field with a placeholder "Search..." and a specified color.
 */
export default function SearchBar({
	value,
	onChangeText,
	onSubmitEditing,
	color = "#000",
}) {
	return (
		<>
			<TextInput
				placeholder="Search..."
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				style={[
					styles.searchBar,
					{
						color: color,
					},
				]}
			/>
		</>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	nameInput: {
		paddingBottom: 2,
		fontSize: 18,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
	searchBar: {
		paddingBottom: 2,
		fontSize: 18,
		borderBottomColor: "#000",
		width: 300,
	},
});
