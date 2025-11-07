import React, { createContext, useContext } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme/theme';
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

// Dialog (using React Native's Modal)
const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
  return (
    <Modal
      transparent
      visible={open}
      onRequestClose={() => onOpenChange(false)}
      animationType="fade"
    >
      <DialogContext.Provider value={{ onOpenChange }}>
        {children}
      </DialogContext.Provider>
    </Modal>
  );
};

const DialogTrigger = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => {
  return <Pressable onPress={onPress}>{children}</Pressable>;
};

const DialogContent = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={styles.centeredView}>
    <View style={[styles.modalView, style]}>
      {children}
    </View>
  </View>
);

const DialogHeader = ({ children, style }: { children: React.ReactNode, style?: any }) => <View style={[styles.header, style]}>{children}</View>;
const DialogTitle = ({ children, style }: { children: React.ReactNode, style?: any }) => <Text style={[styles.title, style]}>{children}</Text>;
const DialogDescription = ({ children, style }: { children: React.ReactNode, style?: any }) => <Text style={[styles.description, style]}>{children}</Text>;
const DialogFooter = ({ children, style }: { children: React.ReactNode, style?: any }) => <View style={[styles.footer, style]}>{children}</View>;

const DialogClose = ({ children, onPress }: { children: React.ReactNode, onPress?: () => void }) => {
  const { onOpenChange } = useContext(DialogContext);
  return <Pressable onPress={() => { onPress?.(); onOpenChange(false); }}>{children}</Pressable>;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};