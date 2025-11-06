import { StyleSheet } from 'react-native';

// In React Native, styles are merged by passing an array of style objects.
// This function can help flatten the array, but it's often not necessary.
// We provide a simple version for compatibility with existing code.
export function cn(...inputs: (object | undefined | null)[]) {
  return inputs.filter(Boolean);
}