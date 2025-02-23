import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskService } from '../../../lib/database';

const TaskPage = () => {
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

      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      await TaskService.updateTaskCompletion(taskId, !task.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert on error
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
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
              onPress={() => toggleTask(task.id)}
            >
              <View style={styles.taskCheckbox}>
                {task.completed && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </View>
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title || 'Untitled Task'}
                </Text>
                {task.description && (
                  <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
                    {task.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks available</Text>
          </View>
        )}
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskItemCompleted: {
    backgroundColor: '#f8f9fa',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  taskTitleCompleted: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskDescriptionCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TaskPage;
