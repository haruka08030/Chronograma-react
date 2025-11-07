import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';
import { colors } from '../../theme/theme';

const Card: React.FC<ViewProps> = ({ style, ...props }) => (
  <View style={[styles.card, style]} {...props} />
);

const CardHeader: React.FC<ViewProps> = ({ style, ...props }) => (
  <View style={[styles.cardHeader, style]} {...props} />
);

const CardTitle: React.FC<TextProps> = ({ style, ...props }) => (
  <Text style={[styles.cardTitle, style]} {...props} />
);

const CardDescription: React.FC<TextProps> = ({ style, ...props }) => (
  <Text style={[styles.cardDescription, style]} {...props} />
);

const CardContent: React.FC<ViewProps> = ({ style, ...props }) => (
  <View style={[styles.cardContent, style]} {...props} />
);

const CardFooter: React.FC<ViewProps> = ({ style, ...props }) => (
  <View style={[styles.cardFooter, style]} {...props} />
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardHeader: {
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textMuted,
  },
  cardContent: {
    // Add content-specific styles if needed
  },
  cardFooter: {
    paddingTop: 16,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};