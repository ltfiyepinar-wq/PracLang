
import React, { useState } from 'react';
import { SavedWord, UserProfile } from '../types';
import { Volume2, CheckCircle2, BrainCircuit, Mic, Plus, X } from 'lucide-react';

interface WordsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Words: React.FC<WordsProps> = ({ user, onUpdateUser }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newWordData, setNewWordData] = useState({
    term: '',
    translation: '',
    pronunciation: ''
  });

  const activeWords = user.savedWords.filter(w => !w.isLearned);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 
        'de': 'de-DE', 'it': 'it-IT', 'kr': 'ko-KR'
      };
      utterance.lang = langMap[user.selectedLanguageId] || 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkAsLearned = (wordId: string) => {
    const updatedWords = user.savedWords.map(w => 
        w.id === wordId ? { ...w, isLearned: true } : w
    );
    onUpdateUser({ ...user, savedWords: updatedWords });
  };

  const handleAddWord = () => {
    if (!newWordData.term || !newWordData.translation) return;

    const newWord: SavedWord = {
        id: Date.now().toString(),
        term: newWordData.term,
        translation: newWordData.translation,
        pronunciation: newWordData.pronunciation || '...', // Optional
        isLearned: false
    };

    onUpdateUser({
        ...user,
        savedWords: [newWord, ...user.savedWords]
    });

    setNewWordData({ term: '', translation: '', pronunciation: '' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text pb-24 animate-in fade-in relative">
      
      {/* Header */}
      <div className="p-6 pt-8 bg-gradient-to-b from-slate-900 to-app-bg sticky top-0 z-20 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">Kelime Atölyesi</h1>
            <div className="bg-app-primary/20 p-2 rounded-full">
                <BrainCircuit className="text-app-primary" size={24} />
            </div>
        </div>
        <p className="text-slate-400 text-sm">
          Telaffuzunda zorlandığın kelimeler buraya eklenir. Dinle ve tekrar et.
        </p>
      </div>

      <div className="p-6 space-y-4">
        {activeWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <Mic size={48} className="mb-4 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-400">Tebrikler!</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto mt-2">
                    Listen boş. Tüm kelimeleri öğrendin veya henüz eklemedin.
                </p>
            </div>
        ) : (
            activeWords.map((word) => (
            <div 
                key={word.id} 
                className="bg-app-card border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden group hover:border-app-primary/50 transition-all"
            >
                {/* Background Decoration */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-slate-800 to-transparent opacity-20 rounded-bl-full pointer-events-none"></div>

                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        {/* Main Word */}
                        <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">{word.term}</h3>
                        
                        {/* Meaning */}
                        <p className="text-slate-400 text-sm mb-4">{word.translation}</p>

                        {/* Pronunciation Guide */}
                        <div className="inline-flex items-center bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                            <span className="text-[10px] text-slate-500 uppercase font-bold mr-2 tracking-wider">OKUNUŞU</span>
                            <span className="text-app-accent font-mono text-sm italic">{word.pronunciation}</span>
                        </div>
                    </div>

                    {/* Play Button */}
                    <button 
                        onClick={() => speak(word.term)}
                        className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-app-primary hover:bg-app-primary hover:text-white transition-all shadow-lg shadow-slate-900 active:scale-95"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Çalışmaya devam</span>
                    <button 
                        onClick={() => handleMarkAsLearned(word.id)}
                        className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center transition-colors px-3 py-1 rounded-full hover:bg-green-400/10"
                    >
                        <CheckCircle2 size={14} className="mr-1" /> Öğrendim
                    </button>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-app-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-app-primary/40 hover:scale-105 active:scale-95 transition-all z-30"
      >
        <Plus size={28} />
      </button>

      {/* Add Word Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-app-card border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Yeni Kelime Ekle</h3>
                    <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Kelime / Cümle</label>
                        <input 
                            type="text"
                            placeholder="Örn: Serendipity" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-app-primary focus:outline-none"
                            value={newWordData.term}
                            onChange={(e) => setNewWordData({...newWordData, term: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Anlamı</label>
                        <input 
                            type="text"
                            placeholder="Örn: Mutlu tesadüf" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-app-primary focus:outline-none"
                            value={newWordData.translation}
                            onChange={(e) => setNewWordData({...newWordData, translation: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Okunuşu (Opsiyonel)</label>
                        <input 
                            type="text"
                            placeholder="Örn: Ser-en-di-pi-ti" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-app-primary focus:outline-none"
                            value={newWordData.pronunciation}
                            onChange={(e) => setNewWordData({...newWordData, pronunciation: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={handleAddWord}
                        disabled={!newWordData.term || !newWordData.translation}
                        className={`w-full py-3.5 rounded-xl font-bold mt-2 transition-all ${
                            newWordData.term && newWordData.translation 
                            ? 'bg-app-primary text-white shadow-lg shadow-app-primary/20 hover:scale-[1.02]' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        Ekle
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Words;
