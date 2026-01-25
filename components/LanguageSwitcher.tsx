
import React from 'react';

interface Props {
  current: 'en' | 'ta';
  onToggle: (lang: 'en' | 'ta') => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(current === 'en' ? 'ta' : 'en')}
      className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm transition-all border border-white/20 flex items-center gap-2"
    >
      <span className="text-lg">🌐</span>
      {current === 'en' ? 'தமிழ்' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
