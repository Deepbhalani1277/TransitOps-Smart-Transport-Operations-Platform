import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full border border-gray-800 bg-panel hover:bg-gray-900/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 group overflow-hidden shadow-md flex items-center justify-center w-10 h-10"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {/* Glow effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Morphing Sun/Moon Container */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-5 h-5 text-amber-500 absolute transition-all duration-500 transform ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-50 opacity-0'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-5 h-5 text-yellow-400 absolute transition-all duration-500 transform ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-50 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
