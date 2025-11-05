import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Button, Alert } from 'react-native';
import { Sunrise, BookOpen, Dumbbell, Utensils, Moon, Code, Coffee, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.badge, style]}>{children}</View>
);

interface Habit {
  id: number;
  name: string;
  icon: string;
  time: string;
  color: { bg: string; text: string };
  completion: boolean[];
}

const iconMap: { [key: string]: React.FC<any> } = {
  Sunrise,
  BookOpen,
  Dumbbell,
  Utensils,
  Moon,
  Code,
  Coffee,
};

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('09:00 AM');
  const [newHabitColor, setNewHabitColor] = useState('#f5f3ff');

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits !== null) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Failed to load habits.', error);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits.', error);
    }
  };

  const toggleHabitCompletion = (habitId: number, dayIndex: number) => {
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

  const handleAddHabit = () => {
    if (selectedHabit) {
      updateHabit();
    } else {
      addHabit();
    }
  };

  const addHabit = () => {
    if (newHabitName.trim() === '') return;
    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName,
      time: newHabitTime,
      icon: 'Sunrise',
      color: { bg: newHabitColor, text: '#7c3aed' },
      completion: [false, false, false, false, false, false, false],
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitTime('09:00 AM');
    setNewHabitColor('#f5f3ff');
    setModalVisible(false);
  };

  const updateHabit = () => {
    if (!selectedHabit) return;
    setHabits(habits.map(habit =>
      habit.id === selectedHabit.id ? { ...habit, name: newHabitName, time: newHabitTime, icon: 'Sunrise', color: { bg: newHabitColor, text: habit.color.text } } : habit
    ));
    setNewHabitName('');
    setNewHabitTime('09:00 AM');
    setNewHabitColor('#f5f3ff');
    setSelectedHabit(null);
    setModalVisible(false);
  };

  const deleteHabit = (id: number) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => setHabits(habits.filter(habit => habit.id !== id)) },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Habits</Text>
          <Text style={styles.headerSubtitle}>Build consistency, track progress</Text>
        </View>

        <Card style={styles.weeklyOverviewCard} children={undefined}>
          {/* Weekly overview content */}
        </Card>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.listTitle}>Your Habits</Text>
          {habits.map((habit: Habit) => {
            const Icon = iconMap[habit.icon];
            const streak = calculateStreak(habit.completion);

            return (
              <Pressable key={habit.id} onPress={() => {
                setSelectedHabit(habit);
                setModalVisible(true);
              }}>
                <Card style={styles.habitCard}>
                  <View style={styles.habitInfoContainer}>
                    <View style={[styles.habitIconContainer, { backgroundColor: habit.color.bg }]}>
                      {Icon && <Icon color={habit.color.text} width={24} height={24} />}
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
                    {habit.completion.map((completed: boolean, index: number) => (
                      <Pressable key={index} onPress={() => toggleHabitCompletion(habit.id, index)}>
                        <View style={[styles.progressDot, completed ? styles.completedDot : styles.incompleteDot]} />
                      </Pressable>
                    ))}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable style={styles.fab} onPress={() => {
        setSelectedHabit(null);
        setNewHabitName('');
        setNewHabitTime('09:00 AM');
        setNewHabitColor('#f5f3ff');
        setModalVisible(true);
      }}>
        <Plus color="white" width={24} height={24} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>習慣追加</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>習慣名</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: ランニング"
              value={newHabitName}
              onChangeText={setNewHabitName}
            />
            <Text style={styles.inputLabel}>時刻</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="--:-- --"
              value={newHabitTime}
              onChangeText={setNewHabitTime}
            />
            <Text style={styles.inputLabel}>色</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: #f5f3ff"
              value={newHabitColor}
              onChangeText={setNewHabitColor}
            />
            <Pressable style={styles.primaryButton} onPress={handleAddHabit}>
              <Text style={styles.primaryButtonText}>{selectedHabit ? "習慣を更新" : "追加"}</Text>
            </Pressable>
            {selectedHabit && <Button title="Delete Habit" onPress={() => deleteHabit(selectedHabit.id)} color="red" />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16, paddingBottom: 80 },
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
  fab: { position: 'absolute', bottom: 60, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  closeButton: { fontSize: 24, color: '#64748b' },
  inputLabel: { fontSize: 16, color: '#1e293b', marginBottom: 8, marginTop: 16 },
  modalTextInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, width: '100%' },
  primaryButton: { backgroundColor: '#1e293b', padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});