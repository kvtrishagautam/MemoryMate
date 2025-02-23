import { supabase } from './supabase';

export class TaskService {
  static async getTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  static async updateTaskCompletion(taskId, completed) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async createTask(description) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ description, completed: false }])
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}