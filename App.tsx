
import React, { useState, useEffect } from 'react';
import { UserProfile, AppScreen, Scenario, SavedWord, AnalysisResult } from './types';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import ScenarioSelect from './components/ScenarioSelect';
import Conversation from './components/Conversation';
import Profile from './components/Profile';
import Words from './components/Words';
import Leaderboard from './components/Leaderboard';
import Result from './components/Result';
import { Home as HomeIcon, BookOpen, Trophy, User } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);

  // Mock Data to simulate existing "Hard Words" for demonstration
  const DEMO_WORDS: SavedWord[] = [
    { id: '1', term: 'Squirrel', translation: 'Sincap', pronunciation: 'Skwırıl', isLearned: false },
    { id: '2', term: 'Schedule', translation: 'Program', pronunciation: 'Skecul', isLearned: false },
    { id: '3', term: 'Queue', translation: 'Sıra', pronunciation: 'Kyu', isLearned: false },
  ];

  const handleOnboardingComplete = (newUser: UserProfile) => {
    // Inject demo words for a better first experience
    const userWithData = { ...newUser, savedWords: DEMO_WORDS };
    setUser(userWithData);
    setCurrentScreen(AppScreen.HOME);
  };

  const handleNavigate = (screen: AppScreen, data?: any) => {
    setCurrentScreen(screen);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentScreen(AppScreen.SCENARIO_DETAIL);
  };

  const handleStartConversation = (level: 'A1-A2' | 'B1' | 'B2-C1') => {
    if (user) {
      setUser({ ...user, level });
      setCurrentScreen(AppScreen.CONVERSATION);
    }
  };

  const handleFinishConversation = (result: AnalysisResult) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        xp: user.xp + result.score,
        streak: user.streak
      };
      setUser(updatedUser);
      setLastAnalysis(result);
      setCurrentScreen(AppScreen.RESULT);
    }
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(AppScreen.ONBOARDING);
  };

  // Render Logic
  if (!user || currentScreen === AppScreen.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentScreen === AppScreen.CONVERSATION && activeScenario) {
    return (
      <Conversation 
        user={user} 
        scenario={activeScenario} 
        onFinish={handleFinishConversation}
        onExit={() => setCurrentScreen(AppScreen.HOME)}
        onUpdateUser={handleProfileUpdate}
      />
    );
  }

  if (currentScreen === AppScreen.SCENARIO_DETAIL && activeScenario) {
    return (
      <ScenarioSelect 
        scenario={activeScenario} 
        onBack={() => setCurrentScreen(AppScreen.HOME)} 
        onStart={handleStartConversation}
      />
    );
  }

  if (currentScreen === AppScreen.RESULT && lastAnalysis) {
    return (
      <Result 
        result={lastAnalysis} 
        onHome={() => setCurrentScreen(AppScreen.HOME)} 
      />
    );
  }

  return (
    <div className="bg-app-bg min-h-screen flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {currentScreen === AppScreen.HOME && (
          <Home 
            user={user} 
            onNavigate={handleNavigate} 
            onSelectScenario={handleSelectScenario}
          />
        )}
        {currentScreen === AppScreen.WORDS && (
          <Words 
            user={user} 
            onUpdateUser={handleProfileUpdate}
          />
        )}
        {currentScreen === AppScreen.LEADERBOARD && <Leaderboard user={user} />}
        {currentScreen === AppScreen.PROFILE && (
          <Profile 
            user={user} 
            onUpdate={handleProfileUpdate} 
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-app-bg/95 backdrop-blur border-t border-slate-800 flex justify-around items-center px-2 fixed bottom-0 w-full max-w-md z-50 pb-2">
        <NavButton 
          active={currentScreen === AppScreen.HOME} 
          onClick={() => setCurrentScreen(AppScreen.HOME)} 
          icon={HomeIcon} 
          label="Anasayfa" 
        />
        <NavButton 
          active={currentScreen === AppScreen.WORDS} 
          onClick={() => setCurrentScreen(AppScreen.WORDS)} 
          icon={BookOpen} 
          label="Kelimeler" 
        />
        <NavButton 
          active={currentScreen === AppScreen.LEADERBOARD} 
          onClick={() => setCurrentScreen(AppScreen.LEADERBOARD)} 
          icon={Trophy} 
          label="Sıralama" 
        />
        <NavButton 
          active={currentScreen === AppScreen.PROFILE} 
          onClick={() => setCurrentScreen(AppScreen.PROFILE)} 
          icon={User} 
          label="Profil" 
        />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 ${
      active ? 'text-app-primary bg-app-primary/10' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className="mb-1" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
