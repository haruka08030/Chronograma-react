
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import { Habit } from '../schema';

interface ColorOption {
  label: string;
  bg: string;
  text: string;
}

interface HabitModalProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  editingHabit: Habit | null;
  formData: {
    name: string;
    icon: string;
    time: string;
    color: { bg: string; text: string; };
  };
  setFormData: (data: { name: string; icon: string; time: string; color: { bg: string; text: string; }; }) => void;
  colorOptions: ColorOption[];
  handleAddHabit: () => void;
  handleDelete: (id: string) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  editingHabit,
  formData,
  setFormData,
  colorOptions,
  handleAddHabit,
  handleDelete,
}) => {
  const { t } = useLocalization();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isAddDialogOpen}
      onRequestClose={() => setIsAddDialogOpen(false)}
    >
      <Pressable style={styles.modalContainer} onPress={() => setIsAddDialogOpen(false)}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingHabit ? t('habits.editHabit') : t('habits.addHabitTitle')}</Text>
            <Pressable onPress={() => setIsAddDialogOpen(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('habits.habitName')}</Text>
            <TextInput
              style={styles.input}
              placeholder="例: ランニング"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('habits.time')}</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM AM/PM"
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('habits.icon')}</Text>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={formData.icon}
                onValueChange={(itemValue) => setFormData({ ...formData, icon: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="🌅 朝" value="sunrise" />
                <Picker.Item label="📚 勉強" value="book" />
                <Picker.Item label="💪 運動" value="dumbbell" />
                <Picker.Item label="🍽️ 食事" value="utensils" />
                <Picker.Item label="💻 作業" value="code" />
                <Picker.Item label="☕ 読書" value="coffee" />
                <Picker.Item label="🌙 睡眠" value="moon" />
              </Picker>
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>色</Text>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={formData.color}
                onValueChange={(itemValue) => setFormData({ ...formData, color: itemValue as { bg: string; text: string } })}
                style={styles.picker}
              >
                {colorOptions.map(option => (
                  <Picker.Item key={option.label} label={option.label} value={option} />
                ))}
              </Picker>
            </View>
          </View>
          <Pressable onPress={handleAddHabit} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{editingHabit ? t('habits.update') : t('habits.add')}</Text>
          </Pressable>
          {editingHabit && (
            <Pressable onPress={() => handleDelete(editingHabit.id)} style={[styles.primaryButton, styles.deleteButton]}>
              <Text style={styles.primaryButtonText}>{t('habits.delete')}</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSubtle },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, width: '100%', fontSize: 16, color: colors.text },
  selectContainer: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, width: '100%' },
  picker: { width: '100%', height: 50 },
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: colors.rose, marginTop: 10 },
});
