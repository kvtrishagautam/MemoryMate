import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Task = () => {
  const router = useRouter();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Tasks</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.taskCountContainer}>
        <Text style={styles.taskCount}>
          Completed ({tasks.filter(t => t.completed).length}/{tasks.length})
        </Text>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => toggleTask(task.id)} 
              style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
            >
              {task.completed && <Ionicons name="checkmark" size={24} color="#6B4EFF" />}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  taskCountContainer: {
    padding: 16,
  },
  taskCount: {
    fontSize: 16,
    color: '#666',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B4EFF',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#F0EDFF',
  },
});

export default Task;
