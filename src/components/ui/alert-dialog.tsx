import React, { createContext, useContext } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { colors } from '@/theme/theme';
import { Button } from './button'; // Assuming button is RN compatible

// Context for Dialog/Alert Dialog
const DialogContext = createContext<any>(null);

// AlertDialog (using React Native's Alert)
const AlertDialog = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;

const AlertDialogTrigger = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => {
  return <Pressable onPress={onPress}>{children}</Pressable>;
};

const showAlertDialog = (title: string, description: string, actions: { text: string, onPress?: () => void, style?: any }[]) => {
  Alert.alert(title, description, actions);
};

const AlertDialogAction = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
  <Button onPress={onPress}><Text>{children}</Text></Button>
);

const AlertDialogCancel = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
  <Button variant="outline" onPress={onPress}><Text>{children}</Text></Button>
);

const styles = StyleSheet.create({
  header: { marginBottom: 16, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  description: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, gap: 8 },
});

export {
  AlertDialog,
  AlertDialogTrigger,
  showAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
};