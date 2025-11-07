import React, { useState, createContext, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ViewProps, TextProps, PressableProps } from 'react-native';
import { Check, ChevronRight, Circle } from 'lucide-react-native';
import { colors } from '../../theme/theme';

interface DropdownMenuContextProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextProps | null>(null);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('useDropdownMenu must be used within a <DropdownMenu />');
  }
  return context;
};

const DropdownMenu: React.FC<ViewProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ visible, setVisible }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger: React.FC<ViewProps> = ({ children }) => {
  const { setVisible } = useDropdownMenu();
  return <Pressable onPress={() => setVisible(true)}>{children}</Pressable>;
};

const DropdownMenuContent: React.FC<ViewProps> = ({ children }) => {
  const { visible, setVisible } = useDropdownMenu();
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Modal>
  );
};

const DropdownMenuItem: React.FC<PressableProps> = (props) => {
  return <Pressable style={styles.item} {...props} />;
};

const DropdownMenuCheckboxItem: React.FC<PressableProps & { checked?: boolean, children: string }> = ({ checked, children, ...props }) => {
  return (
    <Pressable style={styles.item} {...props}>
      {checked && <Check size={16} color={colors.text} />}
      <Text style={styles.itemText}>{children}</Text>
    </Pressable>
  );
};

const DropdownMenuRadioItem: React.FC<PressableProps & { checked?: boolean, children: string }> = ({ checked, children, ...props }) => {
  return (
    <Pressable style={styles.item} {...props}>
      {checked && <Circle size={16} color={colors.text} />}
      <Text style={styles.itemText}>{children}</Text>
    </Pressable>
  );
};

const DropdownMenuSeparator: React.FC<ViewProps> = (props) => {
  return <View style={styles.separator} {...props} />;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
  },
  item: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 8,
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
};