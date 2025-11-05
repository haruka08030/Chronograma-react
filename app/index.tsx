import { CalendarDays, CheckSquare, Home, Settings, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import useLocalization from '../components/hooks/useLocalization';
import CalendarScreen from '../components/screens/CalendarScreen';
import HabitsScreen from '../components/screens/HabitsScreen';
import SettingsScreen from '../components/screens/SettingsScreen';
import TodayScreen from '../components/screens/TodayScreen';
import ToDoScreen from '../components/screens/ToDoScreen';

export default function Index() {
  const [activeTab, setActiveTab] = useState('today');

  const { t } = useLocalization();

  const tabs = [
    { id: 'today', label: t('nav.today'), icon: Home, component: TodayScreen },
    { id: 'calendar', label: t('nav.calendar'), icon: CalendarDays },
    { id: 'todo', label: t('nav.todo'), icon: CheckSquare },
    { id: 'habits', label: t('nav.habits'), icon: TrendingUp },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
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

import { colors } from '../components/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderTopColor: colors.border,
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
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: colors.textSubtle,
  },
  activeLabel: {
    color: colors.primary,
  },
});