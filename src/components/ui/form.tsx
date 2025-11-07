import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';
import { useForm, FormProvider, useFormContext, Controller, Control, FieldValues, FieldPath } from 'react-hook-form';
import { colors } from '../../theme/theme';

const Form = FormProvider;

const FormItem: React.FC<ViewProps> = (props) => {
  return <View style={styles.formItem} {...props} />;
};

const FormLabel: React.FC<TextProps> = (props) => {
  return <Text style={styles.formLabel} {...props} />;
};

const FormControl: React.FC<{ name: string; control: Control<FieldValues>; children: React.ReactElement }> = ({ name, control, children }) => {
  return <Controller name={name} control={control} render={({ field }) => React.cloneElement(children, { ...field, ...children.props })} />;
};

const FormDescription: React.FC<TextProps> = (props) => {
  return <Text style={styles.formDescription} {...props} />;
};

const FormMessage: React.FC<TextProps> = (props) => {
  return <Text style={styles.formMessage} {...props} />;
};

const useFormField = () => {
  return { error: null }; // Simplified for now
};

const FormField: React.FC<{ name: FieldPath<FieldValues>; control: Control<FieldValues>; children: React.ReactElement }> = ({ name, control, children }) => {
  return (
    <FormItem>
      <FormControl name={name} control={control}>
        {children}
      </FormControl>
    </FormItem>
  );
};

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: colors.textMuted,
  },
  formMessage: {
    fontSize: 14,
    color: colors.rose,
  },
});

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};