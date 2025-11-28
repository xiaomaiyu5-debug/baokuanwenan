
import React from 'react';
import { PlatformId } from '../types';
import { PLATFORM_CONFIG } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (id: PlatformId) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatforms, onTogglePlatform }) => {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand rounded-full"></span>
        分发平台
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(PLATFORM_CONFIG) as PlatformId[]).map((platformId) => {
          const config = PLATFORM_CONFIG[platformId];
          const Icon = config.icon;
          const isSelected = selectedPlatforms.includes(platformId);

          return (
            <button
              key={platformId}
              onClick={() => onTogglePlatform(platformId)}
              className={`
                relative flex items-center gap-3 p-4 rounded-md border text-left transition-all duration-200 group outline-none focus:ring-2 focus:ring-brand dark:focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-black
                ${isSelected
                  ? 'bg-brand/5 border-brand dark:bg-brand/10 dark:border-brand'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm dark:bg-black dark:border-gray-800 dark:hover:border-gray-700'}
              `}
            >
              <div className={`p-2 rounded-full ${isSelected ? 'bg-brand text-white' : 'bg-gray-50 dark:bg-gray-900'}`}>
                <Icon size={20} strokeWidth={1.5} className={isSelected ? 'text-white' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <span className={`block text-sm font-medium ${isSelected ? 'text-brand dark:text-brand' : 'text-gray-600 dark:text-gray-300'}`}>
                  {config.label}
                </span>
                <span className={`text-[10px] mt-0.5 block truncate max-w-[100px] ${isSelected ? 'text-gray-500' : 'text-gray-400 dark:text-gray-600'}`}>
                  {config.label === '视频号' ? '短小精悍' :
                    config.label === '小红书' ? '情绪种草' :
                      config.label === '抖音' ? '黄金3秒' : '深度长文'}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 text-black dark:text-white">
                  <CheckCircle2 size={14} fill="currentColor" className="text-brand dark:text-brand bg-white dark:bg-black rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
