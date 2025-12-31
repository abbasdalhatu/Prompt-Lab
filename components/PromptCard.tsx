import React, { useState } from 'react';
import { Copy, Heart, Share2, RefreshCw, Star, ExternalLink, Zap } from 'lucide-react';
import { PromptData } from '../types';
import toast, { Toaster } from 'react-hot-toast';

interface PromptCardProps {
  data: PromptData;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  onRegenerate?: (original: string) => void;
  isExpanded?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  data, 
  onToggleFavorite, 
  onRate, 
  onRegenerate,
  isExpanded = true 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.generatedPrompt);
    setCopied(true);
    toast.success('Prompt copied!', {
      style: {
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Perfect Prompt by PromptLab',
          text: data.generatedPrompt,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy();
    }
  };

  const openChatGPT = () => {
    // Copy first for reliability
    navigator.clipboard.writeText(data.generatedPrompt);
    toast('Copied! Opening ChatGPT...', { icon: '🤖' });
    
    const encoded = encodeURIComponent(data.generatedPrompt);
    // Use query param which works in some ChatGPT contexts, fallback is clipboard
    setTimeout(() => {
        window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
    }, 500);
  };
  
  const openGrok = () => {
    const text = encodeURIComponent(data.generatedPrompt);
    // Direct link to Grok on X
    window.open(`https://x.com/i/grok?text=${text}`, '_blank');
  };

  return (
    <div className="bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-4 shadow-xl transition-all duration-300 hover:border-white/20">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/80">
          {data.originalInput.length > 30 ? data.originalInput.substring(0, 30) + '...' : data.originalInput}
        </h3>
        <span className="text-xs text-slate-400">
          {new Date(data.timestamp).toLocaleDateString()}
        </span>
      </div>

      <div className={`relative bg-black/30 rounded-lg p-4 mb-4 ${isExpanded ? '' : 'max-h-32 overflow-hidden'}`}>
        <p className="text-sm md:text-base leading-relaxed text-gray-200 whitespace-pre-wrap font-light">
            {data.generatedPrompt}
        </p>
        {!isExpanded && (
           <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          {copied ? <span className="text-green-300">Copied!</span> : <><Copy size={16} /> Tap to copy</>}
        </button>
        
        <div className="flex gap-2">
            <button 
            onClick={openChatGPT}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
            title="Use in ChatGPT"
            >
            <Zap size={14} /> GPT
            </button>
            <button 
            onClick={openGrok}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-colors"
            title="Use in Grok"
            >
            <span className="font-bold text-xs">X</span> Grok
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(data.id, star)}
              className={`p-1 rounded-full transition-transform hover:scale-110 ${
                (data.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-600'
              }`}
            >
              <Star size={16} fill={(data.rating || 0) >= star ? "currentColor" : "none"} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
            {onRegenerate && (
                <button 
                    onClick={() => onRegenerate(data.originalInput)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Regenerate"
                >
                    <RefreshCw size={18} />
                </button>
            )}
            <button 
                onClick={handleShare}
                className="text-slate-400 hover:text-white transition-colors"
                title="Share"
            >
                <Share2 size={18} />
            </button>
            <button 
                onClick={() => onToggleFavorite(data.id)}
                className={`transition-colors ${data.isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                title="Favorite"
            >
                <Heart size={18} fill={data.isFavorite ? "currentColor" : "none"} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;