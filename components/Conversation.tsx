
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Scenario, ChatMessage, SavedWord, AnalysisResult } from '../types';
import { Mic, MicOff, XOctagon, Volume2, User, Video, VideoOff, Captions, EyeOff, Lightbulb, CheckCircle2, LogOut, Loader2 } from 'lucide-react';
import { generateConversationResponse, generateScenarioIntro, generateHint, generateConversationAnalysis } from '../services/gemini';

interface ConversationProps {
  user: UserProfile;
  scenario: Scenario;
  onFinish: (result: AnalysisResult) => void;
  onExit: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

// Mock speech recognition hook for demo purposes
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Ideally dynamic based on selected language

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = (langCode: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
    } else {
      alert("Tarayıcınız sesli girişi desteklemiyor.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, setTranscript };
};

const Conversation: React.FC<ConversationProps> = ({ user, scenario, onFinish, onExit, onUpdateUser }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([false, false, false]);
  
  // UI States
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  
  // Hint States
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Speech Logic
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  
  // Map lang IDs to SpeechRecognition codes
  const langCodes: Record<string, string> = {
    'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'it': 'it-IT', 'kr': 'ko-KR'
  };
  const langNames: Record<string, string> = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'kr': 'Korean'
  };

  const currentLangCode = langCodes[user.selectedLanguageId] || 'en-US';
  const currentLangName = langNames[user.selectedLanguageId] || 'English';

  const initChat = async () => {
    setIsProcessing(true);
    const intro = await generateScenarioIntro(
        currentLangName, 
        user.level, 
        scenario.title
    );
    const initialMsg: ChatMessage = {
        id: 'init',
        role: 'model',
        text: intro,
        translation: "Konuşmayı başlattı.",
        timestamp: Date.now()
    };
    setHistory([initialMsg]);
    speak(intro);
    setIsProcessing(false);
  };

  useEffect(() => {
    initChat();
    
    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Camera Logic
  const toggleCamera = async () => {
    if (isCameraOn) {
      // Stop Camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      // Start Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Camera error:", err);
        alert("Kamera izni verilemedi.");
      }
    }
  };

  // Hint Logic
  const handleGetHint = async () => {
    if (isHintLoading || isProcessing || hintsRemaining <= 0) return;
    
    setIsHintLoading(true);
    const result = await generateHint(history, scenario.title, currentLangName);
    
    if (result) {
      setHint(result.text);
      setHintsRemaining(prev => prev - 1);
      
      // Save to user words
      const newWord: SavedWord = {
        id: Date.now().toString(),
        term: result.text,
        translation: result.translation,
        pronunciation: result.pronunciation,
        isLearned: false
      };
      
      const updatedUser = {
        ...user,
        savedWords: [newWord, ...user.savedWords]
      };
      onUpdateUser(updatedUser);

      // Show notification
      setNotification("İpucu cümlesi kelime defterine kaydedildi!");
      setTimeout(() => setNotification(null), 3000);
    }
    
    setIsHintLoading(false);
  };

  // Finish & Analyze Logic
  const handleFinish = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    
    // Generate Report
    const result = await generateConversationAnalysis(history, scenario.title, currentLangName);
    onFinish(result);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLangCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Clear hint when user sends a message
    setHint(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsProcessing(true);
    setTranscript(''); // Clear input

    // Get AI Response
    const result = await generateConversationResponse(
      newHistory, 
      text, 
      user, 
      scenario.title, 
      user.selectedLanguageId, 
      scenario.tasks
    );

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: result.targetText,
      translation: result.turkishText,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, aiMsg]);
    speak(result.targetText);
    setIsProcessing(false);

    // Simulate task checking (naive)
    if (history.length > 2 && !completedTasks[0]) setCompletedTasks(p => [true, p[1], p[2]]);
    else if (history.length > 4 && !completedTasks[1]) setCompletedTasks(p => [true, true, p[2]]);
    else if (history.length > 6 && !completedTasks[2]) setCompletedTasks(p => [true, true, true]);

    if (result.isFinished) {
        setTimeout(() => handleFinish(), 2000);
    }
  };

  // Auto-send when speech stops
  useEffect(() => {
    if (!isListening && transcript.length > 0) {
        handleSend(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  // Clear hint when listening starts
  useEffect(() => {
    if (isListening) setHint(null);
  }, [isListening]);

  const lastModelMsg = [...history].reverse().find(m => m.role === 'model');

  // Loading Overlay for Analysis
  if (isAnalyzing) {
    return (
      <div className="h-screen bg-app-bg flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <Loader2 size={48} className="text-app-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Analiz Ediliyor...</h2>
        <p className="text-slate-400">Yapay zeka öğretmenin performansını değerlendiriyor.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-app-bg relative overflow-hidden">
      
      {/* Full Screen Background Image (Portrait Visual) */}
      {scenario.portraitVisual && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img 
            src={scenario.portraitVisual}
            alt="Scenario Avatar"
            className="w-full h-full object-cover transition-transform duration-[20000ms] ease-linear scale-100 animate-[pulse_10s_ease-in-out_infinite]"
            style={{ animation: 'breathe 20s infinite linear alternate' }} 
          />
          {/* Subtle breathing animation via style */}
          <style>{`
            @keyframes breathe {
              0% { transform: scale(1); }
              100% { transform: scale(1.1); }
            }
          `}</style>
          
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90 pointer-events-none"></div>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div className="absolute top-0 left-0 w-full z-50 animate-in slide-in-from-top duration-300">
           <div className="bg-green-500 text-white px-4 py-3 shadow-lg flex items-center justify-center">
             <CheckCircle2 size={18} className="mr-2" />
             <span className="text-sm font-bold">{notification}</span>
           </div>
        </div>
      )}

      {/* Header / Tasks Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 pointer-events-none mt-10">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 max-w-[70%]">
            <h3 className="text-xs text-slate-400 uppercase font-bold mb-2">Görevler</h3>
            <ul className="space-y-2">
              {scenario.tasks.map((task, idx) => (
                <li key={idx} className={`text-xs flex items-center transition-all duration-300 ${completedTasks[idx] ? 'text-green-400 line-through opacity-70' : 'text-white'}`}>
                  <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center ${completedTasks[idx] ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                    {completedTasks[idx] && <CheckIcon className="w-2 h-2 text-slate-900" />}
                  </div>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 pointer-events-none">
        
        {/* Only show central avatar/pulse if NO portrait visual is present */}
        {!scenario.portraitVisual && (
            <div className="relative mb-8 pointer-events-auto">
                {/* Animated Background Pulse */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-app-primary/10 blur-3xl transition-all duration-1000 ${isListening ? 'scale-150 opacity-50' : 'scale-100 opacity-20'}`}></div>
                
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center bg-slate-800 shadow-2xl transition-all duration-500 ${isProcessing ? 'border-app-accent animate-pulse' : 'border-app-primary'}`}>
                    <User size={64} className="text-slate-400" />
                </div>
                
                {isProcessing && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-app-accent text-sm font-medium animate-bounce w-full text-center bg-slate-900/50 px-3 py-1 rounded-full">Yazıyor...</div>}
            </div>
        )}

        {/* If portrait visual exists, just show a small typing indicator if processing */}
        {scenario.portraitVisual && isProcessing && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10 animate-pulse pointer-events-auto">
                <span className="text-white text-sm font-bold">Dinliyor...</span>
            </div>
        )}

        {/* Subtitles Area - Adjusted for video layout */}
        <div className={`w-full max-w-md px-6 text-center space-y-4 min-h-[120px] relative z-10 ${scenario.portraitVisual ? 'mt-auto mb-4' : ''}`}>
            {lastModelMsg ? (
                <div className={`transition-opacity duration-500 pointer-events-auto ${showSubtitles ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-black/60 backdrop-blur-md p-5 rounded-3xl border border-white/10 inline-block shadow-xl">
                        <p className="text-xl font-medium text-white leading-relaxed mb-2 drop-shadow-md">
                            "{lastModelMsg.text}"
                        </p>
                        <p className="text-slate-300 text-sm italic">
                            {lastModelMsg.translation}
                        </p>
                    </div>
                </div>
            ) : (
                !scenario.portraitVisual && <p className="text-slate-500 animate-pulse">Bağlanıyor...</p>
            )}
        </div>
      </div>

      {/* User Camera Feed (Bottom Right - PIP style) */}
      <div className={`absolute bottom-36 right-4 z-30 transition-all duration-500 pointer-events-auto ${isCameraOn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="w-32 h-44 bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl relative">
             <video 
                ref={userVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform -scale-x-100" 
             />
             <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Controls */}
      <div className={`p-6 pb-10 z-20 relative flex flex-col items-center ${scenario.portraitVisual ? 'bg-gradient-to-t from-black via-black/80 to-transparent' : 'bg-app-bg'}`}>
        
        {/* Hint Bubble Display */}
        {hint && (
            <div className="mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300 w-full max-w-xs">
                <div className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-3 rounded-2xl text-center shadow-lg backdrop-blur-md relative">
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400/20 border-r border-b border-yellow-400/40 transform rotate-45"></div>
                     <span className="font-bold text-lg drop-shadow-sm">"{hint}"</span>
                </div>
            </div>
        )}

        <div className="flex items-center justify-center gap-3 w-full max-w-sm pointer-events-auto">
            
            {/* Toggle Subtitles */}
            <button 
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`p-4 rounded-full transition-colors backdrop-blur-sm ${showSubtitles ? 'bg-slate-800/80 text-white' : 'bg-slate-800/40 text-slate-400'}`}
                title="Altyazı"
            >
                {showSubtitles ? <Captions size={20} /> : <EyeOff size={20} />}
            </button>

            {/* Hint Button */}
            <div className="relative">
              <button 
                  onClick={handleGetHint}
                  disabled={isHintLoading || hintsRemaining === 0}
                  className={`p-4 rounded-full transition-all duration-300 backdrop-blur-sm ${
                      hint 
                      ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-400/50' 
                      : hintsRemaining === 0 
                          ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed' 
                          : 'bg-slate-800/80 text-yellow-500 hover:bg-yellow-400/20'
                  } ${isHintLoading ? 'animate-pulse opacity-70' : ''}`}
                  title={hintsRemaining > 0 ? "İpucu Al" : "Hakkınız bitti"}
              >
                  <Lightbulb size={20} fill={hint ? "currentColor" : "none"} />
              </button>
              {/* Badge Counter */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-app-bg ${hintsRemaining > 0 ? 'bg-red-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
                {hintsRemaining}
              </div>
            </div>

            {/* Main Mic Button */}
            <button
                onMouseDown={() => startListening(currentLangCode)}
                onMouseUp={stopListening}
                onTouchStart={() => startListening(currentLangCode)}
                onTouchEnd={stopListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 mx-2 ${
                    isListening 
                    ? 'bg-red-500 scale-110 shadow-red-500/40' 
                    : 'bg-app-primary hover:bg-blue-600 shadow-app-primary/40'
                }`}
            >
                {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
            </button>
            
            {/* Toggle Camera */}
            <button 
               onClick={toggleCamera}
               className={`p-4 rounded-full transition-colors backdrop-blur-sm ${isCameraOn ? 'bg-white text-app-bg' : 'bg-slate-800/80 text-slate-300'}`}
               title="Kamera"
            >
                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Exit/Finish Button - Moved here */}
            <button 
                onClick={handleFinish}
                className="p-4 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-500/30 backdrop-blur-sm"
                title="Bitir ve Analiz Et"
            >
                <XOctagon size={20} />
            </button>
        </div>
        
        <p className={`text-center text-xs mt-6 font-medium ${scenario.portraitVisual ? 'text-slate-300 drop-shadow' : 'text-slate-500'}`}>
            {isListening ? 'Dinleniyor...' : 'Konuşmak için basılı tut'}
        </p>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Conversation;
