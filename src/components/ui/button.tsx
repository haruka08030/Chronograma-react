import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, PressableProps } from 'react-native';
import { colors } from '@/src/theme/theme';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        sizeStyles[size].container,
        pressed && styles.pressed,
        props.disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.textBase, variantStyles[variant].text, sizeStyles[size].text, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles = {
  default: StyleSheet.create({
    container: { backgroundColor: colors.primary },
    text: { color: 'white' },
  }),
  destructive: StyleSheet.create({
    container: { backgroundColor: colors.rose },
    text: { color: 'white' },
  }),
  outline: StyleSheet.create({
    container: { borderWidth: 1, borderColor: colors.border },
    text: { color: colors.text },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: colors.primaryLight },
    text: { color: colors.primary },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: colors.text },
  }),
  link: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary, textDecorationLine: 'underline' },
  }),
};

const sizeStyles = {
  default: StyleSheet.create({ container: {}, text: {} }),
  sm: StyleSheet.create({
    container: { paddingHorizontal: 12, paddingVertical: 8 },
    text: { fontSize: 12 },
  }),
  lg: StyleSheet.create({
    container: { paddingHorizontal: 24, paddingVertical: 12 },
    text: { fontSize: 16 },
  }),
  icon: StyleSheet.create({
    container: { width: 40, height: 40, paddingHorizontal: 0, paddingVertical: 0 },
    text: {},
  }),
};

export { Button };