import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data));
  }, []);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const yearKey = `Year ${lesson.year}`;
    if (!acc[yearKey]) acc[yearKey] = [];
    acc[yearKey].push(lesson);
    return acc;
  }, {});

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
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-4xl h-[70vh] border-2 border-dashed border-black/20 rounded-2xl bg-white/50 p-6 overflow-y-auto">
            {selectedLesson ? (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                <p>{selectedLesson.text}</p>
              </>
            ) : (
              <p className="text-center text-gray-600">Select a lesson to begin.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
