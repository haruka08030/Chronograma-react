import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/theme';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerText}>
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable onPress={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
          <ChevronRight size={24} color={colors.text} />
        </Pressable>
      </View>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.daysOfWeek}>
        {days.map(day => (
          <Text key={day} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.day} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push(
        <Pressable key={i} style={styles.day} onPress={() => onDateSelect && onDateSelect(dayDate)}>
          <Text style={styles.dayText}>{i}</Text>
        </Pressable>
      );
    }

    return <View style={styles.days}>{days}</View>;
  };

  return (
    <View style={styles.calendar}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
  },
});

export { Calendar };