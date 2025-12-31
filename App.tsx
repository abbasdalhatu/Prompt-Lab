import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import { AppTab } from './types';
import { useStore } from './hooks/useStore';
import { generatePerfectPrompt } from './services/geminiService';
import PromptCard from './components/PromptCard';
import { Wand2, Loader2, SearchX, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATE);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null);

  const { prompts, addPrompt, toggleFavorite, setRating, deletePrompt } = useStore();

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await generatePerfectPrompt(inputText);
      const newPrompt = addPrompt(inputText, result);
      setCurrentPromptId(newPrompt.id);
      setInputText(''); // Clear input on success
    } catch (error) {
      // Error is handled in service (toast usually or console)
      // For UX we might want to show a specific error toast here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (original: string) => {
    setIsGenerating(true);
    // Switch to Generate tab if not there
    setActiveTab(AppTab.GENERATE); 
    try {
      const result = await generatePerfectPrompt(original);
      const newPrompt = addPrompt(original, result);
      setCurrentPromptId(newPrompt.id);
    } finally {
      setIsGenerating(false);
    }
  };

  // Views
  const renderGenerate = () => {
    // If we just generated something, show it at the top
    const currentPrompt = prompts.find(p => p.id === currentPromptId);

    return (
      <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto w-full">
        
        {/* Input Area */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
            <div className="relative bg-slate-900 rounded-2xl p-4">
                <textarea
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-slate-500 text-lg resize-none min-h-[120px]"
                    placeholder="What do you need help with today? (e.g. studying physics, preparing for job interview, writing email to boss...)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !inputText.trim()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                            isGenerating || !inputText.trim() 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/25'
                        }`}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                        {isGenerating ? 'Designing...' : 'Generate Perfect Prompt'}
                    </button>
                </div>
            </div>
        </div>

        {/* Current Result */}
        {currentPrompt && (
            <div className="mt-2 animate-fade-in">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="h-px bg-white/10 flex-1"></span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Just Created</span>
                    <span className="h-px bg-white/10 flex-1"></span>
                </div>
                <PromptCard 
                    data={currentPrompt} 
                    onToggleFavorite={toggleFavorite}
                    onRate={setRating}
                    onRegenerate={handleRegenerate}
                    isExpanded={true}
                />
            </div>
        )}

        {/* Empty State / Intro */}
        {!currentPrompt && prompts.length === 0 && (
            <div className="text-center mt-10 text-slate-500">
                <p>No prompts yet. Start by describing your task above!</p>
            </div>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    const favorites = prompts.filter(p => p.isFavorite);
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-white">Your Favorites</h2>
            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-slate-500 gap-4">
                    <Heart size={48} strokeWidth={1} />
                    <p>No favorites yet. Tap the heart on a prompt to save it!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map(p => (
                        <div key={p.id} className="h-full">
                            <PromptCard 
                                data={p} 
                                onToggleFavorite={toggleFavorite}
                                onRate={setRating}
                                onRegenerate={handleRegenerate}
                                isExpanded={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const renderHistory = () => {
      // Filter out the "current" one from view if we want, but let's just show all
      // Limit to 20 for history tab as requested
      const history = prompts.slice(0, 20);

      return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-white">History <span className="text-sm font-normal text-slate-500">(Last 20)</span></h2>
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-slate-500 gap-4">
                    <SearchX size={48} strokeWidth={1} />
                    <p>No generation history yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.map(p => (
                        <div key={p.id} className="h-full">
                            <PromptCard 
                                data={p} 
                                onToggleFavorite={toggleFavorite}
                                onRate={setRating}
                                onRegenerate={handleRegenerate}
                                isExpanded={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
      );
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <Toaster position="top-center" />
      {activeTab === AppTab.GENERATE && renderGenerate()}
      {activeTab === AppTab.FAVORITES && renderFavorites()}
      {activeTab === AppTab.HISTORY && renderHistory()}
    </Layout>
  );
};

export default App;