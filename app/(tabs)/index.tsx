
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { z } from 'zod';
import { Card } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { ComparisonTimeline } from '@/src/features/today/ComparisonTimeline';
import { ScheduleModal } from '@/src/features/today/ScheduleModal';
import { SingleTimeline } from '@/src/features/today/SingleTimeline';
import useLocalization from '@/src/hooks/useLocalization';
import { colors } from '@/src/theme/theme';
import { ScheduleItemSchema } from '@/src/types/schemas';

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

const startMinutes = 0;

export default function TodayScreen() {
  const { t } = useLocalization();
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
  const hasLoadedRef = React.useRef(false);

  useEffect(() => {
    loadSchedules().then(() => {
      hasLoadedRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      saveSchedules();
    }
  }, [plannedSchedule, actualSchedule]);

  useEffect(() => {
    if (plannedSchedule.length > 0 || actualSchedule.length > 0) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const y = ((currentMinutes - startMinutes) / 60) * 80;
      scrollViewRef.current?.scrollTo({ y, animated: false });
    }
  }, [plannedSchedule, actualSchedule]);

  const loadSchedules = async () => {
    try {
      const storedPlannedSchedule = await AsyncStorage.getItem('plannedSchedule');
      if (storedPlannedSchedule !== null) {
        const parsed = JSON.parse(storedPlannedSchedule);
        const validated = z.array(ScheduleItemSchema).safeParse(parsed);
        if (validated.success) {
          setPlannedSchedule(validated.data);
        } else {
          console.error('Invalid planned schedule data:', validated.error);
        }
      }
      const storedActualSchedule = await AsyncStorage.getItem('actualSchedule');
      if (storedActualSchedule !== null) {
        const parsed = JSON.parse(storedActualSchedule);
        const validated = z.array(ScheduleItemSchema).safeParse(parsed);
        if (validated.success) {
          setActualSchedule(validated.data);
        } else {
          console.error('Invalid actual schedule data:', validated.error);
        }
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
    Alert.alert(t('common.deleteScheduleTitle'), t('common.deleteScheduleMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.ok'), onPress: () => {
          if (isActual) {
            setActualSchedule(actualSchedule.filter(item => item.id !== id));
          } else {
            setPlannedSchedule(plannedSchedule.filter(item => item.id !== id));
          }
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
  const dateString = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const handleSelectSchedule = (item: ScheduleItem, isActual: boolean) => {
    setSelectedSchedule(item);
    setIsActual(isActual);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{dateString}</Text>
      </View>

      <View style={styles.statsContainer}>
        {/* Stats cards */}
      </View>

      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>{t('today.progress')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Progress value={calculateProgress()} />
          <Text style={styles.progressPercentage}>{calculateProgress()}%</Text>
        </View>
      </Card>

      <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.tabsContainer}>
          <Pressable style={[styles.tab, activeTab === 'comparison' && styles.activeTab]} onPress={() => setActiveTab('comparison')}>
            <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>{t('calendar.comparison')}</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'single' && styles.activeTab]} onPress={() => setActiveTab('single')}>
            <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>{t('calendar.single')}</Text>
          </Pressable>
        </View>

        {activeTab === 'comparison' ? (
          <ComparisonTimeline
            plannedSchedule={plannedSchedule}
            actualSchedule={actualSchedule}
            onSelectSchedule={handleSelectSchedule}
          />
        ) : (
          <SingleTimeline
            actualSchedule={actualSchedule}
            onSelectSchedule={handleSelectSchedule}
          />
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => {
        setSelectedSchedule(null);
        setIsActual(false); // or default to actual based on activeTab
        setNewScheduleTitle('');
        setNewScheduleStartTime('');
        setNewScheduleDuration('');
        setModalVisible(true);
      }}>
        <Plus color="white" width={24} height={24} />
      </Pressable>

      <ScheduleModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedSchedule={selectedSchedule}
        newScheduleTitle={newScheduleTitle}
        setNewScheduleTitle={setNewScheduleTitle}
        newScheduleStartTime={newScheduleStartTime}
        setNewScheduleStartTime={setNewScheduleStartTime}
        newScheduleDuration={newScheduleDuration}
        setNewScheduleDuration={setNewScheduleDuration}
        isActual={isActual}
        setIsActual={setIsActual}
        handleAddScheduleItem={handleAddScheduleItem}
        deleteScheduleItem={deleteScheduleItem}
      />
    </View>
  );
}



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
