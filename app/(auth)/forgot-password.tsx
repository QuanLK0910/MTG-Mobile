import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Forgot Password Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
