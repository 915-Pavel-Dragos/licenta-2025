import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function generateEquation() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const correctAnswer = a + b;
  const isCorrect = Math.random() > 0.5;
  const displayedAnswer = isCorrect ? correctAnswer : correctAnswer + Math.floor(Math.random() * 5) - 2;

  return {
    text: `${a} + ${b} = ${displayedAnswer}`,
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

export default function GamePage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [equation, setEquation] = useState(generateEquation());
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Error loading lesson for game:', err);
      }
    };

    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      markLessonFinished(lessonId);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timer); // Clean up on exit
  }, [lessonId]);

  const handleAnswer = (userAnswer) => {
    const correct = userAnswer === equation.isCorrect;

    if (correct) {
      setScore(prev => prev + 5);
    } else {
      const newMistakes = mistakes + 1;
      setScore(prev => prev - 3);
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        alert(`Game Over! Final score: ${score - 3}`);
        submitScore(lessonId, score - 3);
        window.close();
        return;
      }
    }

    setEquation(generateEquation());
  };

  return (
    <div className="min-h-screen bg-[#f9f7e5] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Game for: {lesson?.title}</h1>

      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">Is this equation correct?</h2>
        <p className="text-3xl font-bold mb-6">{equation.text}</p>

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            True
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            False
          </button>
        </div>

        <div className="text-lg">
          <p>Score: <span className="font-bold">{score}</span></p>
          <p>Mistakes: <span className="font-bold">{mistakes}</span> / 3</p>
        </div>
      </div>
    </div>
  );
}
