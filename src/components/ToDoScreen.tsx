import { useState } from 'react';
import { Plus, Circle, CheckCircle2, Flag } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
    { id: 9, title: 'Team standup meeting', dueDate: 'Today', priority: 'medium', completed: false, folderId: 'work' },
    { id: 10, title: 'Meditation', dueDate: 'Today', priority: 'low', completed: false, folderId: 'health' },
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTasksByFolder = (folderId: string) => {
    if (folderId === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.folderId === folderId);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const displayTasks = getTasksByFolder(activeFolder);
  const displayActiveTasks = displayTasks.filter(task => !task.completed);
  const displayCompletedTasks = displayTasks.filter(task => task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <Card className="p-3 bg-white rounded-xl shadow-sm border-slate-200 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 transition-colors ${
            task.completed
              ? 'text-green-600 hover:text-slate-600'
              : 'text-slate-400 hover:text-blue-600'
          }`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 space-y-2">
          <p className={`text-slate-900 ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs rounded-md ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
            <span className="text-xs text-slate-500">{task.dueDate}</span>
            {activeFolder === 'all' && folders.find(f => f.id === task.folderId) && (
              <span className="text-xs">
                {folders.find(f => f.id === task.folderId)?.icon}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">To-Do List</h1>
          <p className="text-slate-600">
            {activeTasks.length} tasks remaining
          </p>
        </div>
        <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border-slate-200">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-slate-900">{tasks.length}</p>
            <p className="text-xs text-slate-600">Total</p>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="text-center">
            <p className="text-blue-600">{activeTasks.length}</p>
            <p className="text-xs text-slate-600">Active</p>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="text-center">
            <p className="text-green-600">{completedTasks.length}</p>
            <p className="text-xs text-slate-600">Done</p>
          </div>
        </div>
      </Card>

      {/* Folder Tabs - Simplified */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {folders.map((folder) => {
          const folderTaskCount = getTasksByFolder(folder.id).filter(t => !t.completed).length;
          const isActive = activeFolder === folder.id;
          
          return (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <span>{folder.icon}</span>
              <span className="text-sm">{folder.name}</span>
              {folder.id !== 'all' && folderTaskCount > 0 && (
                <Badge className={`h-5 min-w-5 px-1.5 text-xs ${
                  isActive
                    ? 'bg-blue-500 hover:bg-blue-500'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                }`}>
                  {folderTaskCount}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tasks */}
      {displayActiveTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-slate-900">Active Tasks</h2>
          <div className="space-y-2">
            {displayActiveTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {displayCompletedTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-slate-900">Completed</h2>
          <div className="space-y-2 opacity-60">
            {displayCompletedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {displayActiveTasks.length === 0 && displayCompletedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No tasks in this folder</p>
        </div>
      )}
    </div>
  );
}
