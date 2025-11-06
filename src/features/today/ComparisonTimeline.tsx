
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import useLocalization from '@/src/hooks/useLocalization';
import { ScheduleItem } from '@/src/types/schemas';
import { colors } from '@/src/theme/theme';

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

export const ComparisonTimeline: React.FC<{
  plannedSchedule: ScheduleItem[],
  actualSchedule: ScheduleItem[],
  onSelectSchedule: (item: ScheduleItem, isActual: boolean) => void
}> = ({ plannedSchedule, actualSchedule, onSelectSchedule }) => {
  const { t } = useLocalization();

  return (
    <View style={styles.timelineContainer}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ width: 48 }} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={styles.timelineHeaderText}>{t('calendar.ideal')}</Text>
          <Text style={styles.timelineHeaderText}>{t('calendar.actual')}</Text>
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
                <Pressable key={index} onPress={() => onSelectSchedule(item, false)}>
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
  timelineHeaderText: { color: colors.textSubtle, fontSize: 12 },
  hourContainer: { height: 80, flexDirection: 'row', alignItems: 'flex-start' },
  hourLabel: { width: 48, color: colors.textSubtle, fontSize: 12, top: -6 },
  hourLine: { flex: 1, height: 1, backgroundColor: colors.border },
  scheduleItemsContainer: { position: 'absolute', top: 0, left: 48, right: 0, bottom: 0, flexDirection: 'row' },
  scheduleItem: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 8, borderWidth: 1 },
  scheduleItemTitle: { fontSize: 12, fontWeight: 'bold' },
  currentItem: { borderWidth: 2, borderColor: colors.primary },
});
