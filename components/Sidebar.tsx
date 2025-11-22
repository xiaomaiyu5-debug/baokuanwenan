import React from 'react';
import { PlatformId } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface SidebarProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (id: PlatformId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedPlatforms, onTogglePlatform }) => {
  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-black p-6">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-400 mb-6">选择平台</h2>
      <div className="space-y-3">
        {(Object.keys(PLATFORM_CONFIG) as PlatformId[]).map((platformId) => {
          const config = PLATFORM_CONFIG[platformId];
          const Icon = config.icon;
          const isSelected = selectedPlatforms.includes(platformId);

          return (
            <div 
              key={platformId}
              onClick={() => onTogglePlatform(platformId)}
              className={`
                group relative p-4 rounded-[4px] border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-white border-black shadow-float dark:bg-gray-900 dark:border-white' 
                  : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200 dark:hover:bg-gray-900 dark:hover:border-gray-700'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={1.5} className={isSelected ? 'text-black dark:text-white' : 'text-gray-400'} />
                  <span className={`font-medium ${isSelected ? 'text-black dark:text-white' : 'text-gray-500'}`}>
                    {config.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
                )}
              </div>
              {isSelected && (
                <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-snug animate-in fade-in slide-in-from-top-1 duration-200">
                  {config.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};