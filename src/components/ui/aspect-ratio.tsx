import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface AspectRatioProps extends ViewProps {
  ratio?: number;
}

const AspectRatio: React.FC<AspectRatioProps> = ({ ratio = 1, style, ...props }) => {
  return (
    <View style={[styles.container, { aspectRatio: ratio }, style]} {...props} />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export { AspectRatio };