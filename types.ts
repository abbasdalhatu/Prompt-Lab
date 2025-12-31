import React from 'react';

export interface PromptData {
  id: string;
  originalInput: string;
  generatedPrompt: string;
  timestamp: number;
  isFavorite: boolean;
  rating?: number; // 1-5
}

export enum AppTab {
  GENERATE = 'generate',
  FAVORITES = 'favorites',
  HISTORY = 'history'
}

export interface NavigationItem {
  id: AppTab;
  label: string;
  icon: React.FC<any>;
}