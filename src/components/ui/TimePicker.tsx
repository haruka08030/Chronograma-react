import { colors } from '@/theme/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (_: DateTimePickerEvent, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const newDate = new Date(value);
      newDate.setHours(time.getHours(), time.getMinutes());
      onChange(newDate);
    }
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={value}
          mode="time"
          display="compact"
          onChange={(_, d) => d && handleTimeChange(_, d)}
          style={styles.compactTimeIOS}
        />
      ) : (
        <View style={styles.pickerContainer}>
          <Pressable
            style={styles.datePickerButton}
            onPress={() => setShowTimePicker(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Select due time"
          >
            <Clock size={18} color={colors.textSubtle} />
          </Pressable>
        </View>
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={handleTimeChange}
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
  compactTimeIOS: {
    height: 44,
    alignSelf: 'stretch',
  },
});
