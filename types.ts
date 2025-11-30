
export interface Language {
  id: string;
  name: string;
  flag: string; // Emoji fallback
  flagImage: string; // Gerçek görsel URL
  isFree: boolean;
}

export interface SavedWord {
  id: string;
  term: string;        // Kelime (örn: Squirrel)
  translation: string; // Anlamı (örn: Sincap)
  pronunciation: string; // Türkçe okunuşu (örn: Sku-ir-rel)
  isLearned: boolean;
}

export interface AvatarConfig {
  hairColor: string;
  skinColor: string;
  mouth: string;
}

export interface UserProfile {
  name: string;
  surname: string;
  email: string;
  selectedLanguageId: string;
  unlockedLanguages: string[]; // IDs of languages the user owns
  xp: number;
  streak: number;
  level: 'A1-A2' | 'B1' | 'B2-C1';
  savedWords: SavedWord[];
  avatarConfig?: AvatarConfig;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'travel' | 'work' | 'social';
  tasks: string[];
  image: string;
  portraitVisual?: string; // Full screen vertical image for conversation background
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  translation?: string;
  timestamp: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
  avatarSeed: string;
}

export interface Correction {
  original: string;
  correction: string;
  reason: string;
}

export interface AnalysisResult {
  score: number;
  feedback: string;
  corrections: Correction[];
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  SCENARIO_DETAIL = 'SCENARIO_DETAIL',
  CONVERSATION = 'CONVERSATION',
  RESULT = 'RESULT',
  WORDS = 'WORDS',
  LEADERBOARD = 'LEADERBOARD',
  PROFILE = 'PROFILE'
}
