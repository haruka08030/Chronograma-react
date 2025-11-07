
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { TaskItem } from '@/features/todo/TaskItem';
import { TaskModal } from '@/features/todo/TaskModal';
import useLocalization from '@/hooks/useLocalization';
import { colors } from '@/theme/theme';
import { Task, TaskSchema } from '@/types/schemas';

interface FolderType {
  id: string;
  name: string;
  icon: string;
}

export default function ToDoScreen() {
  const { t } = useLocalization();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFolder, setActiveFolder] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState<Date | null>(null);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newFolder, setNewFolder] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (selectedTask) {
      setNewTaskTitle(selectedTask.title);
      setNewDueDate(new Date(selectedTask.dueDate));
      setNewPriority(selectedTask.priority);
      setNewFolder(selectedTask.folderId);
    } else {
      setNewTaskTitle('');
      setNewDueDate(null);
      setNewPriority('medium');
      setNewFolder(activeFolder === 'all' ? 'personal' : activeFolder);
    }
  }, [selectedTask]);

  const handleAddTask = () => {
    if (selectedTask) {
      updateTask();
    } else {
      addTask();
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Task title is required');
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      dueDate: newDueDate ? newDueDate.toISOString() : '',
      priority: newPriority,
      completed: false,
      folderId: newFolder,
    };
    setTasks([...tasks, newTask]);
    setModalVisible(false);
  };

  const updateTask = () => {
    if (!selectedTask) return;
    setTasks(tasks.map((task: Task) =>
      task.id === selectedTask.id ? { ...task, title: newTaskTitle, dueDate: newDueDate ? newDueDate.toISOString() : '', priority: newPriority, folderId: newFolder } : task
    ));
    setSelectedTask(null);
    setModalVisible(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        const parsed = JSON.parse(storedTasks);
        const validated = z.array(TaskSchema).safeParse(parsed);
        if (validated.success) {
          setTasks(validated.data);
        } else {
          console.error('Invalid task data:', validated.error);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks.', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks.', error);
    }
  };


  const folders: FolderType[] = [
    { id: 'all', name: t('todo.all'), icon: '📋' },
    { id: 'school', name: t('todo.school'), icon: '📚' },
    { id: 'work', name: t('todo.work'), icon: '💼' },
    { id: 'personal', name: t('todo.personal'), icon: '🏠' },
    { id: 'health', name: t('todo.health'), icon: '💪' },
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task: Task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => setTasks(tasks.filter((task: Task) => task.id !== id)) },
    ]);
  };

  const getTasksByFolder = (folderId: string) => {
    if (folderId === 'all') return tasks;
    return tasks.filter((task: Task) => task.folderId === folderId);
  };

  const activeTasks = tasks.filter((task: Task) => !task.completed);
  const displayTasks = getTasksByFolder(activeFolder);
  const displayActiveTasks = displayTasks.filter((task: Task) => !task.completed);
  const displayCompletedTasks = displayTasks.filter((task: Task) => task.completed);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View>
          <Text style={styles.headerTitle}>{t('todo.title')}</Text>
          <Text style={styles.headerSubtitle}>{activeTasks.length} {t('todo.remaining')}</Text>
        </View>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <Card style={styles.statsCard} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderTabsContainer}>
          {folders.map(folder => (
            <Pressable key={folder.id} onPress={() => setActiveFolder(folder.id)} style={[styles.folderTab, activeFolder === folder.id && styles.activeFolderTab]}>
              <Text>{folder.icon}</Text>
              <Text style={[styles.folderTabText, activeFolder === folder.id && styles.activeFolderTabText]}>{folder.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ marginTop: 16 }}>
          {displayActiveTasks.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.listTitle}>{t('todo.activeTasks')}</Text>
              {displayActiveTasks.map(task => <TaskItem key={task.id} task={task} onSelectTask={handleSelectTask} onToggleTask={toggleTask} />)}
            </View>
          )}
          {displayCompletedTasks.length > 0 && (
            <View>
              <Text style={styles.listTitle}>{t('todo.completed')}</Text>
              {displayCompletedTasks.map(task => <TaskItem key={task.id} task={task} onSelectTask={handleSelectTask} onToggleTask={toggleTask} />)}
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => {
        setSelectedTask(null);
        setModalVisible(true);
      }}>
        <Plus color="white" width={24} height={24} />
      </Pressable>

      <TaskModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedTask={selectedTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newDueDate={newDueDate}
        setNewDueDate={setNewDueDate}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        newFolder={newFolder}
        setNewFolder={setNewFolder}
        handleAddTask={handleAddTask}
        deleteTask={deleteTask}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16, paddingBottom: 80 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 16, color: colors.textMuted },
  statsCard: { padding: 16, borderRadius: 16, backgroundColor: colors.primaryLight, marginBottom: 16 },
  folderTabsContainer: { marginBottom: 16 },
  folderTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: 'white' },
  activeFolderTab: { backgroundColor: colors.primary },
  folderTabText: { marginLeft: 8, color: colors.text },
  activeFolderTabText: { color: 'white' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  taskItemCard: { padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 8 },
  taskItemContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  taskTitle: { fontSize: 16, color: colors.text },
  completedTaskTitle: { textDecorationLine: 'line-through', color: colors.textSubtle },
  taskMetaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.streakBadge, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  priorityText: { color: colors.streak, fontSize: 12 },
  dueDateText: { color: colors.textSubtle, fontSize: 12 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSubtle },
  inputLabel: { fontSize: 16, color: colors.text, marginBottom: 8, marginTop: 16 },
  modalTextInput: { borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, width: '100%' },
  primaryButton: { backgroundColor: colors.text, padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 100, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
});
