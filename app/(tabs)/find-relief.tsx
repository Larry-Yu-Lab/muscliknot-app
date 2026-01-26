import { StyleSheet, Text, View } from 'react-native';

export default function FindReliefScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Find Relief Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
});
