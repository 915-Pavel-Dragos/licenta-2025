import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from 'clsx';


export function Sidebar ({ open, setOpen, lessonsByYear, onSelectLesson }) {
  const [expanded, setExpanded] = useState({});

  const toggleYear = (year) => {
    setExpanded(prev => ({ ...prev, [year]: !prev[year] }));
  };

  return (
    <aside className={clsx(
      'bg-beige fixed z-40 inset-y-0 left-0 w-64 shadow-md transform transition-transform duration-300 ease-in-out overflow-y-auto',
      open ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="h-16"></div>
      <div className="p-4 font-bold text-lg border-b">Lessons</div>
      <div className="p-2">
        {Object.entries(lessonsByYear).map(([year, lessons]) => (
          <div key={year}>
            <button
              onClick={() => toggleYear(year)}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-black/5 transition font-semibold"
            >
              <span>{year}</span>
              {expanded[year] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded[year] && (
              <ul className="ml-4 mt-1 space-y-1">
                {lessons.map(lesson => (
                  <li
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className="p-2 rounded hover:bg-black/10 cursor-pointer"
                  >
                    {lesson.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
