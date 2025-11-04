import { ChevronLeft, ChevronRight, Download } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025
  const [selectedDay, setSelectedDay] = useState(2);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activityDays = [2, 5, 8, 9, 12, 15, 16, 19, 22, 23, 26, 29];
  const today = 2;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>Track your schedule and progress</Text>
      </View>

      {/* Import Calendar Button */}
      <Card style={styles.importCard}>
        <View style={styles.importContent}>
          <View>
            <Text style={styles.importTitle}>Sync Calendar</Text>
            <Text style={styles.importSubtitle}>Import from Google or Apple</Text>
          </View>
          <Pressable style={styles.importButton}>
            <Download color="white" width={16} height={16} style={{ marginRight: 8 }} />
            <Text style={styles.importButtonText}>Import</Text>
          </Pressable>
        </View>
      </Card>

      {/* Calendar */}
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
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isToday = day === today;
            const isSelected = day === selectedDay;
            const hasActivity = activityDays.includes(day);

            return (
              <Pressable
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[styles.dayCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
                hasActivity && !isToday && !isSelected && styles.activityCell
                ]}
              >
                <Text style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText,
                  hasActivity && !isToday && !isSelected && styles.activityText
                ]}>{day}</Text>
                {hasActivity && !isToday && !isSelected && <View style={styles.activityDot} />}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Placeholder for schedule */}
      <View style={styles.schedulePlaceholder}>
        <Text>Schedule for selected day will be here</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#475569',
  },
  importCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f0f5ff',
    marginBottom: 16,
  },
  importContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  importTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  importSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  importButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  monthName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    width: '14.28%',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    color: '#64748b',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    color: '#334155',
  },
  todayCell: {
    backgroundColor: '#2563eb',
  },
  todayText: {
    color: 'white',
  },
  selectedCell: {
    backgroundColor: '#7c3aed',
  },
  selectedText: {
    color: 'white',
  },
  activityCell: {
    backgroundColor: '#eff6ff',
  },
  activityText: {
    color: '#1e293b',
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563eb',
    marginTop: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  schedulePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
});
