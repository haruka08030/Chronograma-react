import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Platform } from 'react-native';
import { CalendarDays, CheckSquare, Settings, TrendingUp, Home } from 'lucide-react-native';
import TodayScreen from '../components/TodayScreen';
import CalendarScreen from '../components/CalendarScreen';
import ToDoScreen from '../components/ToDoScreen';
import HabitsScreen from '../components/HabitsScreen';
import SettingsScreen from '../components/SettingsScreen';

export default function Index() {
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodayScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'todo':
        return <ToDoScreen />;
      case 'habits':
        return <HabitsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TodayScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      <View style={styles.navigation}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabItem, isActive ? styles.activeTab : {}]}
              >
                <Icon color={isActive ? '#2563eb' : '#64748b'} size={20} strokeWidth={isActive ? 2.5 : 2} />
                <Text style={[styles.tabLabel, isActive ? styles.activeLabel : {}]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  mainContent: {
    flex: 1,
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#eff6ff',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
  activeLabel: {
    color: '#2563eb',
  },
});