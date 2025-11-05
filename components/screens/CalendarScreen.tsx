import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

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

const timelineHours = Array.from({ length: 24 }, (_, i) => i);

const timeToMinutes = (startTime: string): number => {
  const [hours, minutes] = startTime.split(':').map(Number);
  return hours * 60 + minutes;
};

const durationToMinutes = (durationMin: number): number => {
  return durationMin;
};

const startMinutes = 0;

const calculatePosition = (item: ScheduleItem) => {
  const itemMinutes = timeToMinutes(item.startTime);
  const duration = durationToMinutes(item.durationMin);
  const topPosition = ((itemMinutes - startMinutes) / 60) * 80;
  const height = (duration / 60) * 80;
  return { top: topPosition, height };
};

export default function CalendarScreen() {
  const [plannedSchedule, setPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [actualSchedule, setActualSchedule] = useState<ScheduleItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('comparison');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const storedPlannedSchedule = await AsyncStorage.getItem('plannedSchedule');
      if (storedPlannedSchedule !== null) {
        const parsed = JSON.parse(storedPlannedSchedule);
        const migrated = parsed.map((item: any) => {
          if (item.time) {
            const date = new Date(item.time);
            return {
              ...item,
              dateISO: date.toISOString().split('T')[0],
              startTime: `${date.getHours()}:${date.getMinutes()}`,
              durationMin: durationToMinutes(item.duration),
            };
          }
          return item;
        });
        setPlannedSchedule(migrated);
      }
      const storedActualSchedule = await AsyncStorage.getItem('actualSchedule');
      if (storedActualSchedule !== null) {
        const parsed = JSON.parse(storedActualSchedule);
        const migrated = parsed.map((item: any) => {
          if (item.time) {
            const date = new Date(item.time);
            return {
              ...item,
              dateISO: date.toISOString().split('T')[0],
              startTime: `${date.getHours()}:${date.getMinutes()}`,
              durationMin: durationToMinutes(item.duration),
            };
          }
          return item;
        });
        setActualSchedule(migrated);
      }
    } catch (error) {
      console.error('Failed to load schedules.', error);
    }
  };

  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const newActivityMap = new Map<string, number>();
    [...plannedSchedule, ...actualSchedule].forEach(item => {
      const count = newActivityMap.get(item.dateISO) || 0;
      newActivityMap.set(item.dateISO, count + 1);
    });
    setActivityMap(newActivityMap);
  }, [plannedSchedule, actualSchedule]);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDateString = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  }

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const [filteredPlannedSchedule, setFilteredPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [filteredActualSchedule, setFilteredActualSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filteredPlanned = plannedSchedule.filter(item => item.dateISO === selectedDateString);
    setFilteredPlannedSchedule(filteredPlanned);

    const filteredActual = actualSchedule.filter(item => item.dateISO === selectedDateString);
    setFilteredActualSchedule(filteredActual);
  }, [selectedDate, plannedSchedule, actualSchedule]);

  const ComparisonTimeline = () => (
    <View style={styles.timelineContainer}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ width: 48 }} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={styles.timelineHeaderText}>理想</Text>
          <Text style={styles.timelineHeaderText}>実際</Text>
        </View>
      </View>
      <View style={{ height: timelineHours.length * 80 }}>
        {timelineHours.map(hour => (
          <View key={hour} style={styles.hourContainer}>
            <Text style={styles.hourLabel}>{hour}:00</Text>
            <View style={styles.hourLine} />
          </View>
        ))}
        <View style={styles.scheduleItemsContainer}>
          <View style={{ flex: 1, position: 'relative' }}>
            {filteredPlannedSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <View key={index} style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }]}>
                  <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flex: 1, position: 'relative' }}>
            {filteredActualSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <View key={index} style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }, item.current && styles.currentItem]}>
                  <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );

  const SingleTimeline = () => (
    <View style={styles.timelineContainer}>
      <View style={{ height: timelineHours.length * 80 }}>
        {timelineHours.map(hour => (
          <View key={hour} style={styles.hourContainer}>
            <Text style={styles.hourLabel}>{hour}:00</Text>
            <View style={styles.hourLine} />
          </View>
        ))}
        <View style={[styles.scheduleItemsContainer, { left: 48, right: 0 }]}>
          <View style={{ flex: 1, position: 'relative' }}>
            {filteredActualSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <View key={index} style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }, item.current && styles.currentItem]}>
                  <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>Track your schedule and progress</Text>
      </View>

      <Card style={styles.calendarCard}>
        <View style={styles.monthNavigation}>
          <Pressable onPress={previousMonth} style={styles.navButton}>
            <ChevronLeft color="#475569" width={20} height={20} />
          </Pressable>
          <Text style={styles.monthName}>{monthName}</Text>
          <Pressable onPress={nextMonth} style={styles.navButton}>
            <ChevronRight color="#475569" width={20} height={20} />
          </Pressable>
        </View>

        <View style={styles.dayHeaders}>
          {days.map((day) => (
            <View key={day} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyDayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const activityCount = activityMap.get(dateString) || 0;

            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();

            const accessibilityLabel = `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${activityCount} events`;

            let activityStyle = {};
            if (activityCount > 0) {
              if (activityCount >= 3) {
                activityStyle = styles.activityCellHigh;
              } else {
                activityStyle = styles.activityCellLow;
              }
            }

            return (
              <View key={day} style={{ height: 56, width: '14.28%', justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dayCell,
                    isToday && styles.todayCell,
                    isSelected && styles.selectedCell,
                    !isToday && !isSelected && activityStyle,
                  ]}
                  accessibilityLabel={accessibilityLabel}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}>{day}</Text>
                  {(isToday || isSelected) && <View style={[styles.activityDot, isToday ? styles.todayDot : styles.selectedDot]} />}
                </Pressable>
              </View>
            );
          })}
        </View>
      </Card>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.headerTitle}>{selectedDateString}</Text>
        <View style={styles.tabsContainer}>
          <Pressable style={[styles.tab, activeTab === 'comparison' && styles.activeTab]} onPress={() => setActiveTab('comparison')}>
            <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>比較表示</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'single' && styles.activeTab]} onPress={() => setActiveTab('single')}>
            <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>実際のみ</Text>
          </Pressable>
        </View>

        {activeTab === 'comparison' ? <ComparisonTimeline /> : <SingleTimeline />}
      </View>

    </ScrollView>
  );
}

import { colors } from '../theme';

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