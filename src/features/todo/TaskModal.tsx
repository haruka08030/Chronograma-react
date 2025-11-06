
import React from 'react';
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import useLocalization from '../../hooks/useLocalization';
import { colors } from '../../theme/theme';

export const TaskModal = ({
  modalVisible,
  setModalVisible,
  selectedTask,
  newTaskTitle,
  setNewTaskTitle,
  newDueDate,
  setNewDueDate,
  newPriority,
  setNewPriority,
  newFolder,
  setNewFolder,
  handleAddTask,
  deleteTask,
}) => {
  const { t } = useLocalization();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('todo.addTask')}</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>
          <Text style={styles.inputLabel}>{t('todo.taskName')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="例: プロジェクトを終わらせる"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <Text style={styles.inputLabel}>{t('todo.dueDate')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="例: 明日"
            value={newDueDate}
            onChangeText={setNewDueDate}
          />
          <Text style={styles.inputLabel}>{t('todo.priority')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="例: high"
            value={newPriority}
            onChangeText={(text) => setNewPriority(text as 'high' | 'medium' | 'low')}
          />
          <Text style={styles.inputLabel}>{t('todo.folder')}</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="例: work"
            value={newFolder}
            onChangeText={setNewFolder}
          />
          <Pressable style={styles.primaryButton} onPress={handleAddTask}>
            <Text style={styles.primaryButtonText}>{selectedTask ? t('todo.updateTask') : t('todo.addTask')}</Text>
          </Pressable>
          {selectedTask && <Button title={t('todo.deleteTask')} onPress={() => deleteTask(selectedTask.id)} color="red" />}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSubtle },
  inputLabel: { fontSize: 16, color: colors.text, marginBottom: 8, marginTop: 16 },
  modalTextInput: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, width: '100%' },
  primaryButton: { backgroundColor: colors.text, padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
