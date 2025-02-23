import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CARD_PAIRS = 4;
const TOTAL_CARDS = 9;
const FLIP_DURATION = 300;
const MATCH_BONUS = 50;
const TIME_BONUS_FACTOR = 0.5;
const STREAK_MULTIPLIER = 1.5;

const MemoryCardGame = () => {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const symbols = ['🐶', '🐱', '🐰', '🐼', '🦊', '🐶', '🐱', '🐰', '🐼'];
    const shuffledCards = symbols
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: new Animated.Value(0),
        matched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setStartTime(Date.now());
    setMoves(0);
    setScore(0);
    setStreak(0);
    setMatchedPairs([]);
    setFlippedIndices([]);
    setGameOver(false);
  };

  const flipCard = (index) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      cards[index].matched
    ) {
      return;
    }

    Animated.spring(cards[index].flipped, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      checkMatch(newFlippedIndices);
    }
  };

  const checkMatch = (indices) => {
    const [firstIndex, secondIndex] = indices;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    setMoves(moves + 1);

    if (firstCard.symbol === secondCard.symbol) {
      // Update matched pairs
      setMatchedPairs([...matchedPairs, firstCard.symbol]);
      setStreak(streak + 1);
      
      // Update score
      const streakBonus = Math.floor(MATCH_BONUS * Math.pow(STREAK_MULTIPLIER, streak));
      setScore(score + MATCH_BONUS + streakBonus);

      // Check for win condition
      if (matchedPairs.length === CARD_PAIRS - 1) {
        handleGameWin();
      }

      setTimeout(() => setFlippedIndices([]), 500);
    } else {
      setStreak(0);
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(firstCard.flipped, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }),
          Animated.spring(secondCard.flipped, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }),
        ]).start();
        setFlippedIndices([]);
      }, 1000);
    }
  };

  const handleGameWin = () => {
    const endTime = Date.now();
    const timeBonus = Math.floor(
      (300000 - (endTime - startTime)) * TIME_BONUS_FACTOR
    );
    setScore(score + Math.max(0, timeBonus));
    setGameOver(true);
  };

  const renderCard = (card, index) => {
    const flipRotation = card.flipped.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const backRotation = card.flipped.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    });

    return (
      <TouchableOpacity
        key={card.id}
        style={styles.cardContainer}
        onPress={() => flipCard(index)}
        activeOpacity={0.7}
      >
        {/* Front of card (hidden) */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              transform: [{ rotateY: flipRotation }],
            },
          ]}
        >
          <Ionicons name="help-outline" size={32} color="#666" />
        </Animated.View>

        {/* Back of card (symbol) */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backRotation }],
            },
            card.matched && styles.matchedCard,
          ]}
        >
          <Text style={styles.cardText}>{card.symbol}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Moves: {moves}</Text>
          <Text style={styles.statsText}>Score: {score}</Text>
          <Text style={styles.statsText}>Streak: {streak}</Text>
        </View>
      </View>

      <View style={styles.gameBoard}>
        {cards.map((card, index) => renderCard(card, index))}
      </View>

      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Congratulations!</Text>
          <Text style={styles.scoreText}>Final Score: {score}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={initializeGame}
            >
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => router.replace('/screens/GamePage')}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cardContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFront: {
    backgroundColor: '#e8e8e8',
  },
  cardBack: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 32,
  },
  matchedCard: {
    backgroundColor: '#e0f7e0',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  exitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemoryCardGame;
