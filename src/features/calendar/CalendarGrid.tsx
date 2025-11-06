
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/src/components/ui/card';
import { colors } from '@/src/theme/theme';

export const CalendarGrid = ({
  currentMonth,
  previousMonth,
  nextMonth,
  activityMap,
  selectedDate,
  setSelectedDate,
}) => {
  const today = new Date();
  const monthName = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startingDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  return (
    <Card style={styles.calendarCard}>
      <View style={styles.monthNavigation}>
        <Pressable onPress={previousMonth} style={styles.navButton}>
          <ChevronLeft color="#475569" width={20} height={20} />
        </Pressable>
        <Text style={styles.monthName}>{monthName}</Text>
        <Pressable onPress={nextMonth} style={styles.navButton}>
          <ChevronRight color="#475569" width={20} height={20} />
        </Pressable>
      </View>

      <View style={styles.dayHeaders}>
        {days.map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptyDayCell} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const activityCount = activityMap.get(dateString) || 0;

          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();

          const accessibilityLabel = `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${activityCount} events`;

          let activityStyle = {};
          if (activityCount > 0) {
            if (activityCount >= 3) {
              activityStyle = styles.activityCellHigh;
            } else {
              activityStyle = styles.activityCellLow;
            }
          }

          return (
            <View key={day} style={{ height: 56, width: '14.28%', justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                onPress={() => setSelectedDate(date)}
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                  !isToday && !isSelected && activityStyle,
                ]}
                accessibilityLabel={accessibilityLabel}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText,
                ]}>{day}</Text>
                {(isToday || isSelected) && <View style={[styles.activityDot, isToday ? styles.todayDot : styles.selectedDot]} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  calendarCard: { padding: 16, borderRadius: 16, backgroundColor: 'white', marginBottom: 16 },
  monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navButton: { padding: 8, borderRadius: 20 },
  monthName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  dayHeaders: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayHeader: { width: '14.28%', alignItems: 'center' },
  dayHeaderText: { fontSize: 12, color: colors.textSubtle },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  emptyDayCell: { height: 0, width: '14.28%' },
  dayCell: { width: '100%', height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 999, paddingVertical: 2 },
  dayText: { fontSize: 18, fontWeight: '400', color: colors.text },
  todayCell: { backgroundColor: colors.primary },
  todayText: { color: 'white' },
  selectedCell: { backgroundColor: colors.accent },
  selectedText: { color: 'white' },
  activityCellLow: { backgroundColor: colors.activityLow },
  activityCellHigh: { backgroundColor: colors.activityHigh },
  activityDot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },
  todayDot: { backgroundColor: colors.primary },
  selectedDot: { backgroundColor: colors.accent },
});
