import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const TaskItem = ({ task, completed, onToggle }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskContent}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>
    </View>
    <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
      {completed && <Ionicons name="checkmark" size={24} color="#6B4EFF" />}
    </TouchableOpacity>
  </View>
);

export default function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Task1',
      description: 'Solve a simple puzzle or play a matching game.',
      completed: false,
    },
    {
      id: 2,
      title: 'Task1',
      description: 'Solve a simple puzzle or play a matching game.',
      completed: false,
    },
    {
      id: 3,
      title: 'Task1',
      description: 'Solve a simple puzzle or play a matching game.',
      completed: false,
    },
    {
      id: 4,
      title: 'Task1',
      description: 'Solve a simple puzzle or play a matching game.',
      completed: false,
    },
    {
      id: 5,
      title: 'Task1',
      description: 'Solve a simple puzzle or play a matching game.',
      completed: false,
    },
  ]);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>MemoryMate</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>Daily tasks:</Text>
        <Text style={styles.tasksCount}>Completed ({completedCount}/{tasks.length})</Text>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            completed={task.completed}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <Link href="/home" style={styles.navItem}>
          <Ionicons name="home" size={24} color="black" />
        </Link>
        <Link href="/notifications" style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </Link>
        <Link href="/location" style={styles.navItem}>
          <Ionicons name="location-outline" size={24} color="black" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    color: '#6B4EFF',
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tasksTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  tasksCount: {
    fontSize: 16,
    color: '#666',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6B4EFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    padding: 8,
  },
});
