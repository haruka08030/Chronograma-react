import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ViewProps, TextProps, TextInputProps, FlatListProps } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../theme/theme';

const Command: React.FC<ViewProps> = (props) => {
  return <View style={styles.command} {...props} />;
};

const CommandInput: React.FC<TextInputProps> = (props) => {
  return (
    <View style={styles.inputContainer}>
      <Search size={16} color={colors.textMuted} />
      <TextInput style={styles.input} {...props} />
    </View>
  );
};

const CommandList: React.FC<FlatListProps<any>> = (props) => {
  return <FlatList {...props} />;
};

const CommandItem: React.FC<ViewProps> = (props) => {
  return <View style={styles.item} {...props} />;
};

const CommandEmpty: React.FC<ViewProps> = (props) => {
  return <View style={styles.emptyContainer} {...props} />;
};

const CommandGroup: React.FC<ViewProps> = (props) => {
  return <View {...props} />;
};

const CommandSeparator: React.FC<ViewProps> = (props) => {
  return <View style={styles.separator} {...props} />;
};

const CommandDialog: React.FC<ViewProps> = (props) => {
  return <View {...props} />;
};

const CommandShortcut: React.FC<TextProps> = (props) => {
  return <Text style={styles.shortcut} {...props} />;
};

const styles = StyleSheet.create({
  command: {
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    flex: 1,
    height: 48,
    paddingLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  item: {
    padding: 12,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  shortcut: {
    marginLeft: 'auto',
    color: colors.textMuted,
  },
});

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};