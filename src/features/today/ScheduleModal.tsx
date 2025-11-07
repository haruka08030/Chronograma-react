
import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import { ScheduleItem } from '@/types/schemas';
import React from 'react';
import { Button, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

interface ScheduleModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedSchedule: ScheduleItem | null;
  newScheduleTitle: string;
  setNewScheduleTitle: (title: string) => void;
  newScheduleStartTime: string;
  setNewScheduleStartTime: (time: string) => void;
  newScheduleDuration: string;
  setNewScheduleDuration: (duration: string) => void;
  isActual: boolean;
  setIsActual: (isActual: boolean) => void;
  handleAddScheduleItem: () => void;
  deleteScheduleItem: (id: number) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  modalVisible,
  setModalVisible,
  selectedSchedule,
  newScheduleTitle,
  setNewScheduleTitle,
  newScheduleStartTime,
  setNewScheduleStartTime,
  newScheduleDuration,
  setNewScheduleDuration,
  isActual,
  setIsActual,
  handleAddScheduleItem,
  deleteScheduleItem,
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
          <TextInput
            style={styles.modalTextInput}
            placeholder={t('common.titlePlaceholder')}
            value={newScheduleTitle}
            onChangeText={setNewScheduleTitle}
          />
          <TextInput
            style={styles.modalTextInput}
            placeholder={t('common.startTimePlaceholder')}
            value={newScheduleStartTime}
            onChangeText={setNewScheduleStartTime}
          />
          <TextInput
            style={styles.modalTextInput}
            placeholder={t('common.durationPlaceholder')}
            value={newScheduleDuration}
            onChangeText={setNewScheduleDuration}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Switch value={isActual} onValueChange={setIsActual} />
            <Text style={{ marginLeft: 8 }}>{t('common.actualSchedule')}</Text>
          </View>
          <Button title={selectedSchedule ? t('habits.update') : t('habits.add')} onPress={handleAddScheduleItem} />
          {selectedSchedule && <Button title={t('habits.delete')} onPress={() => deleteScheduleItem(selectedSchedule.id)} color="red" />}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', width: '80%' },
  modalTextInput: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
});
