import React from 'react';
import { motion } from 'framer-motion';
import { MoodConfig } from '../types';

interface MoodCardProps {
  mood: MoodConfig;
  onSelect: (moodId: string) => void;
  isSelected?: boolean;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, onSelect, isSelected = false }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 
        ${isSelected ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''}
        bg-gradient-to-br ${mood.gradient}
      `}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(mood.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid={`mood-card-${mood.id}`}
    >
      <div className="p-3 sm:p-4 h-24 sm:h-28 flex flex-col justify-between text-white">
        <div className="text-xl sm:text-2xl mb-1">{mood.icon}</div>
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-1">{mood.label}</h3>
          <p className="text-xs opacity-90 leading-tight">{mood.description}</p>
        </div>
      </div>
      
      {/* Overlay effect */}
      <motion.div
        className="absolute inset-0 bg-white bg-opacity-20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};
