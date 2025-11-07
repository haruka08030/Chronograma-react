import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CalendarIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Button, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Task } from '@/types/schemas';

type Priority = 'high' | 'medium' | 'low';

interface TaskModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;

  selectedTask?: Task | null;

  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;

  newDueDate: Date | null;
  setNewDueDate: (date: Date | null) => void;

  newPriority: Priority;
  setNewPriority: (priority: Priority) => void;

  newFolder: string;
  setNewFolder: (folder: string) => void;

  handleAddTask: () => void;
  deleteTask: (id: number) => void;
}

export const TaskModal: React.FC<TaskModalProps> = (props) => {
  const { t } = useLocalization();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { modalVisible, setModalVisible, selectedTask, newTaskTitle, setNewTaskTitle, newDueDate, setNewDueDate, newPriority, setNewPriority, newFolder, setNewFolder, handleAddTask, deleteTask } = props;

  const formattedDate = useMemo(() => {
    if (!newDueDate) return t('todo.setDueDate');
    return newDueDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  }, [newDueDate, t]);

  const onChangeDate = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setNewDueDate(date);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
        <Pressable style={styles.modalView} onPress={() => { }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedTask ? t('todo.editTask') : t('todo.addTask')}</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.inputLabel}>{t('todo.taskName')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder={t('todo.taskNamePlaceholder')}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>{t('todo.dueDate')}</Text>
              <Pressable style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <CalendarIcon size={18} color={colors.textSubtle} />
                <Text style={styles.datePickerText}>{formattedDate}</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>{t('todo.priority')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newPriority}
                  onValueChange={(itemValue) => setNewPriority(itemValue as Priority)}
                  style={styles.picker}
                >
                  <Picker.Item label={t('todo.priorityHigh')} value="high" />
                  <Picker.Item label={t('todo.priorityMedium')} value="medium" />
                  <Picker.Item label={t('todo.priorityLow')} value="low" />
                </Picker>
              </View>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={newDueDate || new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.inputLabel}>{t('todo.folder')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder={t('todo.folderPlaceholder')}
            value={newFolder}
            onChangeText={setNewFolder}
          />

          <Pressable style={styles.primaryButton} onPress={handleAddTask}>
            <Text style={styles.primaryButtonText}>{selectedTask ? t('todo.updateTask') : t('todo.addTask')}</Text>
          </Pressable>
          {selectedTask &&
            <Pressable style={[styles.primaryButton, styles.deleteButton]} onPress={() => deleteTask(selectedTask.id)}>
              <Text style={styles.primaryButtonText}>{t('todo.deleteTask')}</Text>
            </Pressable>
          }
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSubtle },
  inputLabel: { fontSize: 14, color: colors.text, marginBottom: 8, marginTop: 16 },
  modalTextInput: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, width: '100%', fontSize: 16, color: colors.text },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  datePickerText: { fontSize: 16, color: colors.text },
  pickerContainer: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, justifyContent: 'center' },
  picker: { height: 44, width: '100%' }, // iOSでは高さの調整が必要
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 24, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: colors.rose, marginTop: 12 },
});
