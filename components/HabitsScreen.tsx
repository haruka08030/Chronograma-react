import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Button, Alert } from 'react-native';
import { Sunrise, BookOpen, Dumbbell, Utensils, Moon, Code, Coffee, Plus, Edit2, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.badge, style]}>{children}</View>
);

interface Habit {

  id: string;

  name: string;

  icon: string;

  time: string;

  color: { bg: string; text: string };

  completion: boolean[];

}



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

  const [habits, setHabits] = useState<Habit[]>([]);

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



  // ローカルストレージから読み込み

  useEffect(() => {

    const loadHabits = async () => {

      try {

        const saved = await AsyncStorage.getItem('habits');

        if (saved) {

          setHabits(JSON.parse(saved));

        }

        else {

          // 初期データ

          setHabits([

            {

              id: '1',

              name: 'Morning Routine',

              icon: 'sunrise',

              time: '6:00 AM',

              color: { bg: '#f5f3ff', text: '#7c3aed' },

              completion: [true, true, true, false, true, true, false],

            },

            {

              id: '2',

              name: 'Study Session',

              icon: 'book',

              time: '8:00 AM',

              color: { bg: '#eff6ff', text: '#2563eb' },

              completion: [true, true, false, true, true, false, false],

            },

            {

              id: '3',

              name: 'Workout',

              icon: 'dumbbell',

              time: '3:00 PM',

              color: { bg: '#fef2f2', text: '#ef4444' },

              completion: [true, false, true, true, true, false, false],

            },

            {

              id: '4',

              name: 'Healthy Meal',

              icon: 'utensils',

              time: '12:00 PM',

              color: { bg: '#f0fdf4', text: '#22c55e' },

              completion: [true, true, true, true, true, true, false],

            },

            {

              id: '5',

              name: 'Project Work',

              icon: 'code',

              time: '5:00 PM',

              color: { bg: '#fefce8', text: '#f59e0b' },

              completion: [true, true, true, false, false, false, false],

            },

            {

              id: '6',

              name: 'Reading',

              icon: 'coffee',

              time: '8:00 PM',

              color: { bg: '#ecfeff', text: '#06b6d4' },

              completion: [false, true, false, true, true, false, false],

            },

            {

              id: '7',

              name: 'Sleep Schedule',

              icon: 'moon',

              time: '10:00 PM',

              color: { bg: '#eef2ff', text: '#4f46e5' },

              completion: [true, true, false, true, true, false, false],

            },

          ]);

        }

      } catch (error) {

        console.error('Failed to load habits.', error);

      }

    };

    loadHabits();

  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    const saveHabits = async () => {
      try {
        if (habits.length > 0) {
          await AsyncStorage.setItem('habits', JSON.stringify(habits));
        }
      } catch (error) {
        console.error('Failed to save habits.', error);
      }
    };
    saveHabits();
  }, [habits]);

  const handleAddHabit = () => {
    if (!formData.name.trim() || !formData.time) return;

    const newHabit: Habit = {
      id: editingHabit?.id || Date.now().toString(),
      name: formData.name,
      icon: formData.icon,
      time: formData.time,
      color: formData.color,
      completion: editingHabit?.completion || [false, false, false, false, false, false, false],
    };

    if (editingHabit) {
      setHabits(habits.map(habit => habit.id === editingHabit.id ? newHabit : habit));
    } else {
      setHabits([...habits, newHabit]);
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
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletion = [...habit.completion];
        newCompletion[dayIndex] = !newCompletion[dayIndex];
        return { ...habit, completion: newCompletion };
      }
      return habit;
    }));
  };

  const calculateStreak = (completion: boolean[]) => {
    let streak = 0;
    for (let i = completion.length - 1; i >= 0; i--) {
      if (completion[i]) streak++;
      else break;
    }
    return streak;
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
            <Text style={styles.headerTitle}>Habits</Text>
            <Text style={styles.headerSubtitle}>Build consistency, track progress</Text>
          </View>
          <Pressable onPress={() => setIsAddDialogOpen(true)} style={styles.addButton}>
            <Plus color="white" width={24} height={24} />
          </Pressable>
        </View>

        {/* Weekly Overview */}
        <Card style={styles.weeklyOverviewCard}>
          <View style={styles.weeklyOverviewContent}>
            <View style={styles.weeklyOverviewHeader}>
              <Text style={styles.weeklyOverviewTitle}>This Week</Text>
              <Badge style={styles.weeklyOverviewBadge}>
                <Text style={styles.weeklyOverviewBadgeText}>{calculateWeeklyRate()}% Complete</Text>
              </Badge>
            </View>
            <View style={styles.weekDaysContainer}>
              {weekDays.map((day, index) => {
                const isToday = index === 3; // Thursday is today
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
          <Text style={styles.listTitle}>Your Habits</Text>
          <View style={styles.habitsGrid}>
            {habits.map((habit) => {
              const Icon = iconMap[habit.icon] || Dumbbell;
              const streak = calculateStreak(habit.completion);
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
                            <Text style={styles.streakText}>🔥 {streak} day streak</Text>
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
            <Text style={styles.emptyStateText}>習慣を追加して、進捗を追跡しましょう</Text>
          </View>
        )}

        {/* Stats Card */}
        {habits.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{habits.length}</Text>
                <Text style={styles.statLabel}>Active Habits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{calculateWeeklyRate()}%</Text>
                <Text style={styles.statLabel}>Weekly Rate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.max(...habits.map(h => calculateStreak(h.completion)), 0)}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
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
              <Text style={styles.modalTitle}>{editingHabit ? '習慣編集' : '習慣追加'}</Text>
              <Pressable onPress={() => setIsAddDialogOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>習慣名</Text>
              <TextInput
                style={styles.input}
                placeholder="例: ランニング"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>時刻</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM AM/PM"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>アイコン</Text>
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
              <Text style={styles.primaryButtonText}>{editingHabit ? '更新' : '追加'}</Text>
            </Pressable>
            {editingHabit && (
              <Pressable onPress={() => handleDelete(editingHabit.id)} style={[styles.primaryButton, styles.deleteButton]}>
                <Text style={styles.primaryButtonText}>削除</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16, paddingBottom: 80 },

  // Header
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTextContainer: {},
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 16, color: '#475569' },
  addButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },

  // Weekly Overview
  weeklyOverviewCard: { padding: 16, borderRadius: 16, backgroundColor: '#f0f5ff', marginBottom: 16, borderColor: '#bfdbfe', borderWidth: 1 },
  weeklyOverviewContent: {},
  weeklyOverviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  weeklyOverviewTitle: { fontSize: 16, color: '#1e293b' },
  weeklyOverviewBadge: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  weeklyOverviewBadgeText: { color: 'white', fontSize: 12 },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  weekDayItem: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  todayWeekDayItem: { backgroundColor: '#2563eb' },
  normalWeekDayItem: { backgroundColor: 'white' },
  weekDayText: { fontSize: 12, color: '#475569' },

  // Habits List
  habitsListContainer: { marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  habitsGrid: { gap: 12 },
  habitItemCard: { padding: 16, borderRadius: 12, backgroundColor: 'white', borderColor: '#e2e8f0', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  habitItemContent: {},
  habitItemHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  habitIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  habitTextContainer: { flex: 1, minWidth: 0 },
  habitName: { fontSize: 16, color: '#1e293b' },
  habitTime: { fontSize: 12, color: '#475569', marginTop: 4 },
  habitStatsContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  streakBadge: { backgroundColor: '#fff7ed', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderColor: '#fed7aa', borderWidth: 1 },
  streakText: { color: '#f97316', fontSize: 12 },
  completionText: { fontSize: 12, color: '#64748b' },
  habitActions: { flexDirection: 'row', gap: 4, opacity: 0 }, // opacity will be handled by animation if needed
  actionButton: { padding: 4, borderRadius: 4 },

  // Weekly Progress Dots
  weeklyProgressContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 12 },
  progressSquare: { flex: 1, aspectRatio: 1, borderRadius: 6 },
  completedSquare: { backgroundColor: '#6ee7b7' },
  incompleteSquare: { backgroundColor: '#e2e8f0' },

  // Empty State
  emptyStateContainer: { textAlign: 'center', paddingVertical: 48 },
  emptyStateText: { fontSize: 16, color: '#94a3b8', textAlign: 'center' },

  // Stats Card
  statsCard: { padding: 16, borderRadius: 16, backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statsContent: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, color: '#1e293b', fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#475569' },
  statDivider: { width: 1, height: 32, backgroundColor: '#e2e8f0' },

  // Modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  closeButton: { fontSize: 24, color: '#64748b' },

  // Form
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#1e293b', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, width: '100%', fontSize: 16, color: '#1e293b' },
  selectContainer: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, width: '100%' },
  picker: { width: '100%', height: 50 },

  // Buttons
  primaryButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#ef4444', marginTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});