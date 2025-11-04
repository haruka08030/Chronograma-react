import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Sunrise, BookOpen, Dumbbell, Utensils, Moon, Code, Coffee } from 'lucide-react-native';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.badge, style]}>{children}</View>
);

interface Habit {
  id: number;
  name: string;
  icon: any;
  time: string;
  color: { bg: string; text: string };
  completion: boolean[];
}

export default function HabitsScreen() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const habits: Habit[] = [
    { id: 1, name: 'Morning Routine', icon: Sunrise, time: '6:00 AM', color: { bg: '#f5f3ff', text: '#7c3aed' }, completion: [true, true, true, false, true, true, false] },
    { id: 2, name: 'Study Session', icon: BookOpen, time: '8:00 AM', color: { bg: '#eff6ff', text: '#2563eb' }, completion: [true, true, false, true, true, false, false] },
    { id: 3, name: 'Workout', icon: Dumbbell, time: '3:00 PM', color: { bg: '#ffe4e6', text: '#e11d48' }, completion: [true, false, true, true, true, false, false] },
    { id: 4, name: 'Healthy Meal', icon: Utensils, time: '12:00 PM', color: { bg: '#f0fdf4', text: '#16a34a' }, completion: [true, true, true, true, true, true, false] },
  ];

  const calculateStreak = (completion: boolean[]) => {
    let streak = 0;
    for (let i = completion.length - 1; i >= 0; i--) {
      if (completion[i]) streak++;
      else break;
    }
    return streak;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Habits</Text>
        <Text style={styles.headerSubtitle}>Build consistency, track progress</Text>
      </View>

      {/* Weekly Overview */}
      <Card style={styles.weeklyOverviewCard} children={undefined}>
        {/* Weekly overview content */}
      </Card>

      {/* Habits List */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.listTitle}>Your Habits</Text>
        {habits.map((habit) => {
          const Icon = habit.icon;
          const streak = calculateStreak(habit.completion);
          return (
            <Card key={habit.id} style={styles.habitCard}>
              <View style={styles.habitInfoContainer}>
                <View style={[styles.habitIconContainer, { backgroundColor: habit.color.bg }]}>
                  <Icon color={habit.color.text} width={24} height={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitTime}>{habit.time}</Text>
                  <Badge style={styles.streakBadge}>
                    <Text style={styles.streakText}>🔥 {streak} day streak</Text>
                  </Badge>
                </View>
              </View>
              <View style={styles.weeklyProgressContainer}>
                {habit.completion.map((completed, index) => (
                  <View key={index} style={[styles.progressDot, completed ? styles.completedDot : styles.incompleteDot]} />
                ))}
              </View>
            </Card>
          );
        })}
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
  weeklyOverviewCard: { padding: 16, borderRadius: 16, backgroundColor: '#f0f5ff', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  habitCard: { padding: 16, borderRadius: 12, backgroundColor: 'white', marginBottom: 12 },
  habitInfoContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  habitIconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  habitName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  habitTime: { fontSize: 12, color: '#64748b', marginTop: 2 },
  streakBadge: { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 8 },
  streakText: { color: '#f97316', fontSize: 12 },
  weeklyProgressContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  progressDot: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 2 },
  completedDot: { backgroundColor: '#4ade80' },
  incompleteDot: { backgroundColor: '#e2e8f0' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
