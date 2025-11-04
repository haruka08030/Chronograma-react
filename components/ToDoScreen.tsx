import { CheckCircle2, Circle, Flag, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ToDoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFolder, setActiveFolder] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newFolder, setNewFolder] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (selectedTask) {
      setNewTaskTitle(selectedTask.title);
      setNewDueDate(selectedTask.dueDate);
      setNewPriority(selectedTask.priority);
      setNewFolder(selectedTask.folderId);
    } else {
      setNewTaskTitle('');
      setNewDueDate('');
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
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      dueDate: newDueDate,
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
      task.id === selectedTask.id ? { ...task, title: newTaskTitle, dueDate: newDueDate, priority: newPriority, folderId: newFolder } : task
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
        setTasks(JSON.parse(storedTasks));
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
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'school', name: 'School', icon: '📚' },
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '💪' },
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
  const completedTasks = tasks.filter((task: Task) => task.completed);
  const displayTasks = getTasksByFolder(activeFolder);
  const displayActiveTasks = displayTasks.filter((task: Task) => !task.completed);
  const displayCompletedTasks = displayTasks.filter((task: Task) => task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <Pressable onLongPress={() => {
      setSelectedTask(task);
      setModalVisible(true);
    }}>
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>To-Do List</Text>
            <Text style={styles.headerSubtitle}>{activeTasks.length} tasks remaining</Text>
          </View>
        </View>

        <Card style={styles.statsCard} children={undefined}>
          {/* Stats content here */}
        </Card>

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

      <Pressable style={styles.fab} onPress={() => {
        setSelectedTask(null);
        setModalVisible(true);
      }}>
        <Plus color="white" width={24} height={24} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>タスク追加</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>タスク名</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: プロジェクトを終わらせる"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <Text style={styles.inputLabel}>期限</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: 明日"
              value={newDueDate}
              onChangeText={setNewDueDate}
            />
            <Text style={styles.inputLabel}>優先度</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: high"
              value={newPriority}
              onChangeText={(text) => setNewPriority(text as 'high' | 'medium' | 'low')}
            />
            <Text style={styles.inputLabel}>フォルダ</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="例: work"
              value={newFolder}
              onChangeText={setNewFolder}
            />
            <Pressable style={styles.primaryButton} onPress={handleAddTask}>
              <Text style={styles.primaryButtonText}>{selectedTask ? "タスクを更新" : "追加"}</Text>
            </Pressable>
            {selectedTask && <Button title="Delete Task" onPress={() => deleteTask(selectedTask.id)} color="red" />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16, paddingBottom: 80 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 16, color: '#475569' },
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
  priorityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  priorityText: { color: '#f97316', fontSize: 12 },
  dueDateText: { color: '#64748b', fontSize: 12 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  closeButton: { fontSize: 24, color: '#64748b' },
  inputLabel: { fontSize: 16, color: '#1e293b', marginBottom: 8, marginTop: 16 },
  modalTextInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, width: '100%' },
  primaryButton: { backgroundColor: '#1e293b', padding: 14, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 60, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 8 },
});
