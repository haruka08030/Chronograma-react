
import { BookOpen, Code, Coffee, Dumbbell, Edit2, Moon, Sunrise, Trash2, Utensils } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { calculateCompletion, calculateStreak } from '../service';
import useLocalization from '../../../hooks/useLocalization';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { colors } from '../../../theme/theme';

const iconMap: { [key: string]: React.FC<any> } = {
  sunrise: Sunrise,
  book: BookOpen,
  dumbbell: Dumbbell,
  utensils: Utensils,
  moon: Moon,
  code: Code,
  coffee: Coffee,
};

export const HabitItem = ({ item, onEdit, onDelete, onToggleCompletion }) => {
  const { t } = useLocalization();
  const Icon = iconMap[item.icon] || Dumbbell;
  const streak = calculateStreak(item.history);
  const completionPercentage = calculateCompletion(item.completion);

  return (
    <Card
      style={styles.habitItemCard}
    >
      <View style={styles.habitItemContent}>
        <View style={styles.habitItemHeader}>
          <View style={[styles.habitIconBg, { backgroundColor: item.color.bg }]}>
            {Icon && <Icon color={item.color.text} width={24} height={24} />}
          </View>
          <View style={styles.habitTextContainer}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitTime}>{item.time}</Text>
            <View style={styles.habitStatsContainer}>
              <Badge style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streak} {t('habits.dayStreak')}</Text>
              </Badge>
              <Text style={styles.completionText}>{completionPercentage}%</Text>
            </View>
          </View>
          <View style={styles.habitActions}>
            <Pressable
              onPress={() => onEdit(item)}
              style={styles.actionButton}
            >
              <Edit2 color="#2563eb" width={16} height={16} />
            </Pressable>
            <Pressable
              onPress={() => onDelete(item.id)}
              style={styles.actionButton}
            >
              <Trash2 color="#ef4444" width={16} height={16} />
            </Pressable>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.weeklyProgressContainer}>
          {item.completion.map((completed, index) => (
            <Pressable
              key={index}
              onPress={() => onToggleCompletion(item.id, index)}
              style={[styles.progressSquare, completed ? styles.completedSquare : styles.incompleteSquare]}
            />
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  habitItemCard: { padding: 16, borderRadius: 12, backgroundColor: 'white', borderColor: colors.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginBottom: 12 },
  habitItemContent: {},
  habitItemHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  habitIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  habitTextContainer: { flex: 1, minWidth: 0 },
  habitName: { fontSize: 16, color: colors.text },
  habitTime: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  habitStatsContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  streakBadge: { backgroundColor: colors.streakBadge, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderColor: colors.streakBorder, borderWidth: 1 },
  streakText: { color: colors.streak, fontSize: 12 },
  completionText: { fontSize: 12, color: colors.textSubtle },
  habitActions: { flexDirection: 'row', gap: 4, opacity: 1 },
  actionButton: { padding: 4, borderRadius: 4 },
  weeklyProgressContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 12 },
  progressSquare: { flex: 1, aspectRatio: 1, borderRadius: 6 },
  completedSquare: { backgroundColor: colors.completed },
  incompleteSquare: { backgroundColor: colors.border },
});
