import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

function generateDivisionProblem() {
  const divisor = Math.floor(Math.random() * 6) + 2;
  const quotient = Math.floor(Math.random() * 90) + 10;
  const dividend = divisor * quotient;
  return { dividend, divisor, correct: quotient };
}

function createBall(correctAnswer) {
  const isCorrect = Math.random() < 0.3;
  const value = isCorrect
    ? correctAnswer
    : correctAnswer + Math.floor(Math.random() * 10) - 5;

  return {
    id: Date.now() + Math.random(),
    value,
    y: 100,
    x: Math.random() * 90 + 5,
    isCorrect,
  };
}

const submitScore = async (lessonId, score) => {
  try {
    const token = localStorage.getItem('accessToken');
    await fetch('http://localhost:8000/api/gamescore/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lesson: lessonId, score }),
    });
  } catch (error) {
    console.error('Error submitting score:', error);
  }
};

const markLessonFinished = async (lessonId) => {
  try {
    const token = localStorage.getItem('accessToken');
    await fetch('http://localhost:8000/api/lesson-finished/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lesson: lessonId }),
    });
  } catch (error) {
    console.error('Error marking lesson finished:', error);
  }
};

const awardXP = async (xp) => {
  try {
    const token = localStorage.getItem('accessToken');
    await fetch('http://localhost:8000/api/user/xp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ xp_earned: xp }),
    });
  } catch (error) {
    console.error('Failed to award XP:', error);
  }
};

export default function DivisionPopGame() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [problem, setProblem] = useState(generateDivisionProblem());
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const gameOverRef = useRef(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Error loading lesson:', err);
      }
    };
    fetchLesson();
    markLessonFinished(lessonId);
  }, [lessonId]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBalls(prev => [...prev, createBall(problem.correct)]);
    }, 1200);

    return () => clearInterval(intervalRef.current);
  }, [problem]);

  useEffect(() => {
    const animation = setInterval(() => {
      setBalls(prev =>
        prev
          .map(ball => ({ ...ball, y: ball.y - 0.5 }))
          .filter(ball => ball.y >= 0)
      );
    }, 30);
    return () => clearInterval(animation);
  }, []);

  const handlePop = (ball) => {
    setBalls(prev => prev.filter(b => b.id !== ball.id));

    if (ball.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: {
          x: ball.x / 100,
          y: 1 - ball.y / 100,
        },
      });

      setScore(prev => prev + 5);
      setProblem(generateDivisionProblem());
    } else {
      setMistakes(prev => {
        const newMistakes = prev + 1;
        if (newMistakes >= 3 && !gameOverRef.current) {
          endGame(score - 2);
        }
        return newMistakes;
      });
      setScore(prev => prev - 2);
    }
  };

  const endGame = async (finalScore) => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;

    if (finalScore > 20) {
      await awardXP(5);
    }

    await submitScore(lessonId, finalScore);
    alert(`Game Over! Final score: ${finalScore}`);
    window.close();
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[#f9f7e5] overflow-hidden z-0">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-3xl font-bold mb-2">Division Pop: {lesson?.title}</h1>
        <p className="text-xl font-medium mb-2">What is {problem.dividend} ÷ {problem.divisor}?</p>
        <p className="mb-1">Score: <strong>{score}</strong></p>
        <p>Mistakes: <strong>{mistakes} / 3</strong></p>
      </div>

      {balls.map((ball) => (
        <div
          key={ball.id}
          onClick={() => handlePop(ball)}
          className="absolute bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-full flex items-center justify-center shadow-md cursor-pointer"
          style={{
            left: `${ball.x}%`,
            bottom: `${ball.y}%`,
            width: '60px',
            height: '60px',
            transition: 'bottom 0.03s linear',
          }}
        >
          {ball.value}
        </div>
      ))}
    </div>
  );
}
