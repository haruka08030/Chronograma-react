
import { CheckCircle2, Circle, Flag } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { colors } from '@/theme/theme';
import { Task } from '@/types/schemas';

interface TaskItemProps {
  task: Task;
  onSelectTask: (task: Task) => void;
  onToggleTask: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onSelectTask, onToggleTask }) => (
  <Pressable onPress={() => onSelectTask(task)}>
    <Card style={styles.taskItemCard}>
      <View style={styles.taskItemContainer}>
        <Pressable onPress={() => onToggleTask(task.id)} style={{ marginTop: 2 }}>
          {task.completed ? <CheckCircle2 color="#16a34a" width={20} height={20} /> : <Circle color="#94a3b8" width={20} height={20} />}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
            {task.title}
          </Text>
          <View style={styles.taskMetaContainer}>
            <Badge style={styles.priorityBadge}>
              <Flag color="#f97316" width={12} height={12} style={{ marginRight: 4 }} />
              <Text style={styles.priorityText}>{task.priority}</Text>
            </Badge>
            <Text style={styles.dueDateText}>{task.dueDate}</Text>
          </View>
        </View>
      </View>
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  taskItemCard: { padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 8 },
  taskItemContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  taskTitle: { fontSize: 16, color: colors.text },
  completedTaskTitle: { textDecorationLine: 'line-through', color: colors.textSubtle },
  taskMetaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.streakBadge, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  priorityText: { color: colors.streak, fontSize: 12 },
  dueDateText: { color: colors.textSubtle, fontSize: 12 },
});
