import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { MessageSquare, Mic, Ear, BarChart3, Moon, Sun, Menu, X } from 'lucide-react';
import { useStore } from './store/useStore';

// Components
import ChatComponent from './components/ChatComponent';
import AudioRecorder from './components/AudioRecorder';

const Header = ({ toggleMenu }) => {
  const { theme, toggleTheme } = useStore();
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleMenu} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <Menu size={24} />
        </button>
        <span className="text-xl font-display font-bold text-francia-blue flex items-center gap-2">
          <span className="text-2xl">🇫🇷</span> TutorFrancés
        </span>
      </div>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};

const Sidebar = ({ isOpen, closeMenu }) => {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
    { id: 'voz', label: 'Voz (Whisper)', icon: Mic, path: '/voz' },
    { id: 'pronunciacion', label: 'Pronunciación (Vosk)', icon: Ear, path: '/pronunciacion' },
    { id: 'progreso', label: 'Progreso', icon: BarChart3, path: '/progreso' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMenu} />
      )}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-16 lg:pt-0`}>
        <button onClick={closeMenu} className="lg:hidden absolute top-4 right-4 p-2 text-gray-500">
          <X size={24} />
        </button>
        <nav className="p-4 space-y-2 mt-4 lg:mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive 
                  ? 'bg-francia-blue text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

import VoiceMode from './components/VoiceMode';
import PronunciationMode from './components/PronunciationMode';
import ProgressDashboard from './components/ProgressDashboard';

const App = () => {
  const { theme, userId, setUserId } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Generar ID anónimo al cargar
  useEffect(() => {
    if (!userId) setUserId('anon_' + Date.now());
  }, [userId]);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
        <Header toggleMenu={() => setSidebarOpen(true)} />
        
        <div className="flex-1 flex overflow-hidden lg:pl-0">
          <Sidebar isOpen={sidebarOpen} closeMenu={() => setSidebarOpen(false)} />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-light-bg dark:bg-[#111]">
            <Routes>
              <Route path="/" element={<Navigate to="/chat" />} />
              <Route path="/chat" element={<div className="max-w-4xl mx-auto"><h2 className="text-2xl font-bold font-display text-gray-800 dark:text-white mb-6">Chat de Inmersión</h2><ChatComponent /></div>} />
              <Route path="/voz" element={<VoiceMode />} />
              <Route path="/pronunciacion" element={<PronunciationMode />} />
              <Route path="/progreso" element={<ProgressDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
