import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

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
      description: 'Help with simple household chores (folding clothes, setting the table).',
      completed: false,
    },
    {
      id: 3,
      title: 'Task1',
      description: ' Water plants or do light gardening',
      completed: false,
    },
    {
      id: 4,
      title: 'Task1',
      description: ' Journal or talk about the best part of the day.',
      completed: false,
    },
    {
      id: 5,
      title: 'Task1',
      description: 'Read a short story or listen to an audiobook.',
      completed: false,
    },
  ]);

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update local state immediately for better UX
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        // Revert local state if update fails
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, completed: task.completed } : t
        ));
      }
    } catch (error) {
      console.error('Error:', error);
      // Revert local state if update fails
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: task.completed } : t
      ));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tasks</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id}
            onPress={() => toggleTask(task.id)}
            style={styles.taskItem}
          >
            <View style={[styles.checkboxContainer, task.completed && styles.checkedContainer]}>
              {task.completed && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
            <Text style={[styles.taskText, task.completed && styles.completedText]}>
              {task.description}
            </Text>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedContainer: {
    backgroundColor: '#000',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});