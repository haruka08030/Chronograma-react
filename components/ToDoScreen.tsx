import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Plus, Circle, CheckCircle2, Flag } from 'lucide-react-native';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Badge = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.badge, style]}>{children}</View>
);

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  folderId: string;
}

interface FolderType {
  id: string;
  name: string;
  icon: string;
}

export default function ToDoScreen() {
  const [activeFolder, setActiveFolder] = useState('all');

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Finish math homework', dueDate: 'Today', priority: 'high', completed: false, folderId: 'school' },
    { id: 2, title: 'Review science notes', dueDate: 'Today', priority: 'medium', completed: false, folderId: 'school' },
    { id: 3, title: 'Buy groceries', dueDate: 'Tomorrow', priority: 'low', completed: false, folderId: 'personal' },
    { id: 4, title: 'Complete project proposal', dueDate: 'Nov 8', priority: 'high', completed: false, folderId: 'work' },
    { id: 5, title: 'Call dentist', dueDate: 'This week', priority: 'medium', completed: false, folderId: 'personal' },
    { id: 6, title: 'Prepare presentation', dueDate: 'Nov 5', priority: 'high', completed: false, folderId: 'work' },
    { id: 7, title: 'Read chapter 5', dueDate: 'Tomorrow', priority: 'low', completed: true, folderId: 'school' },
    { id: 8, title: 'Workout session', dueDate: 'Today', priority: 'medium', completed: true, folderId: 'health' },
  ]);

  const folders: FolderType[] = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'school', name: 'School', icon: '📚' },
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '💪' },
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTasksByFolder = (folderId: string) => {
    if (folderId === 'all') return tasks;
    return tasks.filter(task => task.folderId === folderId);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const displayTasks = getTasksByFolder(activeFolder);
  const displayActiveTasks = displayTasks.filter(task => !task.completed);
  const displayCompletedTasks = displayTasks.filter(task => task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <Card style={styles.taskItemCard}>
      <View style={styles.taskItemContainer}>
        <Pressable onPress={() => toggleTask(task.id)} style={{ marginTop: 2 }}>
          {task.completed ? <CheckCircle2 color="#16a34a" width={20} height={20} /> : <Circle color="#94a3b8" width={20} height={20} />}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
            {task.title}
          </Text>
          <View style={styles.taskMetaContainer}>
            {/* Priority and other details here */}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>To-Do List</Text>
          <Text style={styles.headerSubtitle}>{activeTasks.length} tasks remaining</Text>
        </View>
        <Pressable style={styles.addButton}>
          <Plus color="white" width={20} height={20} />
        </Pressable>
      </View>

      {/* Stats Card */}
      <Card style={styles.statsCard} children={undefined}>
        {/* Stats content here */}
      </Card>

      {/* Folder Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderTabsContainer}>
        {folders.map(folder => (
          <Pressable key={folder.id} onPress={() => setActiveFolder(folder.id)} style={[styles.folderTab, activeFolder === folder.id && styles.activeFolderTab]}>
            <Text>{folder.icon}</Text>
            <Text style={[styles.folderTabText, activeFolder === folder.id && styles.activeFolderTabText]}>{folder.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Task Lists */}
      <View style={{ marginTop: 16 }}>
        {displayActiveTasks.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.listTitle}>Active Tasks</Text>
            {displayActiveTasks.map(task => <TaskItem key={task.id} task={task} />)}
          </View>
        )}
        {displayCompletedTasks.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Completed</Text>
            {displayCompletedTasks.map(task => <TaskItem key={task.id} task={task} />)}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 16, color: '#475569' },
  addButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 999, },
  statsCard: { padding: 16, borderRadius: 16, backgroundColor: '#f0f5ff', marginBottom: 16 },
  folderTabsContainer: { marginBottom: 16 },
  folderTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: 'white' },
  activeFolderTab: { backgroundColor: '#2563eb' },
  folderTabText: { marginLeft: 8, color: '#334155' },
  activeFolderTabText: { color: 'white' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  taskItemCard: { padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 8 },
  taskItemContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  taskTitle: { fontSize: 16, color: '#1e293b' },
  completedTaskTitle: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskMetaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
