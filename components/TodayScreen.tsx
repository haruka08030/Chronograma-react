import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Progress = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${value}%` }]} />
  </View>
);

interface ScheduleItem {
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

const plannedSchedule: ScheduleItem[] = [
  { time: '6:00', title: 'Morning Routine', duration: '1h', type: 'habit', color: { bg: '#f5f3ff', border: '#ddd6fe' } },
  { time: '7:00', title: 'Breakfast', duration: '30m', type: 'meal', color: { bg: '#f0fdf4', border: '#bbf7d0' } },
  { time: '8:00', title: 'Math Class', duration: '2h', type: 'class', color: { bg: '#f0f9ff', border: '#bae6fd' } },
];

const actualSchedule: ScheduleItem[] = [
  { time: '6:30', title: 'Morning Routine', duration: '45m', type: 'habit', color: { bg: '#f5f3ff', border: '#ddd6fe' }, delayed: true },
  { time: '7:15', title: 'Breakfast', duration: '25m', type: 'meal', color: { bg: '#f0fdf4', border: '#bbf7d0' }, completed: true },
  { time: '8:00', title: 'Math Class', duration: '2h', type: 'class', color: { bg: '#f0f9ff', border: '#bae6fd' }, current: true },
];

const timelineHours = Array.from({ length: 18 }, (_, i) => i + 6);

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

const startMinutes = 6 * 60;

const calculatePosition = (item: ScheduleItem) => {
  const itemMinutes = timeToMinutes(item.time);
  const duration = durationToMinutes(item.duration);
  const topPosition = ((itemMinutes - startMinutes) / 60) * 80;
  const height = (duration / 60) * 80;
  return { top: topPosition, height };
};

const ComparisonTimeline = () => (
  <View style={styles.timelineContainer}>
    {/* Timeline header */}
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      <View style={{ width: 48 }} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
        <Text style={styles.timelineHeaderText}>理想</Text>
        <Text style={styles.timelineHeaderText}>実際</Text>
      </View>
    </View>
    {/* Timeline body */}
    <View style={{ height: timelineHours.length * 80 }}>
      {/* Hour labels and lines */}
      {timelineHours.map(hour => (
        <View key={hour} style={styles.hourContainer}>
          <Text style={styles.hourLabel}>{hour}:00</Text>
          <View style={styles.hourLine} />
        </View>
      ))}
      {/* Schedule items */}
      <View style={styles.scheduleItemsContainer}>
        <View style={{ flex: 1, position: 'relative' }}>
          {plannedSchedule.map((item, index) => {
            const { top, height } = calculatePosition(item);
            return (
              <View key={index} style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }]}>
                <Text style={styles.scheduleItemTitle}>{item.title}</Text>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, position: 'relative' }}>
          {actualSchedule.map((item, index) => {
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
          {actualSchedule.map((item, index) => {
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

export default function TodayScreen() {
  const [activeTab, setActiveTab] = useState('comparison');
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{dateString}</Text>
      </View>

      <View style={styles.statsContainer}>
        {/* Stats cards */}
      </View>

      <Card style={styles.progressCard} children={undefined}>
        {/* Progress summary */}
      </Card>

      <View style={styles.tabsContainer}>
        <Pressable style={[styles.tab, activeTab === 'comparison' && styles.activeTab]} onPress={() => setActiveTab('comparison')}>
          <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>比較表示</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'single' && styles.activeTab]} onPress={() => setActiveTab('single')}>
          <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>実際のみ</Text>
        </Pressable>
      </View>

      {activeTab === 'comparison' ? <ComparisonTimeline /> : <SingleTimeline />}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerDate: { fontSize: 16, color: '#475569' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  progressCard: { padding: 16, borderRadius: 16, backgroundColor: '#f0f5ff', marginBottom: 16 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: 'white' },
  tabText: { textAlign: 'center', color: '#475569' },
  activeTabText: { color: '#1e293b', fontWeight: 'bold' },
  timelineContainer: { marginTop: 16 },
  timelineHeaderText: { color: '#64748b', fontSize: 12 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: '#94a3b8', fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: '#2563eb' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  progressContainer: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 },
  progressBar: { height: 8, backgroundColor: '#2563eb', borderRadius: 4 },
});