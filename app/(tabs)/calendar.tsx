
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { CalendarGrid } from '@/src/features/calendar/CalendarGrid';
import { ComparisonTimeline } from '@/src/features/today/ComparisonTimeline';
import { SingleTimeline } from '@/src/features/today/SingleTimeline';
import useLocalization from '@/src/hooks/useLocalization';
import { colors } from '@/src/theme/theme';
import { ScheduleItemSchema } from '@/src/types/schemas';

interface ScheduleItem {
  id: number;
  dateISO: string;
  startTime: string;
  durationMin: number;
  title: string;
  type: string;
  color: { bg: string; border: string };
  delayed?: boolean;
  completed?: boolean;
  current?: boolean;
  unplanned?: boolean;
}

export default function CalendarScreen() {
  const [plannedSchedule, setPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [actualSchedule, setActualSchedule] = useState<ScheduleItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('comparison');
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const storedPlannedSchedule = await AsyncStorage.getItem('plannedSchedule');
      if (storedPlannedSchedule !== null) {
        const parsed = JSON.parse(storedPlannedSchedule);
        const validated = z.array(ScheduleItemSchema).safeParse(parsed);
        if (validated.success) {
          setPlannedSchedule(validated.data);
        } else {
          console.error('Invalid planned schedule data:', validated.error);
        }
      }
      const storedActualSchedule = await AsyncStorage.getItem('actualSchedule');
      if (storedActualSchedule !== null) {
        const parsed = JSON.parse(storedActualSchedule);
        const validated = z.array(ScheduleItemSchema).safeParse(parsed);
        if (validated.success) {
          setActualSchedule(validated.data);
        } else {
          console.error('Invalid actual schedule data:', validated.error);
        }
      }
    } catch (error) {
      console.error('Failed to load schedules.', error);
    }
  };

  const activityMap = useMemo(() => {
    const newActivityMap = new Map<string, number>();
    [...plannedSchedule, ...actualSchedule].forEach(item => {
      const count = newActivityMap.get(item.dateISO) || 0;
      newActivityMap.set(item.dateISO, count + 1);
    });
    return newActivityMap;
  }, [plannedSchedule, actualSchedule]);

  const { filteredPlannedSchedule, filteredActualSchedule } = useMemo(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filteredPlanned = plannedSchedule.filter(item => item.dateISO === selectedDateString);
    const filteredActual = actualSchedule.filter(item => item.dateISO === selectedDateString);
    return { filteredPlannedSchedule: filteredPlanned, filteredActualSchedule: filteredActual };
  }, [selectedDate, plannedSchedule, actualSchedule]);

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const selectedDateString = selectedDate.toLocaleDateString();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('calendar.subtitle')}</Text>
      </View>

      <CalendarGrid
        currentMonth={currentMonth}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        activityMap={activityMap}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <View style={{ marginTop: 16 }}>
        <Text style={styles.headerTitle}>{selectedDateString}</Text>
        <View style={styles.tabsContainer}>
          <Pressable style={[styles.tab, activeTab === 'comparison' && styles.activeTab]} onPress={() => setActiveTab('comparison')}>
            <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>{t('calendar.comparison')}</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'single' && styles.activeTab]} onPress={() => setActiveTab('single')}>
            <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>{t('calendar.single')}</Text>
          </Pressable>
        </View>

        {activeTab === 'comparison' ? (
          <ComparisonTimeline
            plannedSchedule={filteredPlannedSchedule}
            actualSchedule={filteredActualSchedule}
            onSelectSchedule={() => { }}
          />
        ) : (
          <SingleTimeline
            actualSchedule={filteredActualSchedule}
            onSelectSchedule={() => { }}
          />
        )}
      </View>

    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 16, color: colors.textMuted },
  calendarCard: { padding: 16, borderRadius: 16, backgroundColor: 'white', marginBottom: 16 },
  timelineContainer: { marginTop: 16 },
  monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navButton: { padding: 8, borderRadius: 20 },
  monthName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  dayHeaders: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayHeader: { width: '14.28%', alignItems: 'center' },
  dayHeaderText: { fontSize: 12, color: colors.textSubtle },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  emptyDayCell: { height: 0, width: '14.28%' },
  dayCell: { width: '100%', height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 999, paddingVertical: 2 },
  dayText: { fontSize: 18, fontWeight: '400', color: colors.text },
  todayCell: { backgroundColor: colors.primary },
  todayText: { color: 'white' },
  selectedCell: { backgroundColor: colors.accent },
  selectedText: { color: 'white' },
  activityCellLow: { backgroundColor: colors.activityLow },
  activityCellHigh: { backgroundColor: colors.activityHigh },
  activityDot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },
  todayDot: { backgroundColor: colors.primary },
  selectedDot: { backgroundColor: colors.accent },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: 'white' },
  tabText: { textAlign: 'center', color: colors.textMuted },
  activeTabText: { color: colors.text, fontWeight: 'bold' },
  timelineHeaderText: { color: colors.textSubtle, fontSize: 12 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: colors.textSubtle, fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: colors.border },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: colors.primary },
});