
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

const LANGUAGES: Language[] = [
  { id: 'en', name: 'İngilizce', flag: '🇬🇧', flagImage: 'https://flagcdn.com/w160/gb.png', isFree: true },
  { id: 'es', name: 'İspanyolca', flag: '🇪🇸', flagImage: 'https://flagcdn.com/w160/es.png', isFree: true },
  { id: 'fr', name: 'Fransızca', flag: '🇫🇷', flagImage: 'https://flagcdn.com/w160/fr.png', isFree: true },
  { id: 'de', name: 'Almanca', flag: '🇩🇪', flagImage: 'https://flagcdn.com/w160/de.png', isFree: true },
  { id: 'it', name: 'İtalyanca', flag: '🇮🇹', flagImage: 'https://flagcdn.com/w160/it.png', isFree: true },
  { id: 'kr', name: 'Korece', flag: '🇰🇷', flagImage: 'https://flagcdn.com/w160/kr.png', isFree: true },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLangId, setSelectedLangId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (name && surname && email && selectedLangId) {
      const newUser: UserProfile = {
        name,
        surname,
        email,
        selectedLanguageId: selectedLangId,
        unlockedLanguages: [selectedLangId], // The selected language is free and unlocked
        xp: 0,
        streak: 1,
        level: 'A1-A2', // Default level
        savedWords: [], // Initialize empty list
        avatarConfig: {
            hairColor: 'black',
            skinColor: 'light',
            mouth: 'smile'
        }
      };
      onComplete(newUser);
    }
  };

  const isFormValid = name.length > 1 && surname.length > 1 && email.includes('@') && selectedLangId;

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-start pt-10 max-w-md mx-auto w-full">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Hoş geldin!</h1>
          <p className="text-app-subtext">Hemen başlayalım.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Adın"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-app-card border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-app-primary focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Soyadın"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="bg-app-card border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-app-primary focus:outline-none transition-colors"
            />
          </div>
          <input
            type="email"
            placeholder="E-posta adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-app-card border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-app-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-1">Hangi dili öğrenmek istiyorsun?</h2>
          <p className="text-xs text-app-accent mb-4">Sadece bir dil ücretsiz. Seçtiğin dil ömür boyu ücretsiz kalır.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLangId === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLangId(lang.id)}
                  className={`relative p-3 rounded-2xl border-2 flex items-center space-x-3 transition-all duration-200 ${
                    isSelected
                      ? 'bg-app-primary/10 border-app-primary shadow-lg shadow-app-primary/20 scale-[1.02]'
                      : 'bg-app-card border-transparent hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 ${isSelected ? 'border-app-primary' : 'border-slate-600'}`}>
                    <img 
                      src={lang.flagImage} 
                      alt={lang.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {lang.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-app-primary rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto max-w-md mx-auto w-full">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
            isFormValid
              ? 'bg-app-primary text-white shadow-lg shadow-app-primary/40 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Başla →
        </button>
        <p className="text-center text-xs text-slate-600 mt-4">
          Devam ederek Kullanım Koşulları'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
