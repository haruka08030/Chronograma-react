import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

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

export default function TodayScreen() {
  const [plannedSchedule, setPlannedSchedule] = useState<ScheduleItem[]>([]);
  const [actualSchedule, setActualSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState('comparison');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState(new Date());
  const [newScheduleStartTime, setNewScheduleStartTime] = useState('');
  const [newScheduleDuration, setNewScheduleDuration] = useState('');
  const [isActual, setIsActual] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

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
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const y = ((currentMinutes - startMinutes) / 60) * 80;
    scrollViewRef.current?.scrollTo({ y, animated: false });
  }, []);

  useEffect(() => {
    saveSchedules();
  }, [plannedSchedule, actualSchedule]);

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
      dateISO: newScheduleDate.toISOString().split('T')[0],
      startTime: newScheduleStartTime,
      durationMin: parseInt(newScheduleDuration, 10),
      type: 'task',
      color: { bg: '#eff6ff', border: '#bae6fd' },
    };
    if (isActual) {
      setActualSchedule([...actualSchedule, newSchedule]);
    } else {
      setPlannedSchedule([...plannedSchedule, newSchedule]);
    }
    setNewScheduleTitle('');
    setNewScheduleStartTime('');
    setNewScheduleDuration('');
    setModalVisible(false);
  };

  const updateScheduleItem = () => {
    if (!selectedSchedule) return;
    if (isActual) {
      setActualSchedule(actualSchedule.map(item =>
        item.id === selectedSchedule.id ? { ...item, title: newScheduleTitle, startTime: newScheduleStartTime, durationMin: parseInt(newScheduleDuration, 10) } : item
      ));
    } else {
      setPlannedSchedule(plannedSchedule.map(item =>
        item.id === selectedSchedule.id ? { ...item, title: newScheduleTitle, startTime: newScheduleStartTime, durationMin: parseInt(newScheduleDuration, 10) } : item
      ));
    }
    setNewScheduleTitle('');
    setNewScheduleStartTime('');
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

  const calculateProgress = () => {
    if (actualSchedule.length === 0) return 0;
    const completedItems = actualSchedule.filter(item => item.completed).length;
    return Math.round((completedItems / actualSchedule.length) * 100);
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
                <Pressable key={index} onPress={() => {
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
                <Pressable key={index} onPress={() => {
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
                <Pressable key={index} onPress={() => {
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{dateString}</Text>
      </View>

      <View style={styles.statsContainer}>
        {/* Stats cards */}
      </View>

      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Progress value={calculateProgress()} />
          <Text style={styles.progressPercentage}>{calculateProgress()}%</Text>
        </View>
      </Card>

      <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.contentContainer}>
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
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Title"
              value={newScheduleTitle}
              onChangeText={setNewScheduleTitle}
            />
            <TextInput
              style={styles.modalTextInput}
              placeholder="Start Time (e.g., 10:00)"
              value={newScheduleStartTime}
              onChangeText={setNewScheduleStartTime}
            />
            <TextInput
              style={styles.modalTextInput}
              placeholder="Duration (in minutes)"
              value={newScheduleDuration}
              onChangeText={setNewScheduleDuration}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Switch value={isActual} onValueChange={setIsActual} />
              <Text style={{ marginLeft: 8 }}>Actual Schedule</Text>
            </View>
            <Button title={selectedSchedule ? "Update" : "Add"} onPress={handleAddScheduleItem} />
            {selectedSchedule && <Button title="Delete" onPress={() => deleteScheduleItem(selectedSchedule.id)} color="red" />}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

import { colors } from '../theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 80 },
  headerContainer: { paddingHorizontal: 16, paddingTop: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerDate: { fontSize: 16, color: colors.textMuted },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  progressCard: { padding: 16, borderRadius: 16, backgroundColor: colors.primaryLight, marginHorizontal: 16, marginBottom: 16 },
  progressTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  progressPercentage: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginLeft: 8 },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: 'white' },
  tabText: { textAlign: 'center', color: colors.textMuted },
  activeTabText: { color: colors.text, fontWeight: 'bold' },
  timelineContainer: { marginTop: 16 },
  timelineHeaderText: { color: colors.textSubtle, fontSize: 12 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: colors.textSubtle, fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: colors.border },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: colors.primary },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  progressContainer: { height: 8, backgroundColor: colors.border, borderRadius: 4 },
  progressBar: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  fab: { position: 'absolute', bottom: 60, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', width: '80%' },
  modalTextInput: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
});
