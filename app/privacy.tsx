import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Policy' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to MuscliKnot. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you use our application and tell you about your privacy rights and how the law protects you.
        </Text>

        <Text style={styles.heading}>2. The Data We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          {'\n'}- Identity Data: First name, last name, username or similar identifier.
          {'\n'}- Contact Data: Email address.
          {'\n'}- Health and Usage Data: Information about how you use our app, exercise logs, and health-related preferences you choose to input.
        </Text>

        <Text style={styles.heading}>3. How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          {'\n'}- Where we need to perform the contract we are about to enter into or have entered into with you.
          {'\n'}- Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
          {'\n'}- Where we need to comply with a legal obligation.
        </Text>

        <Text style={styles.heading}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
        </Text>

        <Text style={styles.heading}>5. Your Legal Rights</Text>
        <Text style={styles.paragraph}>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          {'\n'}- Request access to your personal data.
          {'\n'}- Request correction of your personal data.
          {'\n'}- Request erasure of your personal data.
        </Text>

        <Text style={styles.heading}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this privacy policy or our privacy practices, please contact us.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
});
