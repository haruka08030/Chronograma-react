import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarIcon, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActionSheetIOS, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


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

  const [showTimePicker, setShowTimePicker] = useState(false);

  // 時間だけを更新（既存の日付は維持）
  const setDueTime = (d: Date) => {
    const base = newDueDate ? new Date(newDueDate) : new Date();
    base.setHours(d.getHours(), d.getMinutes(), 0, 0);
    setNewDueDate(base);
  };

  const [showPrioritySheet, setShowPrioritySheet] = useState(false);

  const tr = (key: string, fallback: string) => {
    const s = t(key);
    return !s || s === key ? fallback : s;
  };
  const priorityText: Record<Priority, string> = {
    high: tr('todo.priorityHigh', 'High'),
    medium: tr('todo.priorityMedium', 'Medium'),
    low: tr('todo.priorityLow', 'Low'),
  };

  const openPriorityPicker = () => {
    if (Platform.OS === 'ios') {
      const options = [priorityText.high, priorityText.medium, priorityText.low, tr('common.cancel', 'Cancel')];
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 3 },
        (i) => {
          if (i === 0) setNewPriority('high');
          if (i === 1) setNewPriority('medium');
          if (i === 2) setNewPriority('low');
        }
      );
    } else {
      setShowPrioritySheet(true);
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

          <View style={styles.row}>
            <View style={[styles.rowItem, styles.rowItemSpacing]}>
              <Text style={styles.inputLabel}>{t('todo.dueDate')}</Text>

              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={newDueDate || new Date()}
                  mode="date"
                  display="compact"
                  onChange={(_, d) => d && setNewDueDate(d)}
                  style={styles.compactDateIOS}
                />
              ) : (
                <View style={styles.pickerContainer}>
                  <Pressable
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={t('todo.selectDueDate')}
                  >
                    <CalendarIcon size={18} color={colors.textSubtle} />
                  </Pressable>
                </View>
              )}
              {Platform.OS === 'android' && showTimePicker && (
                <DateTimePicker
                  value={newDueDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, time) => {
                    const isSet = (event as any)?.type === 'set';
                    setShowTimePicker(false);
                    if (isSet && time) setDueTime(time);
                  }}
                />
              )}
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.inputLabel}>{t('todo.dueTime') ?? 'Time'}</Text>

              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={newDueDate || new Date()}
                  mode="time"
                  display="compact"
                  onChange={(_, d) => d && setDueTime(d)}
                  style={styles.compactTimeIOS}
                />
              ) : (
                <View style={styles.pickerContainer}>
                  <Pressable
                    style={styles.datePickerButton}
                    onPress={() => setShowTimePicker(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={t('todo.selectDueTime') ?? 'Select time'}
                  >
                    <Clock size={18} color={colors.textSubtle} />
                  </Pressable>
                </View>
              )}
              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={newDueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    const isSet = (event as any)?.type === 'set';
                    setShowDatePicker(false);
                    if (isSet && date) setNewDueDate(date);
                  }}
                />
              )}
            </View>
          </View>
          <Text style={styles.inputLabel}>{tr('todo.priority', 'Priority')}</Text>
          <View style={styles.pickerContainer}>
            <Pressable
              style={styles.datePickerButton}
              onPress={openPriorityPicker}
              accessibilityRole="button"
              accessibilityLabel={tr('todo.selectPriority', 'Select priority')}
            >
              <Text style={styles.priorityValueText}>{priorityText[newPriority]}</Text>
            </Pressable>
          </View>
          {Platform.OS === 'android' && (
            <Modal
              transparent
              visible={showPrioritySheet}
              animationType="fade"
              onRequestClose={() => setShowPrioritySheet(false)}
            >
              <Pressable style={styles.sheetBackdrop} onPress={() => setShowPrioritySheet(false)}>
                <View style={styles.sheet}>
                  {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                    <Pressable
                      key={p}
                      style={[styles.option, newPriority === p && styles.optionActive]}
                      onPress={() => { setNewPriority(p); setShowPrioritySheet(false); }}
                    >
                      <Text style={[styles.optionText, newPriority === p && styles.optionTextActive]}>
                        {priorityText[p]}
                      </Text>
                    </Pressable>
                  ))}
                  <Pressable style={styles.option} onPress={() => setShowPrioritySheet(false)}>
                    <Text style={styles.optionText}>{tr('common.cancel', 'Cancel')}</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
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
    </Modal >
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
  pickerContainer: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, justifyContent: 'center' },
  picker: { height: 44, width: '100%' }, // iOSでは高さの調整が必要
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 24, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: colors.rose, marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowItem: { flex: 1 },
  rowItemSpacing: { marginRight: 16 },
  compactDateIOS: { height: 44, alignSelf: 'stretch' },
  compactTimeIOS: { height: 44, alignSelf: 'stretch' },
  priorityRow: { flexDirection: 'row', gap: 8 },           // RNのgapが不安ならmarginで代用
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: 'white',
    marginRight: 8, // gap代替（必要なら）
  },
  chipActive: {
    backgroundColor: colors.primary, // アプリ配色に合わせて変更可
    borderColor: colors.primary,
  },
  chipText: { color: colors.text },
  chipTextActive: { color: 'white', fontWeight: '600' },
  priorityValueText: { fontSize: 16, color: colors.text },

  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
  },
  option: { paddingVertical: 14, paddingHorizontal: 16 },
  optionActive: { backgroundColor: '#EEF2FF' }, // 薄いハイライト。必要ならテーマ色に
  optionText: { fontSize: 16, color: colors.text },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
});
