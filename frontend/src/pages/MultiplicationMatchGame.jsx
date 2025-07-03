import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const correct = a * b;

  const choices = new Set([correct]);
  while (choices.size < 4) {
    const fake = correct + Math.floor(Math.random() * 10) - 5;
    if (fake > 0) choices.add(fake);
  }

  const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);
  return {
    question: `${a} × ${b}`,
    correctAnswer: correct,
    options: shuffled,
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

export default function MultiplicationMatchGame() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [question, setQuestion] = useState(generateQuestion());
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);

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
  }, [lessonId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      markLessonFinished(lessonId);
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [lessonId]);

  const handleGameOver = async (finalScore) => {
    if (finalScore > 20) {
      await awardXP(5);
    }

    await submitScore(lessonId, finalScore);
    alert(`Game Over! Final score: ${finalScore}`);
    window.close();
  };

  const handleChoice = (choice) => {
    if (choice === question.correctAnswer) {
      setScore(prev => prev + 5);
      setQuestion(generateQuestion());
    } else {
      const newMistakes = mistakes + 1;
      const finalScore = score - 2;
      setScore(finalScore);
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        handleGameOver(finalScore);
      } else {
        setQuestion(generateQuestion());
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7e5] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Multiplication Game: {lesson?.title}</h1>

      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">What is {question.question}?</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleChoice(opt)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-semibold"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="text-lg mt-4">
          <p>Score: <span className="font-bold">{score}</span></p>
          <p>Mistakes: <span className="font-bold">{mistakes}</span> / 3</p>
        </div>
      </div>
    </div>
  );
}
