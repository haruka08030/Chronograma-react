import { Dropdown } from '@/components/ui/Dropdown';
import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import { Priority, Task } from '@/types/schemas';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';

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

  const { modalVisible, setModalVisible, selectedTask, newTaskTitle, setNewTaskTitle, newDueDate, setNewDueDate, newPriority, setNewPriority, newFolder, setNewFolder, handleAddTask, deleteTask } = props;

  const tr = (key: string, fallback: string) => {
    const s = t(key);
    return !s || s === key ? fallback : s;
  };

  const priorityOptions: { label: string; value: Priority }[] = [
    { label: tr('todo.priorityHigh', 'High'), value: 'high' },
    { label: tr('todo.priorityMedium', 'Medium'), value: 'medium' },
    { label: tr('todo.priorityLow', 'Low'), value: 'low' },
  ];

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
              <DatePicker value={newDueDate || new Date()} onChange={setNewDueDate} />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.inputLabel}>{t('todo.dueTime') ?? 'Time'}</Text>
              <TimePicker value={newDueDate || new Date()} onChange={setNewDueDate} />
            </View>
          </View>
          <Text style={styles.inputLabel}>{tr('todo.priority', 'Priority')}</Text>
          <Dropdown
            options={priorityOptions}
            value={newPriority}
            onChange={setNewPriority}
            placeholder={tr('todo.selectPriority', 'Select priority')}
          />

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
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 24, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: colors.rose, marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowItem: { flex: 1 },
  rowItemSpacing: { marginRight: 16 },
});
