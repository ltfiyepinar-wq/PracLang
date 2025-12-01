
import React, { useMemo } from 'react';
import { UserProfile, LeaderboardEntry } from '../types';
import { Crown, MoreVertical } from 'lucide-react';

interface LeaderboardProps {
  user: UserProfile;
}

const TURKISH_NAMES = [
  "Ahmet", "mehmet", "AYŞE", "Fatma", "mustafa", "Zeynep", "emre", "CAN", "Burak", "elif",
  "CEM", "Deniz", "Ece", "Gökhan", "hakan", "İrem", "Kaan", "Lale", "MURAT", "Nazlı",
  "Oğuz", "Pınar", "Rıza", "selin", "Tolga", "Ufuk", "Volkan", "Yasin", "ZEHRA", "Arda",
  "baran", "Ceren", "Derya", "eren", "Funda", "Gamze", "HALİL", "Işıl", "Jale", "Kerem",
  "Leyla", "Mert", "Nihan", "Orhan", "Ömer", "Pelin", "Seda", "Tuna", "Umut", "Yeliz",
  "alper", "Berna", "Ceyda", "Doğukan", "esra", "Ferhat", "Gizem", "Hamza", "ilknur", "Kader",
  "Levent", "Merve", "Nuri", "Osman", "Özlem", "Polat", "Serkan", "Taner", "Uğur", "Veli",
  "Yakup", "Ziya", "Aylin", "Bora", "Cenk", "Duygu", "Esin", "Fatih", "Gül", "Hasan",
  "İsmail", "Kemal", "Leman", "Mine", "Nihat", "Okan", "Özgür", "Perihan", "Salih", "Tarık",
  "Ümit", "Yavuz", "Zafer", "Aslı", "Berkay", "Çağla", "Doruk", "Ezgi", "Fikret"
];

// Helper to randomize casing (e.g., "Ahmet" -> "ahmet" or "AHMET")
const randomizeCase = (name: string) => {
  const rand = Math.random();
  if (rand < 0.33) return name.toLowerCase();
  if (rand < 0.66) return name.toUpperCase();
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const getRandomName = () => randomizeCase(TURKISH_NAMES[Math.floor(Math.random() * TURKISH_NAMES.length)]);

const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  
  const { displayList, topThree, currentUserEntry } = useMemo(() => {
    
    // 1. Generate Top 22 Users (High XP)
    const topBots: LeaderboardEntry[] = Array.from({ length: 22 }).map((_, i) => ({
        rank: i + 1,
        name: getRandomName(),
        xp: 5000 - (i * 150) + Math.floor(Math.random() * 100), // Decreasing XP
        isCurrentUser: false,
        avatarSeed: `top-${i}`
    }));

    // 2. Current User (Dynamic Rank based on XP)
    // Every 50 XP gained improves rank by 1 spot
    const dynamicRank = Math.max(23, 153 - Math.floor(user.xp / 50));

    const userEntry: LeaderboardEntry = {
        rank: dynamicRank,
        name: user.name,
        xp: user.xp,
        isCurrentUser: true,
        avatarSeed: user.name
    };

    // 3. Bottom 23 Users (Ranked after user)
    const bottomBots: LeaderboardEntry[] = Array.from({ length: 23 }).map((_, i) => ({
        rank: dynamicRank + 1 + i,
        name: getRandomName(),
        xp: Math.max(0, user.xp - ((i + 1) * 20) - Math.floor(Math.random() * 10)), // XP slightly lower than user
        isCurrentUser: false,
        avatarSeed: `bottom-${i}`
    }));

    // Combine for display: Top 22 -> Gap -> User -> Bottom 23
    const fullList = [...topBots, userEntry, ...bottomBots];

    return {
        displayList: fullList,
        topThree: topBots.slice(0, 3),
        currentUserEntry: userEntry
    };
  }, [user.xp, user.name]);

  // Remove top 3 from the main scrolling list to avoid duplication in UI
  const scrollList = displayList.slice(3);

  return (
    <div className="min-h-screen bg-app-bg text-app-text pb-32 animate-in fade-in">
      
      {/* Header */}
      <div className="p-6 pt-8 bg-slate-900/90 backdrop-blur sticky top-0 z-20 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Crown className="mr-2 text-yellow-400" fill="currentColor" />
            Lider Tablosu
          </h1>
          <div className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Bu Hafta
          </div>
        </div>
      </div>

      <div className="p-6">
        
        {/* Top 3 Podium */}
        <div className="flex justify-center items-end mb-10 gap-4 mt-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center w-1/3">
                <div className="w-16 h-16 rounded-full border-4 border-slate-300 overflow-hidden mb-2 relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].avatarSeed}`} alt="2nd" />
                    <div className="absolute bottom-0 w-full bg-slate-300 text-slate-900 text-[10px] font-bold text-center">2</div>
                </div>
                <div className="text-center">
                    <p className="font-bold text-slate-300 text-sm truncate w-full">{topThree[1].name}</p>
                    <p className="text-xs text-slate-500 font-mono">{topThree[1].xp} XP</p>
                </div>
                <div className="w-full h-16 bg-gradient-to-t from-slate-700 to-slate-800 rounded-t-lg mt-2 flex items-end justify-center pb-2 opacity-80">
                    <span className="text-2xl font-bold text-slate-500">2</span>
                </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center w-1/3 z-10 -mb-2">
                <Crown className="text-yellow-400 mb-1 w-8 h-8 animate-bounce" fill="currentColor" />
                <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 relative shadow-lg shadow-yellow-400/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].avatarSeed}`} alt="1st" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-yellow-400 text-sm truncate w-full">{topThree[0].name}</p>
                    <p className="text-xs text-slate-500 font-mono">{topThree[0].xp} XP</p>
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-yellow-600/20 to-yellow-500/10 border-t border-yellow-500/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                    <span className="text-4xl font-bold text-yellow-500">1</span>
                </div>
            </div>

             {/* 3rd Place */}
             <div className="flex flex-col items-center w-1/3">
                <div className="w-16 h-16 rounded-full border-4 border-amber-600 overflow-hidden mb-2 relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].avatarSeed}`} alt="3rd" />
                    <div className="absolute bottom-0 w-full bg-amber-600 text-white text-[10px] font-bold text-center">3</div>
                </div>
                <div className="text-center">
                    <p className="font-bold text-amber-600 text-sm truncate w-full">{topThree[2].name}</p>
                    <p className="text-xs text-slate-500 font-mono">{topThree[2].xp} XP</p>
                </div>
                <div className="w-full h-12 bg-gradient-to-t from-amber-900/40 to-amber-800/40 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                    <span className="text-2xl font-bold text-amber-700">3</span>
                </div>
            </div>
        </div>

        {/* The List */}
        <div className="space-y-3">
            {scrollList.map((entry, index) => {
                // Check if there is a jump in ranks to render a separator
                const previousRank = index > 0 ? scrollList[index - 1].rank : 3;
                const showSeparator = entry.rank - previousRank > 1;

                return (
                    <React.Fragment key={entry.rank}>
                        {showSeparator && (
                            <div className="flex justify-center py-2 opacity-50">
                                <MoreVertical className="text-slate-600" />
                            </div>
                        )}
                        <div 
                            className={`flex items-center p-3 rounded-xl border ${
                                entry.isCurrentUser 
                                ? 'bg-app-primary/10 border-app-primary shadow-lg shadow-app-primary/10' 
                                : 'bg-app-card border-slate-800'
                            }`}
                        >
                            <span className={`w-8 font-bold text-center ${entry.isCurrentUser ? 'text-app-primary' : 'text-slate-500'}`}>
                                {entry.rank}
                            </span>
                            <div className="w-10 h-10 rounded-full overflow-hidden mx-3 bg-slate-800">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.avatarSeed}`} alt="avatar" />
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold text-sm ${entry.isCurrentUser ? 'text-white' : 'text-slate-300'}`}>
                                    {entry.name} {entry.isCurrentUser && '(Sen)'}
                                </p>
                            </div>
                            <div className="font-mono text-sm text-app-accent font-medium">
                                {entry.xp} XP
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
      </div>

      {/* Sticky User Stats */}
      {currentUserEntry && (
        <div className="fixed bottom-20 left-0 w-full px-6 z-10 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md border border-app-primary/50 p-3 rounded-2xl flex items-center shadow-2xl pointer-events-auto transform transition-transform hover:scale-105">
                <span className="w-8 font-bold text-center text-app-primary text-lg">
                    {currentUserEntry.rank}
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden mx-3 border-2 border-app-primary">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserEntry.avatarSeed}`} alt="avatar" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-white text-sm">Sıralaman</p>
                </div>
                <div className="font-mono text-lg text-white font-bold">
                    {currentUserEntry.xp} XP
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
