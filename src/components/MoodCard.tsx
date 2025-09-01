import React from 'react';
import { IonCard, IonCardContent, IonText, IonRippleEffect } from '@ionic/react';
import { MoodConfig } from '../types';

interface MoodCardProps {
  mood: MoodConfig;
  onSelect: (moodId: string) => void;
  isSelected?: boolean;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, onSelect, isSelected = false }) => {
  return (
    <IonCard
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 
        ${isSelected ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
      `}
      style={{
        background: `linear-gradient(135deg, ${mood.gradient.replace('from-', '').replace('to-', '').split(' ').map(c => {
          const colorMap: Record<string, string> = {
            'yellow-300': '#FDE047',
            'orange-400': '#FB923C',
            'blue-300': '#93C5FD',
            'indigo-400': '#818CF8',
            'red-300': '#FCA5A5',
            'pink-400': '#F472B6',
            'green-300': '#86EFAC',
            'teal-400': '#2DD4BF',
            'orange-300': '#FDBA74',
            'emerald-300': '#6EE7B7',
            'cyan-400': '#22D3EE',
            'violet-300': '#C4B5FD',
            'purple-300': '#D8B4FE',
            'purple-400': '#C084FC'
          };
          return colorMap[c] || c;
        }).join(', ')})`,
        minHeight: '100px'
      }}
      button
      onClick={() => onSelect(mood.id)}
      data-testid={`mood-card-${mood.id}`}
    >
      <IonRippleEffect />
      <IonCardContent className="text-center text-white p-3 h-full flex flex-col justify-between">
        <div className="text-2xl mb-2">{mood.icon}</div>
        <div>
          <IonText>
            <h3 className="font-bold text-base mb-1">{mood.label}</h3>
            <p className="text-xs opacity-90 leading-tight">{mood.description}</p>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
};
