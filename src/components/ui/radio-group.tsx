import React, { createContext, useContext, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface RadioGroupContextProps {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextProps | null>(null);

const RadioGroup = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <View>{children}</View>
    </RadioGroupContext.Provider>
  );
};

const RadioGroupItem = ({ value, children }: { value: string, children?: React.ReactNode }) => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <Pressable onPress={() => onValueChange(value)} style={styles.radioItem}>
      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      {children && <Text style={styles.radioLabel}>{children}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: 'blue',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  radioLabel: {
    fontSize: 16,
  },
});

export { RadioGroup, RadioGroupItem };