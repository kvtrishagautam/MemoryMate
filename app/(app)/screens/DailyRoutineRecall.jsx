import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const questions = [
  "What did you have for breakfast/lunch/dinner today?",
  "Did you go outside today? Where did you go?",
  "Did you talk to anyone on the phone or in person? Who was it?",
  "What TV show or music did you listen to today?",
  "Did you do any activities or hobbies today? (e.g., reading, knitting, gardening)",
  "What was the weather like today?",
  "Did you see or hear anything interesting today?",
  "What clothes are you wearing today? What color is your shirt?",
  "Did you take any medicine today?",
  "How are you feeling today?",
  "What time did you wake up today?",
  "Did you have any visitors today?",
  "What did you drink with your meal?",
  "Did you take a walk or exercise today?",
  "What was the most enjoyable part of your day?",
  "Did you read a book or newspaper today?",
  "Did you see any animals today?",
  "What is one thing you are grateful for today?",
  "Did you hear any interesting news today?",
  "What do you plan to do tomorrow?"
];

const DailyRoutineRecall = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedQuestions] = useState(() => {
    // Randomly select 10 questions from the pool
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  });

  const handleSubmit = useCallback(() => {
    if (answer.trim() === '') {
      return; // Don't proceed if answer is empty
    }

    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
    } else {
      setShowCompletion(true);
    }
  }, [answer, currentQuestionIndex]);

  const handleExit = useCallback(() => {
    router.replace('/(app)/patient/home');
  }, [router]);

  const handleVoiceOver = useCallback(async () => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];

    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      await Speech.speak(currentQuestion, {
        rate: 0.9,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
      });
    }
  }, [currentQuestionIndex, selectedQuestions, isSpeaking]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Routine Recall</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.questionCount}>
            Question {currentQuestionIndex + 1} of 10
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>
              {selectedQuestions[currentQuestionIndex]}
            </Text>
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={handleVoiceOver}
            >
              <Ionicons 
                name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
                size={24} 
                color="#4A90E2" 
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer here..."
            multiline
            maxLength={200}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !answer.trim() && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!answer.trim()}
        >
          <Text style={styles.buttonText}>
            {currentQuestionIndex === 9 ? 'Finish' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCompletion}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Congratulations! 🎉</Text>
            <Text style={styles.modalText}>
              You've completed today's memory exercise.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleExit}
            >
              <Text style={styles.modalButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  questionCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    marginBottom: 0,
    marginTop: 25,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    lineHeight: 34,
  },
  voiceButton: {
    padding: 10,
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    fontSize: 23,
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5F1FF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: -20,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DailyRoutineRecall;
