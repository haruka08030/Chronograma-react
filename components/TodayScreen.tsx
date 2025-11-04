import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodayScreen() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chronograma</Text>
      <Text style={styles.date}>{dateString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    fontSize: 16,
    color: '#475569',
  },
});