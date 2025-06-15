import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Submit game score to backend
async function submitScore(lessonId, score) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post('http://localhost:8000/api/scores/submit/', 
      { lesson: lessonId, score },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log(score);
    console.log('Score submitted:', response.data);
  } catch (error) {
    console.error('Failed to submit score', error);
  }
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data));
  }, []);

  // Fetch leaderboard for selected lesson
  useEffect(() => {
    if (!selectedLesson) {
      setLeaderboard([]);
      return;
    }

    fetch(`http://localhost:8000/api/lessons/${selectedLesson.id}/leaderboard/`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(() => setLeaderboard([]));
  }, [selectedLesson]);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const yearKey = `Year ${lesson.year}`;
    if (!acc[yearKey]) acc[yearKey] = [];
    acc[yearKey].push(lesson);
    return acc;
  }, {});

  const handlePlayGame = () => {
    if (!selectedLesson) return;

    // Example: Open game in a new tab
    const url = `${window.location.origin}/game/${selectedLesson.id}`;
    window.open(url, '_blank');

    // Placeholder: submit a dummy score (replace with actual game score when available)
    const dummyScore = Math.floor(Math.random() * 100); // replace with real score!
    submitScore(selectedLesson.id, dummyScore);
  };

  return (
    <div className="flex h-screen w-screen bg-beige text-black overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        lessonsByYear={groupedLessons}
        onSelectLesson={setSelectedLesson}
      />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl h-[70vh] border-2 border-dashed border-black/20 rounded-2xl bg-white/50 p-6 overflow-y-auto mb-6">
            {selectedLesson ? (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                <p>{selectedLesson.text}</p>
              </>
            ) : (
              <p className="text-center text-gray-600">Select a lesson to begin.</p>
            )}
          </div>

          {/* Leaderboard section */}
          {selectedLesson && (
            <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
              {leaderboard.length === 0 ? (
                <p className="text-gray-500">No scores yet. Be the first to play!</p>
              ) : (
                <ul>
                  {leaderboard.map((entry) => (
                    <li key={entry.id} className="flex justify-between border-b py-1">
                      <span>{entry.user}</span>
                      <span>{entry.score}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedLesson && (
            <button
              onClick={handlePlayGame}
              className="bg-[#6B4226] hover:bg-[#5a3922] text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Play Game
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
