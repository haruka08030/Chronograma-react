import { Picker, PickerProps } from '@react-native-picker/picker';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/theme';

interface SelectProps extends PickerProps {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, ...props }) => (
  <View style={styles.container}>
    <Picker {...props}>
      {children}
    </Picker>
  </View>
);

const SelectItem = Picker.Item;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
});

export { Select, SelectItem };