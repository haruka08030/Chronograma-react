import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

const Label: React.FC<TextProps> = ({ style, ...props }) => (
  <Text style={[styles.label, style]} {...props} />
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
  },
});

export { Label };