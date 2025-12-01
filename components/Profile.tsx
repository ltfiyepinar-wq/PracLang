
import React, { useState } from 'react';
import { UserProfile, Language, AvatarConfig } from '../types';
import { Edit2, Save, User, Mail, Zap, Trophy, Star, Lock, Check, LogOut, X, CreditCard, RefreshCw } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

const LANGUAGES: Language[] = [
    { id: 'en', name: 'İngilizce', flag: '🇬🇧', flagImage: 'https://flagcdn.com/w160/gb.png', isFree: true },
    { id: 'es', name: 'İspanyolca', flag: '🇪🇸', flagImage: 'https://flagcdn.com/w160/es.png', isFree: true },
    { id: 'fr', name: 'Fransızca', flag: '🇫🇷', flagImage: 'https://flagcdn.com/w160/fr.png', isFree: true },
    { id: 'de', name: 'Almanca', flag: '🇩🇪', flagImage: 'https://flagcdn.com/w160/de.png', isFree: true },
    { id: 'it', name: 'İtalyanca', flag: '🇮🇹', flagImage: 'https://flagcdn.com/w160/it.png', isFree: true },
    { id: 'kr', name: 'Korece', flag: '🇰🇷', flagImage: 'https://flagcdn.com/w160/kr.png', isFree: true },
];

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    email: user.email,
  });

  // Avatar Customization States
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(user.avatarConfig || {
      hairColor: 'black',
      skinColor: 'light',
      mouth: 'smile'
  });

  const [purchaseModalLang, setPurchaseModalLang] = useState<Language | null>(null);

  const handleSave = () => {
    onUpdate({
      ...user,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      avatarConfig: avatarConfig
    });
    setIsEditing(false);
  };

  const handleLanguageClick = (lang: Language) => {
    if (lang.id === user.selectedLanguageId) return;

    // Check if user owns the language
    const isUnlocked = user.unlockedLanguages?.includes(lang.id);

    if (isUnlocked) {
        // Switch immediately
        onUpdate({
            ...user,
            selectedLanguageId: lang.id
        });
    } else {
        // Open Purchase Modal
        setPurchaseModalLang(lang);
    }
  };

  const confirmPurchase = () => {
    if (!purchaseModalLang) return;
    
    // Simulate Purchase: Add to unlocked list and select it
    onUpdate({
        ...user,
        unlockedLanguages: [...(user.unlockedLanguages || []), purchaseModalLang.id],
        selectedLanguageId: purchaseModalLang.id
    });
    setPurchaseModalLang(null);
  };

  // Generate Avatar URL
  const getAvatarUrl = () => {
    // Dicebear Avataaars API options
    const hairColorMap: any = { 'black': '2c1b18', 'blonde': 'e6ce8a', 'brown': '4a312c', 'red': 'b55d32', 'platinum': 'ecf0f1' };
    const skinColorMap: any = { 'light': 'f8d25c', 'pale': 'ffdbb4', 'brown': 'd08b5b', 'dark': 'ae5d29' };
    const mouthMap: any = { 'smile': 'smile', 'serious': 'serious', 'surprised': 'screamOpen' };

    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&hairColor=${hairColorMap[avatarConfig.hairColor]}&skinColor=${skinColorMap[avatarConfig.skinColor]}&mouth=${mouthMap[avatarConfig.mouth]}`;
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text pb-24 animate-in fade-in relative">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-slate-800 sticky top-0 bg-app-bg/95 backdrop-blur z-20">
        <h1 className="text-xl font-bold text-white">Profil</h1>
        <button 
            onClick={onLogout}
            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
        >
            <LogOut size={18} />
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Avatar & Main Info */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-app-primary to-app-accent shadow-2xl shadow-app-primary/20">
                <img 
                src={getAvatarUrl()} 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-app-bg border-4 border-app-bg"
                />
            </div>
            {isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-app-primary rounded-full p-2 text-white shadow-lg">
                    <Edit2 size={12} />
                </div>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">{formData.name} {formData.surname}</h2>
          <p className="text-slate-400 text-sm">{user.level} Öğrencisi</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center mb-2 text-yellow-400">
                    <Zap size={16} fill="currentColor" />
                </div>
                <span className="text-lg font-bold text-white">{user.streak}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Gün Seri</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-app-primary/10 flex items-center justify-center mb-2 text-app-primary">
                    <Star size={16} fill="currentColor" />
                </div>
                <span className="text-lg font-bold text-white">{user.xp}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Toplam XP</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-green-400/10 flex items-center justify-center mb-2 text-green-400">
                    <Trophy size={16} fill="currentColor" />
                </div>
                <span className="text-lg font-bold text-white">{user.level}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Seviye</span>
            </div>
        </div>

        {/* User Details & Avatar Editor Form */}
        <div className="bg-app-card rounded-3xl p-5 border border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Kişisel Bilgiler</h3>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isEditing 
                        ? 'bg-app-primary text-white hover:bg-blue-600' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    {isEditing ? <><Save size={14} className="mr-1"/> Kaydet</> : <><Edit2 size={14} className="mr-1"/> Düzenle</>}
                </button>
            </div>
            
            <div className="space-y-4">
                {isEditing && (
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-4 animate-in fade-in">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Avatarını Özelleştir</h4>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-slate-400 block mb-1">SAÇ RENGİ</label>
                                <div className="flex gap-2">
                                    {['black', 'blonde', 'brown', 'red', 'platinum'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setAvatarConfig({...avatarConfig, hairColor: c})}
                                            className={`w-6 h-6 rounded-full border-2 ${avatarConfig.hairColor === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                                            style={{ backgroundColor: c === 'platinum' ? '#ecf0f1' : c === 'blonde' ? '#f1c40f' : c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 block mb-1">TEN RENGİ</label>
                                <div className="flex gap-2">
                                    {['light', 'pale', 'brown', 'dark'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setAvatarConfig({...avatarConfig, skinColor: c})}
                                            className={`w-6 h-6 rounded-full border-2 ${avatarConfig.skinColor === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                                            style={{ backgroundColor: c === 'light' ? '#f8d25c' : c === 'pale' ? '#ffdbb4' : c === 'brown' ? '#d08b5b' : '#ae5d29' }}
                                        />
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-[10px] text-slate-400 block mb-1">MİMİK</label>
                                <div className="flex gap-2 text-xs">
                                    {[
                                        {id: 'smile', label: '😊'}, 
                                        {id: 'serious', label: '😐'}, 
                                        {id: 'surprised', label: '😮'}
                                    ].map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setAvatarConfig({...avatarConfig, mouth: m.id})}
                                            className={`px-2 py-1 rounded bg-slate-800 border ${avatarConfig.mouth === m.id ? 'border-app-primary text-white' : 'border-transparent text-slate-500'}`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <User size={16} />
                    </div>
                    <input 
                        type="text" 
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full bg-slate-900/50 border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-all ${
                            isEditing ? 'border-app-primary focus:ring-1 focus:ring-app-primary' : 'border-slate-700 text-slate-400'
                        }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">AD</span>
                </div>

                <div className="relative">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <User size={16} />
                    </div>
                    <input 
                        type="text" 
                        value={formData.surname}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, surname: e.target.value})}
                        className={`w-full bg-slate-900/50 border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-all ${
                            isEditing ? 'border-app-primary focus:ring-1 focus:ring-app-primary' : 'border-slate-700 text-slate-400'
                        }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">SOYAD</span>
                </div>

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Mail size={16} />
                    </div>
                    <input 
                        type="email" 
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full bg-slate-900/50 border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-all ${
                            isEditing ? 'border-app-primary focus:ring-1 focus:ring-app-primary' : 'border-slate-700 text-slate-400'
                        }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">E-POSTA</span>
                </div>
            </div>
        </div>

        {/* Languages Section */}
        <div>
          <div className="flex justify-between items-end mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dillerim</h3>
          </div>
          <div className="space-y-3">
            {LANGUAGES.map((lang) => {
              const isActive = lang.id === user.selectedLanguageId;
              const isUnlocked = user.unlockedLanguages?.includes(lang.id);
              
              return (
                <div 
                  key={lang.id} 
                  onClick={() => handleLanguageClick(lang)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-95 ${
                      isActive 
                        ? 'bg-app-primary/10 border-app-primary shadow-lg shadow-app-primary/10 ring-1 ring-app-primary/50' 
                        : isUnlocked 
                            ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                            : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border shadow-sm shrink-0 ${isActive ? 'border-app-primary' : 'border-slate-600'}`}>
                         <img src={lang.flagImage} alt={lang.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{lang.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          {isActive ? <span className="text-app-primary">Şu an Aktif</span> : isUnlocked ? 'Değiştir' : 'Premium'}
                      </p>
                    </div>
                  </div>
                  
                  {isActive ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  ) : isUnlocked ? (
                    <button className="p-2 rounded-full bg-slate-700 hover:bg-app-primary hover:text-white transition-colors">
                        <RefreshCw size={16} className="text-slate-400 hover:text-white" />
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center hover:bg-slate-700 transition-colors">
                      <Lock className="w-3 h-3 mr-2" /> 59 TL
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Purchase Modal */}
      {purchaseModalLang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-app-card border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-app-primary to-app-accent"></div>
                
                <button onClick={() => setPurchaseModalLang(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>

                <div className="text-center mb-6 pt-4">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-app-primary shadow-lg shadow-app-primary/30 mb-4">
                        <img src={purchaseModalLang.flagImage} alt={purchaseModalLang.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{purchaseModalLang.name} Öğren</h3>
                    <p className="text-slate-400 text-sm">
                        Mevcut planın sadece 1 dili kapsıyor. Bu dili eklemek için Premium'a geç.
                    </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-800">
                    <ul className="space-y-3">
                        <li className="flex items-center text-sm text-slate-300">
                            <Check size={16} className="text-green-400 mr-3" /> Sınırsız {purchaseModalLang.name} senaryosu
                        </li>
                        <li className="flex items-center text-sm text-slate-300">
                            <Check size={16} className="text-green-400 mr-3" /> Tüm seviyelere erişim
                        </li>
                        <li className="flex items-center text-sm text-slate-300">
                            <Check size={16} className="text-green-400 mr-3" /> Kişisel yapay zeka analizi
                        </li>
                    </ul>
                </div>

                <button 
                    onClick={confirmPurchase}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-app-primary to-app-accent shadow-lg shadow-app-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center"
                >
                    <CreditCard size={20} className="mr-2" />
                    Satın Al ve Başla (59 TL)
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
