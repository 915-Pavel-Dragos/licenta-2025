import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function generateEquation() {
  const x = Math.floor(Math.random() * 10) + 1;
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 10);
  const result = a * x + b;

  return {
    question: `${a}x + ${b} = ${result}`,
    answer: x
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

export default function AlgebraSolveGame() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [equation, setEquation] = useState(generateEquation());
  const [userInput, setUserInput] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userAnswer = parseInt(userInput, 10);

    if (userAnswer === equation.answer) {
      setScore(prev => prev + 5);
    } else {
      const newMistakes = mistakes + 1;
      const finalScore = score - 2;
      setScore(finalScore);
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        handleGameOver(finalScore);
        return;
      }
    }

    setEquation(generateEquation());
    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-[#f9f7e5] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Solve for x: {lesson?.title}</h1>

      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">{equation.question}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-lg w-40 text-center"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Submit Answer
          </button>
        </form>

        <div className="text-lg mt-6">
          <p>Score: <span className="font-bold">{score}</span></p>
          <p>Mistakes: <span className="font-bold">{mistakes}</span> / 3</p>
        </div>
      </div>
    </div>
  );
}
