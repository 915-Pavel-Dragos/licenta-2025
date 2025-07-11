import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

async function submitScore(lessonId, score) {
  try {
    const response = await api.post('/gamescore/', { lesson: lessonId, score });
    console.log('Score submitted:', response.data);
  } catch (error) {
    console.error('Failed to submit score', error);
  }
}

async function markLessonFinished(lessonId) {
  try {
    const response = await api.post('/lesson-finished/', { lesson: lessonId });
    console.log('Lesson marked as finished:', response.data);
  } catch (error) {
    console.error('Failed to mark lesson as finished', error);
  }
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const response = await api.get('/lessons/');
      setLessons(response.data);
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
    }
  };

  const fetchLeaderboard = async (lessonId) => {
    if (!lessonId) return;

    try {
      const response = await api.get(`/gamescore/${lessonId}/`);
      const data = response.data;

      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaderboard(sorted);
      } else {
        console.error('Expected array but got:', data);
        setLeaderboard([]);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedLesson) {
      fetchLeaderboard(selectedLesson.id);
    } else {
      setLeaderboard([]);
    }
  }, [selectedLesson]);

  useEffect(() => {
    const handleFocus = () => {
      if (selectedLesson) {
        fetchLeaderboard(selectedLesson.id);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [selectedLesson]);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const yearKey = `Year ${lesson.year}`;
    if (!acc[yearKey]) acc[yearKey] = [];
    acc[yearKey].push(lesson);
    return acc;
  }, {});

  const handleSelectLesson = async (lesson) => {
    setSelectedLesson(lesson);
    await markLessonFinished(lesson.id);
  };

  const handlePlayGame = () => {
    if (!selectedLesson) return;

    let gamePath;

    if (selectedLesson.id === 1) {
      gamePath = `/game/${selectedLesson.id}`; 
    } else if (selectedLesson.id === 2) {
      gamePath = `/algebra-solve/${selectedLesson.id}`;
    } else if (selectedLesson.id === 3) {
      gamePath = `/multiplication-match/${selectedLesson.id}`;
    } else if (selectedLesson.id === 4) {
      gamePath = `/division-pop/${selectedLesson.id}`;
    } else {
      alert("No game is linked to this lesson yet.");
      return;
    }

    window.open(`${window.location.origin}${gamePath}`, '_blank');
  };

  return (
    <div className="flex h-screen w-screen bg-beige text-black overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        lessonsByYear={groupedLessons}
        onSelectLesson={handleSelectLesson}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-full h-auto border-2 border-dashed border-black/20 rounded-2xl bg-white/50 p-6 overflow-y-auto mb-6">
              {selectedLesson ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                  <p>{selectedLesson.text}</p>
                </>
              ) : (
                <p className="text-center text-gray-600">Select a lesson to begin.</p>
              )}
            </div>

            {selectedLesson && (
              <div className="w-full bg-white p-4 rounded-lg shadow-md mb-6 overflow-y-auto max-h-60">
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
          </div>
        </main>
      </div>
    </div>
  );
}
