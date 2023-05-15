import { Image, View, StyleSheet } from "react-native";

/**
 * Logo component displays the logo of the application
 * @returns {JSX.Element} - Rendered component tree
 */
export const Logo = () => {
	return (
		<Image
			source={require("../../assets/logo-no-background.png")}
			style={styles.logo}
		/>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: 200,
		height: 100,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 10,
	},
});
