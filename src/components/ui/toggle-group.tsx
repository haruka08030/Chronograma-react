import React, { createContext, useContext, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ToggleGroupContextProps {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextProps | null>(null);

const ToggleGroup = ({ children, type, value, onValueChange }: { children: React.ReactNode, type: 'single' | 'multiple', value: string | string[], onValueChange: (value: string | string[]) => void }) => {
  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange }}>
      <View style={styles.container}>{children}</View>
    </ToggleGroupContext.Provider>
  );
};

const ToggleGroupItem = ({ value, children }: { value: string, children: React.ReactNode }) => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup');
  }
  const { type, value: groupValue, onValueChange } = context;

  const isSelected = type === 'single' ? groupValue === value : (groupValue as string[]).includes(value);

  const handlePress = () => {
    if (type === 'single') {
      onValueChange(value);
    } else {
      const newValues = isSelected
        ? (groupValue as string[]).filter(item => item !== value)
        : [...(groupValue as string[]), value];
      onValueChange(newValues);
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.item, isSelected && styles.selectedItem]}>
      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedItem: {
    backgroundColor: 'blue',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: 'white',
  },
});

export { ToggleGroup, ToggleGroupItem };