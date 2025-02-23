import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const CompletedTasksScreen = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', true);

      if (error) {
        console.error('Error fetching completed tasks:', error);
        return;
      }

      setCompletedTasks(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Completed Tasks</Text>
      </View>

      <ScrollView style={styles.taskList}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              {task.completed_at && (
                <Text style={styles.completedAt}>
                  Completed: {new Date(task.completed_at).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed tasks found</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  completedAt: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
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

export default CompletedTasksScreen;
