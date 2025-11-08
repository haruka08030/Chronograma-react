import { colors } from '@/theme/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      onChange(date);
    }
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={value}
          mode="date"
          display="compact"
          onChange={(_, d) => d && onChange(d)}
          style={styles.compactDateIOS}
        />
      ) : (
        <View style={styles.pickerContainer}>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Select due date"
          >
            <CalendarIcon size={18} color={colors.textSubtle} />
          </Pressable>
        </View>
      )}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    justifyContent: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  compactDateIOS: {
    height: 44,
    alignSelf: 'stretch',
  },
});
