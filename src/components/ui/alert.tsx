import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';
import { colors } from '../../theme/theme';

interface AlertProps extends ViewProps {
  variant?: 'default' | 'destructive';
}

const Alert: React.FC<AlertProps> = ({ variant = 'default', ...props }) => {
  return <View style={[styles.alert, styles[variant]]} {...props} />;
};

const AlertTitle: React.FC<TextProps> = (props) => {
  return <Text style={styles.alertTitle} {...props} />;
};

const AlertDescription: React.FC<TextProps> = (props) => {
  return <Text style={styles.alertDescription} {...props} />;
};

const styles = StyleSheet.create({
  alert: {
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  default: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: colors.roseLight,
    borderColor: colors.rose,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.text,
  },
});

export { Alert, AlertTitle, AlertDescription };