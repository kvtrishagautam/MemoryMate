import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskService } from '../../../lib/database';

const Task = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update local state immediately for better UX
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      // Update in database
      await TaskService.updateTaskCompletion(taskId, !task.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert local state if database update fails
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: task.completed } : t
      ));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Tasks</Text>
        <View style={{ width: 24 }} /> {/* Empty view for header alignment */}
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskCheckbox}>
              {task.completed && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
            </View>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                {task.title}
              </Text>
              <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
                {task.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  taskItemCompleted: {
    backgroundColor: '#e8f5e9',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskDescriptionCompleted: {
    color: '#81c784',
    textDecorationLine: 'line-through',
  },
});

export default Task;