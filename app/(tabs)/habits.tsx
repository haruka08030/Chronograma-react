
import { Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/src/components/ui/badge';
import { Card } from '@/src/components/ui/card';
import { HabitItem } from '@/src/features/habits/components/HabitItem';
import { HabitModal } from '@/src/features/habits/components/HabitModal';
import { getHabits, setHabits } from '@/src/features/habits/repo';
import { Habit } from '@/src/features/habits/schema';
import { calculateWeeklyRate, getOverallLongestStreak } from '@/src/features/habits/service';
import useLocalization from '@/src/hooks/useLocalization';

export default function HabitsScreen() {
  const { t } = useLocalization();
  const [habits, setHabitsState] = useState<Habit[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'dumbbell',
    time: '',
    color: { bg: '#f5f3ff', text: '#7c3aed' },
  });
  const insets = useSafeAreaInsets();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const colorOptions = [
    { label: 'Purple', bg: '#f5f3ff', text: '#7c3aed' },
    { label: 'Blue', bg: '#eff6ff', text: '#2563eb' },
    { label: 'Rose', bg: '#fef2f2', text: '#ef4444' },
    { label: 'Green', bg: '#f0fdf4', text: '#22c55e' },
    { label: 'Amber', bg: '#fefce8', text: '#f59e0b' },
    { label: 'Cyan', bg: '#ecfeff', text: '#06b6d4' },
    { label: 'Indigo', bg: '#eef2ff', text: '#4f46e5' },
  ];

  useEffect(() => {
    const loadHabits = async () => {
      const loadedHabits = await getHabits();
      if (loadedHabits) {
        setHabitsState(loadedHabits);
      } else {
        Alert.alert('Error', 'Failed to load habits.');
      }
    };
    loadHabits();
  }, []);

  useEffect(() => {
    setHabits(habits);
  }, [habits]);

  const handleAddHabit = () => {
    if (!formData.name.trim() || !formData.time) return;

    const newHabit: Habit = {
      id: editingHabit?.id || Date.now().toString(),
      name: formData.name,
      icon: formData.icon,
      time: formData.time,
      color: formData.color,
      completion: editingHabit?.completion || Array(7).fill(false),
      history: editingHabit?.history || [],
    };

    if (editingHabit) {
      setHabitsState(habits.map(habit => habit.id === editingHabit.id ? newHabit : habit));
    } else {
      setHabitsState([...habits, newHabit]);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      icon: habit.icon,
      time: habit.time,
      color: habit.color,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHabitsState(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (habitId: string, dayIndex: number) => {
    setHabitsState(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletion = [...habit.completion];
        newCompletion[dayIndex] = !newCompletion[dayIndex];
        const newHistory = [...habit.history];
        newHistory[newHistory.length - 7 + dayIndex] = newCompletion[dayIndex];
        return { ...habit, completion: newCompletion, history: newHistory };
      }
      return habit;
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'dumbbell',
      time: '',
      color: { bg: '#eff6ff', text: '#2563eb' },
    });
    setEditingHabit(null);
  };

  const renderItem = useCallback(({ item }: { item: Habit }) => (
    <HabitItem
      item={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleCompletion={toggleCompletion}
    />
  ), []);

  const keyExtractor = (item: Habit) => item.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { paddingTop: insets.top, paddingHorizontal: 16, marginBottom: 16 }]}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('habits.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('habits.subtitle')}</Text>
        </View>
      </View>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            {/* Weekly Overview */}
            <Card style={styles.weeklyOverviewCard}>
              <View style={styles.weeklyOverviewContent}>
                <View style={styles.weeklyOverviewHeader}>
                  <Text style={styles.weeklyOverviewTitle}>{t('habits.thisWeek')}</Text>
                  <Badge style={styles.weeklyOverviewBadge}>
                    <Text style={styles.weeklyOverviewBadgeText}>{calculateWeeklyRate(habits)}{t('habits.complete')}</Text>
                  </Badge>
                </View>
                <View style={styles.weekDaysContainer}>
                  {weekDays.map((day, index) => {
                    const today = new Date().getDay();
                    const isToday = today === 0 ? index === 6 : index === today - 1;
                    return (
                      <View
                        key={day}
                        style={[styles.weekDayItem, isToday ? styles.todayWeekDayItem : styles.normalWeekDayItem]}
                      >
                        <Text style={styles.weekDayText}>{day}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Card>

            {/* Habits List */}
            <View style={styles.habitsListContainer}>
              <Text style={styles.listTitle}>{t('habits.yourHabits')}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>{t('habits.addHabit')}</Text>
          </View>
        }
        ListFooterComponent={
          <>
            {habits.length > 0 && (
              <Card style={styles.statsCard}>
                <View style={styles.statsContent}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{habits.length}</Text>
                    <Text style={styles.statLabel}>{t('habits.activeHabits')}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{calculateWeeklyRate(habits)}%</Text>
                    <Text style={styles.statLabel}>{t('habits.weeklyRate')}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{getOverallLongestStreak(habits)}</Text>
                    <Text style={styles.statLabel}>{t('habits.longestStreak')}</Text>
                  </View>
                </View>
              </Card>
            )}
          </>
        }
      />

      {/* FAB */}
      <Pressable onPress={() => setIsAddDialogOpen(true)} style={styles.fabButton}>
        <Plus color="white" width={24} height={24} />
      </Pressable>

      <HabitModal
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        editingHabit={editingHabit}
        formData={formData}
        setFormData={setFormData}
        colorOptions={colorOptions}
        handleAddHabit={handleAddHabit}
        handleDelete={handleDelete}
      />
    </View>
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16, paddingBottom: 80 },

  // Header
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTextContainer: {},
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 16, color: colors.textMuted },

  // Weekly Overview
  weeklyOverviewCard: { padding: 16, borderRadius: 16, backgroundColor: colors.primaryLight, marginBottom: 16, borderColor: colors.primaryBorder, borderWidth: 1 },
  weeklyOverviewContent: {},
  weeklyOverviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  weeklyOverviewTitle: { fontSize: 16, color: colors.text },
  weeklyOverviewBadge: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  weeklyOverviewBadgeText: { color: 'white', fontSize: 12 },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  weekDayItem: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  todayWeekDayItem: { backgroundColor: colors.primary },
  normalWeekDayItem: { backgroundColor: 'white' },
  weekDayText: { fontSize: 12, color: colors.textMuted },

  // Habits List
  habitsListContainer: { marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  habitsGrid: { gap: 12 },
  habitItemCard: { padding: 16, borderRadius: 12, backgroundColor: 'white', borderColor: colors.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginBottom: 12 },
  habitItemContent: {},
  habitItemHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  habitIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  habitTextContainer: { flex: 1, minWidth: 0 },
  habitName: { fontSize: 16, color: colors.text },
  habitTime: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  habitStatsContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  streakBadge: { backgroundColor: colors.streakBadge, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderColor: colors.streakBorder, borderWidth: 1 },
  streakText: { color: colors.streak, fontSize: 12 },
  completionText: { fontSize: 12, color: colors.textSubtle },
  habitActions: { flexDirection: 'row', gap: 4, opacity: 0 }, // opacity will be handled by animation if needed
  actionButton: { padding: 4, borderRadius: 4 },

  // Weekly Progress Dots
  weeklyProgressContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 12 },
  progressSquare: { flex: 1, aspectRatio: 1, borderRadius: 6 },
  completedSquare: { backgroundColor: colors.completed },
  incompleteSquare: { backgroundColor: colors.border },

  // Empty State
  emptyStateContainer: { textAlign: 'center', paddingVertical: 48 },
  emptyStateText: { fontSize: 16, color: colors.textSubtle, textAlign: 'center' },

  // Stats Card
  statsCard: { padding: 16, borderRadius: 16, backgroundColor: colors.statsCard, borderColor: colors.statsCardBorder, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statsContent: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, color: colors.text, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: colors.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },

  // Modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSubtle },

  // Form
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, width: '100%', fontSize: 16, color: colors.text },
  selectContainer: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, width: '100%' },
  picker: { width: '100%', height: 50 },

  // Buttons
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: colors.rose, marginTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  // FAB
  fabButton: { position: 'absolute', bottom: 60, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
});