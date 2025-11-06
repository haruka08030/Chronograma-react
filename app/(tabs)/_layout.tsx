
import { Tabs } from 'expo-router';
import { CalendarDays, CheckSquare, Home, Settings, TrendingUp } from 'lucide-react-native';
import React from 'react';

import useLocalization from '@/src/hooks/useLocalization';

export default function TabLayout() {
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.today'),
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('nav.calendar'),
          tabBarIcon: ({ color }) => <CalendarDays color={color} />,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: t('nav.todo'),
          tabBarIcon: ({ color }) => <CheckSquare color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: t('nav.habits'),
          tabBarIcon: ({ color }) => <TrendingUp color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
