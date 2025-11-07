import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/theme';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, disabled }) => {
  return (
    <Pressable onPress={() => onCheckedChange(!checked)} disabled={disabled} style={[styles.container, checked && styles.checkedContainer, disabled && styles.disabledContainer]}>
      {checked && <Check color="white" style={styles.icon} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkedContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  icon: {
    width: 14,
    height: 14,
  },
});

export { Checkbox };