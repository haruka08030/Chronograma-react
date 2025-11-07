import React, { createContext, useContext, useState } from 'react';
import { View, Pressable } from 'react-native';

// Collapsible context
const CollapsibleContext = createContext<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void; } | null>(null);

const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a Collapsible');
  }
  return context;
};

const Collapsible = ({ children, defaultOpen = false }: { children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <CollapsibleContext.Provider value={{ isOpen, setIsOpen }}>
      <View>{children}</View>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setIsOpen } = useCollapsible();
  return (
    <Pressable onPress={() => setIsOpen(!isOpen)}>
      {children}
    </Pressable>
  );
};

const CollapsibleContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useCollapsible();
  if (!isOpen) return null;
  return <View>{children}</View>;
};

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleContext,
  useCollapsible,
};