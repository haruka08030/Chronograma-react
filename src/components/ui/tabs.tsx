import React, { createContext, useContext, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.tabsList}>{children}</View>
);

const TabsTrigger = ({ value, children }: { value: string, children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <Pressable onPress={() => setActiveTab(value)} style={[styles.tabTrigger, isActive && styles.activeTabTrigger]}>
      <Text style={[styles.tabTriggerText, isActive && styles.activeTabTriggerText]}>{children}</Text>
    </Pressable>
  );
};

const TabsContent = ({ value, children }: { value: string, children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <View style={styles.tabsContent}>{children}</View>;
};

const styles = StyleSheet.create({
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabTrigger: {
    backgroundColor: 'white',
  },
  tabTriggerText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabTriggerText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tabsContent: {
    marginTop: 16,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };