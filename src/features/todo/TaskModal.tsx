import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarIcon, Clock } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


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

  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const priorityAnchorRef = useRef<View>(null);
  const [priorityAnchor, setPriorityAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const tr = (key: string, fallback: string) => {
    const s = t(key);
    return !s || s === key ? fallback : s;
  };
  const priorityText: Record<Priority, string> = {
    high: tr('todo.priorityHigh', 'High'),
    medium: tr('todo.priorityMedium', 'Medium'),
    low: tr('todo.priorityLow', 'Low'),
  };

  const openPriorityMenu = () => {
    priorityAnchorRef.current?.measureInWindow((x, y, width, height) => {
      setPriorityAnchor({ x, y, width, height });
      setShowPriorityMenu(true);
    });
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

          {/* 測定用に ref を当てる。Android での測定安定化のため collapsable={false} */}
          <View ref={priorityAnchorRef} collapsable={false} style={styles.pickerContainer}>
            <Pressable
              style={styles.datePickerButton}
              onPress={openPriorityMenu}
              accessibilityRole="button"
              accessibilityLabel={tr('todo.selectPriority', 'Select priority')}
            >
              <Text style={styles.priorityValueText}>{priorityText[newPriority]}</Text>
            </Pressable>
          </View>
          {showPriorityMenu && (
            <Modal
              transparent
              visible
              animationType="fade"
              onRequestClose={() => setShowPriorityMenu(false)}
            >
              {/* 背景を押したら閉じる */}
              <Pressable style={styles.dropdownBackdrop} onPress={() => setShowPriorityMenu(false)}>
                {/* 空Pressable内でバブリングを止めるためのラッパー */}
                <View pointerEvents="box-none" style={{ flex: 1 }}>
                  {(() => {
                    const screenW = Dimensions.get('window').width;
                    const left = Math.min(
                      Math.max(8, priorityAnchor.x),
                      screenW - priorityAnchor.width - 8
                    );
                    const top = priorityAnchor.y + priorityAnchor.height + 4;
                    return (
                      <View
                        style={[
                          styles.dropdown,
                          { top, left, width: priorityAnchor.width },
                        ]}
                      >
                        {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                          <Pressable
                            key={p}
                            style={[
                              styles.dropdownOption,
                              newPriority === p && styles.dropdownOptionActive,
                            ]}
                            onPress={() => {
                              setNewPriority(p);
                              setShowPriorityMenu(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                newPriority === p && styles.dropdownOptionTextActive,
                              ]}
                            >
                              {priorityText[p]}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    );
                  })()}
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
  priorityValueText: { fontSize: 16, color: colors.text },

  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.001)', // クリック検知用に極薄
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownOption: { paddingVertical: 12, paddingHorizontal: 12 },
  dropdownOptionActive: { backgroundColor: '#EEF2FF' },
  dropdownOptionText: { fontSize: 16, color: colors.text },
  dropdownOptionTextActive: { color: colors.primary, fontWeight: '600' },

});
