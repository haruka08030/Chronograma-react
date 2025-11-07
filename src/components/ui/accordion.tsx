import { ChevronDown } from 'lucide-react-native';
import React, { createContext, useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/theme';
import { CollapsibleContext } from './collapsible';

// Accordion context
const AccordionContext = createContext<{ selected: string | null; setSelected: (value: string | null) => void; } | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

const Accordion = ({ children, defaultValue }: { children: React.ReactNode, defaultValue?: string }) => {
  const [selected, setSelected] = useState<string | null>(defaultValue || null);
  return (
    <AccordionContext.Provider value={{ selected, setSelected }}>
      <View>{children}</View>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children, value }: { children: React.ReactNode, value: string }) => {
  const { selected, setSelected } = useAccordion();
  const isOpen = selected === value;

  const contextValue = {
    isOpen,
    setIsOpen: (open: boolean) => setSelected(open ? value : null),
  };

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <View style={styles.itemContainer}>{children}</View>
    </CollapsibleContext.Provider>
  );
};

const AccordionTrigger = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setIsOpen } = useContext(CollapsibleContext)!;
  return (
    <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.triggerContainer}>
      <View style={{ flex: 1 }}>{children}</View>
      <ChevronDown color={colors.text} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
    </Pressable>
  );
};

const AccordionContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useContext(CollapsibleContext)!;
  if (!isOpen) return null;
  return <View style={styles.contentContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  triggerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  contentContainer: {
    paddingBottom: 16,
  },
});

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};