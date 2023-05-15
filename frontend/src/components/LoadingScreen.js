
import * as  React  from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default LoadingScreen;