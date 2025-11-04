import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Button, Switch, Alert } from 'react-native';
import { Clock, Target, TrendingUp, Calendar, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function TodayScreen() {
  const [plannedSchedule, setPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [actualSchedule, setActualSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState('comparison');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleDuration, setNewScheduleDuration] = useState('');
  const [isActual, setIsActual] = useState(false);

  const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
    <View style={[styles.card, style]}>{children}</View>
  );
  
  const Progress = ({ value }: { value: number }) => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
  );

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    saveSchedules();
  }, [plannedSchedule, actualSchedule]);

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

  const saveSchedules = async () => {
    try {
      await AsyncStorage.setItem('plannedSchedule', JSON.stringify(plannedSchedule));
      await AsyncStorage.setItem('actualSchedule', JSON.stringify(actualSchedule));
    } catch (error) {
      console.error('Failed to save schedules.', error);
    }
  };

  const handleAddScheduleItem = () => {
    if (selectedSchedule) {
      updateScheduleItem();
    } else {
      addScheduleItem();
    }
  };

  const addScheduleItem = () => {
    if (newScheduleTitle.trim() === '') return;
    const newSchedule: ScheduleItem = {
      id: Date.now(),
      title: newScheduleTitle,
      time: newScheduleTime,
      duration: newScheduleDuration,
      type: 'task',
      color: { bg: '#eff6ff', border: '#bae6fd' },
    };
    if (isActual) {
      setActualSchedule([...actualSchedule, newSchedule]);
    } else {
      setPlannedSchedule([...plannedSchedule, newSchedule]);
    }
    setNewScheduleTitle('');
    setNewScheduleTime('');
    setNewScheduleDuration('');
    setModalVisible(false);
  };

  const updateScheduleItem = () => {
    if (!selectedSchedule) return;
    if (isActual) {
      setActualSchedule(actualSchedule.map(item =>
        item.id === selectedSchedule.id ? { ...item, title: newScheduleTitle, time: newScheduleTime, duration: newScheduleDuration } : item
      ));
    } else {
      setPlannedSchedule(plannedSchedule.map(item =>
        item.id === selectedSchedule.id ? { ...item, title: newScheduleTitle, time: newScheduleTime, duration: newScheduleDuration } : item
      ));
    }
    setNewScheduleTitle('');
    setNewScheduleTime('');
    setNewScheduleDuration('');
    setSelectedSchedule(null);
    setModalVisible(false);
  };

  const deleteScheduleItem = (id: number) => {
    Alert.alert("Delete Schedule Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK", onPress: () => {
          setPlannedSchedule(plannedSchedule.filter(item => item.id !== id));
          setActualSchedule(actualSchedule.filter(item => item.id !== id));
        }
      },
    ]);
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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
            {plannedSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <Pressable key={index} onLongPress={() => {
                  setSelectedSchedule(item);
                  setIsActual(false);
                  setModalVisible(true);
                }}>
                  <View style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }]}>
                    <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={{ flex: 1, position: 'relative' }}>
            {actualSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <Pressable key={index} onLongPress={() => {
                  setSelectedSchedule(item);
                  setIsActual(true);
                  setModalVisible(true);
                }}>
                  <View style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }, item.current && styles.currentItem]}>
                    <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                  </View>
                </Pressable>
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
                <Pressable key={index} onLongPress={() => {
                  setSelectedSchedule(item);
                  setIsActual(true);
                  setModalVisible(true);
                }}>
                  <View style={[styles.scheduleItem, { top, height, backgroundColor: item.color.bg, borderColor: item.color.border }, item.current && styles.currentItem]}>
                    <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Chronograma</Text>
          <Text style={styles.headerDate}>{dateString}</Text>
        </View>

        <View style={styles.statsContainer}>
          {/* Stats cards */}
        </View>

        <Card style={styles.progressCard}>
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

      <Pressable style={styles.fab} onPress={() => {
        setSelectedSchedule(null);
        setNewScheduleTitle('');
        setNewScheduleTime('');
        setNewScheduleDuration('');
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
            <TextInput
              style={styles.modalTextInput}
              placeholder="Title"
              value={newScheduleTitle}
              onChangeText={setNewScheduleTitle}
            />
            <TextInput
              style={styles.modalTextInput}
              placeholder="Time (e.g., 10:00)"
              value={newScheduleTime}
              onChangeText={setNewScheduleTime}
            />
            <TextInput
              style={styles.modalTextInput}
              placeholder="Duration (e.g., 1h 30m)"
              value={newScheduleDuration}
              onChangeText={setNewScheduleDuration}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Switch value={isActual} onValueChange={setIsActual} />
              <Text style={{ marginLeft: 8 }}>Actual Schedule</Text>
            </View>
            <Button title={selectedSchedule ? "Update" : "Add"} onPress={handleAddScheduleItem} />
            {selectedSchedule && <Button title="Delete" onPress={() => deleteScheduleItem(selectedSchedule.id)} color="red" />}
          </View>
        </View>
      </Modal>
    </View>
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
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', width: '80%' },
  modalTextInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
});
