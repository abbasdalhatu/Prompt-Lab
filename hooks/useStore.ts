import { useState, useEffect, useCallback } from 'react';
import { PromptData } from '../types';

const STORAGE_KEY = 'promptlab_data_v1';

export const useStore = () => {
  const [prompts, setPrompts] = useState<PromptData[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrompts(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored prompts", e);
      }
    }
  }, []);

  // Save to local storage whenever prompts change
  useEffect(() => {
    if (prompts.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }, [prompts]);

  const addPrompt = useCallback((original: string, generated: string) => {
    const newPrompt: PromptData = {
      id: crypto.randomUUID(),
      originalInput: original,
      generatedPrompt: generated,
      timestamp: Date.now(),
      isFavorite: false,
    };
    setPrompts((prev) => {
        // Keep only last 50 to avoid unlimited growth, but ensure specific favorites are kept could be a future enhancement
        // For now simple FIFO for history, but we don't delete favorites blindly in a real app. 
        // Logic: Add to top.
        const updated = [newPrompt, ...prev];
        return updated.slice(0, 50); 
    });
    return newPrompt;
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  const setRating = useCallback((id: string, rating: number) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rating } : p))
    );
  }, []);

  const deletePrompt = useCallback((id: string) => {
      setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  return {
    prompts,
    addPrompt,
    toggleFavorite,
    setRating,
    deletePrompt
  };
};