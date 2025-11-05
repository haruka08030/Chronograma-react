import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  duration: string;
  type: string;
  color: { bg: string; border: string };
  delayed?: boolean;
  completed?: boolean;
  current?: boolean;
  unplanned?: boolean;
}

const timelineHours = Array.from({ length: 24 }, (_, i) => i);

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const durationToMinutes = (duration: string): number => {
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)m/);
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  return hours * 60 + minutes;
};

const startMinutes = 0;

const calculatePosition = (item: ScheduleItem) => {
  const itemMinutes = timeToMinutes(item.time);
  const duration = durationToMinutes(item.duration);
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
        setPlannedSchedule(JSON.parse(storedPlannedSchedule));
      }
      const storedActualSchedule = await AsyncStorage.getItem('actualSchedule');
      if (storedActualSchedule !== null) {
        setActualSchedule(JSON.parse(storedActualSchedule));
      }
    } catch (error) {
      console.error('Failed to load schedules.', error);
    }
  };

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
  const activityDays = [2, 5, 8, 9, 12, 15, 16, 19, 22, 23, 26, 29];
  const today = new Date();

  const [filteredPlannedSchedule, setFilteredPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [filteredActualSchedule, setFilteredActualSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const filteredPlanned = plannedSchedule.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate.getDate() === selectedDate.getDate() &&
             itemDate.getMonth() === selectedDate.getMonth() &&
             itemDate.getFullYear() === selectedDate.getFullYear();
    });
    setFilteredPlannedSchedule(filteredPlanned);

    const filteredActual = actualSchedule.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate.getDate() === selectedDate.getDate() &&
             itemDate.getMonth() === selectedDate.getMonth() &&
             itemDate.getFullYear() === selectedDate.getFullYear();
    });
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
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const hasActivity = activityDays.includes(day);

            return (
              <Pressable
                key={day}
                onPress={() => setSelectedDate(date)}
                style={[styles.dayCell, 
                  isToday && styles.todayCell, 
                  isSelected && styles.selectedCell,
                  hasActivity && !isToday && !isSelected && styles.activityCell
                ]}
              >
                <Text style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText,
                  hasActivity && !isToday && !isSelected && styles.activityText
                ]}>{day}</Text>
                {hasActivity && !isToday && !isSelected && <View style={styles.activityDot} />}
              </Pressable>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 16, color: '#475569' },
  calendarCard: { padding: 16, borderRadius: 16, backgroundColor: 'white', marginBottom: 16 },
  timelineContainer: { marginTop: 16 },
  monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navButton: { padding: 8, borderRadius: 20 },
  monthName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  dayHeaders: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayHeader: { width: '14.28%', alignItems: 'center' },
  dayHeaderText: { fontSize: 12, color: '#64748b' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  dayText: { fontSize: 14, color: '#334155' },
  todayCell: { backgroundColor: '#2563eb' },
  todayText: { color: 'white' },
  selectedCell: { backgroundColor: '#7c3aed' },
  selectedText: { color: 'white' },
  activityCell: { backgroundColor: '#eff6ff' },
  activityText: { color: '#1e293b' },
  activityDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#2563eb', marginTop: 2 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: 'white' },
  tabText: { textAlign: 'center', color: '#475569' },
  activeTabText: { color: '#1e293b', fontWeight: 'bold' },
  timelineHeaderText: { color: '#64748b', fontSize: 12 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: '#94a3b8', fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: '#2563eb' },
});