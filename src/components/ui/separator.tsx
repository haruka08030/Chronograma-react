import React from 'react';
import { View, StyleSheet } from 'react-native';

// Placeholder for Separator component
const Separator = ({ orientation = 'horizontal', ...props }: { orientation?: 'horizontal' | 'vertical' }) => (
  <View style={[styles.separator, orientation === 'vertical' && styles.vertical]} {...props} />
);

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: 8,
  },
});

export { Separator };