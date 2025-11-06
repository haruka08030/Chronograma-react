import { Picker } from '@react-native-picker/picker';
import { BookOpen, Code, Coffee, Dumbbell, Edit2, Moon, Plus, Sunrise, Trash2, Utensils } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getHabits, setHabits } from '../../src/lib/storage';
import { Habit } from '../../src/types/habits';
import useLocalization from '../hooks/useLocalization';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.badge, style]}>{children}</View>
);

const iconMap: { [key: string]: React.FC<any> } = {
  sunrise: Sunrise,
  book: BookOpen,
  dumbbell: Dumbbell,
  utensils: Utensils,
  moon: Moon,
  code: Code,
  coffee: Coffee,
};

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

  const calculateStreak = (history: boolean[]) => {
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i]) streak++;
      else break;
    }
    return streak;
  };

  const calculateLongestStreak = (history: boolean[]) => {
    let longestStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i]) {
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        currentStreak = 0;
      }
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    return longestStreak;
  };

  const calculateCompletion = (completion: boolean[]) => {
    const completed = completion.filter(Boolean).length;
    return Math.round((completed / completion.length) * 100);
  };

  const calculateWeeklyRate = () => {
    if (habits.length === 0) return 0;
    const totalSlots = habits.length * 7;
    const completedSlots = habits.reduce((sum, habit) =>
      sum + habit.completion.filter(Boolean).length, 0
    );
    return Math.round((completedSlots / totalSlots) * 100);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{t('habits.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('habits.subtitle')}</Text>
          </View>
          <Pressable onPress={() => setIsAddDialogOpen(true)} style={styles.addButton}>
            <Plus color="white" width={24} height={24} />
          </Pressable>
        </View>

        {/* Weekly Overview */}
        <Card style={styles.weeklyOverviewCard}>
          <View style={styles.weeklyOverviewContent}>
            <View style={styles.weeklyOverviewHeader}>
              <Text style={styles.weeklyOverviewTitle}>{t('habits.thisWeek')}</Text>
              <Badge style={styles.weeklyOverviewBadge}>
                <Text style={styles.weeklyOverviewBadgeText}>{calculateWeeklyRate()}{t('habits.complete')}</Text>
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
          <View style={styles.habitsGrid}>
            {habits.map((habit) => {
              const Icon = iconMap[habit.icon] || Dumbbell;
              const streak = calculateStreak(habit.history);
              const longestStreak = calculateLongestStreak(habit.history);
              const completionPercentage = calculateCompletion(habit.completion);

              return (
                <Card
                  key={habit.id}
                  style={styles.habitItemCard}
                >
                  <View style={styles.habitItemContent}>
                    <View style={styles.habitItemHeader}>
                      <View style={[styles.habitIconBg, { backgroundColor: habit.color.bg }]}>
                        {Icon && <Icon color={habit.color.text} width={24} height={24} />}
                      </View>
                      <View style={styles.habitTextContainer}>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.habitTime}>{habit.time}</Text>
                        <View style={styles.habitStatsContainer}>
                          <Badge style={styles.streakBadge}>
                            <Text style={styles.streakText}>🔥 {streak} {t('habits.dayStreak')}</Text>
                          </Badge>
                          <Text style={styles.completionText}>{completionPercentage}%</Text>
                        </View>
                      </View>
                      <View style={styles.habitActions}>
                        <Pressable
                          onPress={() => handleEdit(habit)}
                          style={styles.actionButton}
                        >
                          <Edit2 color="#2563eb" width={16} height={16} />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(habit.id)}
                          style={styles.actionButton}
                        >
                          <Trash2 color="#ef4444" width={16} height={16} />
                        </Pressable>
                      </View>
                    </View>

                    {/* Weekly Progress */}
                    <View style={styles.weeklyProgressContainer}>
                      {habit.completion.map((completed, index) => (
                        <Pressable
                          key={index}
                          onPress={() => toggleCompletion(habit.id, index)}
                          style={[styles.progressSquare, completed ? styles.completedSquare : styles.incompleteSquare]}
                        />
                      ))}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Empty State */}
        {habits.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>{t('habits.addHabit')}</Text>
          </View>
        )}

        {/* Stats Card */}
        {habits.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{habits.length}</Text>
                <Text style={styles.statLabel}>{t('habits.activeHabits')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{calculateWeeklyRate()}%</Text>
                <Text style={styles.statLabel}>{t('habits.weeklyRate')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.max(...habits.map(h => calculateLongestStreak(h.history)), 0)}</Text>
                <Text style={styles.statLabel}>{t('habits.longestStreak')}</Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddDialogOpen}
        onRequestClose={() => setIsAddDialogOpen(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setIsAddDialogOpen(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingHabit ? t('habits.editHabit') : t('habits.addHabitTitle')}</Text>
              <Pressable onPress={() => setIsAddDialogOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('habits.habitName')}</Text>
              <TextInput
                style={styles.input}
                placeholder="例: ランニング"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('habits.time')}</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM AM/PM"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('habits.icon')}</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={formData.icon}
                  onValueChange={(itemValue) => setFormData({ ...formData, icon: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="🌅 朝" value="sunrise" />
                  <Picker.Item label="📚 勉強" value="book" />
                  <Picker.Item label="💪 運動" value="dumbbell" />
                  <Picker.Item label="🍽️ 食事" value="utensils" />
                  <Picker.Item label="💻 作業" value="code" />
                  <Picker.Item label="☕ 読書" value="coffee" />
                  <Picker.Item label="🌙 睡眠" value="moon" />
                </Picker>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>色</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={formData.color}
                  onValueChange={(itemValue) => setFormData({ ...formData, color: itemValue as { bg: string; text: string } })}
                  style={styles.picker}
                >
                  {colorOptions.map(option => (
                    <Picker.Item key={option.label} label={option.label} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
            <Pressable onPress={handleAddHabit} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{editingHabit ? t('habits.update') : t('habits.add')}</Text>
            </Pressable>
            {editingHabit && (
              <Pressable onPress={() => handleDelete(editingHabit.id)} style={[styles.primaryButton, styles.deleteButton]}>
                <Text style={styles.primaryButtonText}>{t('habits.delete')}</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

import { colors } from '../theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16, paddingBottom: 80 },

  // Header
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTextContainer: {},
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 16, color: colors.textMuted },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },

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
  habitItemCard: { padding: 16, borderRadius: 12, backgroundColor: 'white', borderColor: colors.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
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
});