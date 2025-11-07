
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/theme';
import { ScheduleItem } from '@/types/schemas';

/** props 型 */
interface SingleTimelineProps {
  actualSchedule: ScheduleItem[];
  onSelectSchedule: (item: ScheduleItem, isActual: boolean) => void;
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

export const SingleTimeline: React.FC<SingleTimelineProps> = ({ actualSchedule, onSelectSchedule }) => {
  return (
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
            {actualSchedule.map((item: ScheduleItem, index: number) => {
              const { top, height } = calculatePosition(item);
              return (
                <Pressable key={index} onPress={() => onSelectSchedule(item, true)}>
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
};

const styles = StyleSheet.create({
  timelineContainer: { marginTop: 16 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: colors.textSubtle, fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: colors.border },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: colors.primary },
});
