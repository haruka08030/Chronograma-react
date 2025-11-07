import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder for Resizable component
const ResizablePanelGroup = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Text>ResizablePanelGroup (Placeholder)</Text>
    {children}
  </View>
);

const ResizablePanel = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.panel}>{children}</View>
);

const ResizableHandle = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.handle}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };