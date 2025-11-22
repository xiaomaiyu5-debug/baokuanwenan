
import React, { useState } from 'react';
import { PlatformId, CopyData } from '../types';
import { PLATFORM_CONFIG } from '../constants';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Sparkles } from 'lucide-react';

interface OutputSectionProps {
  results: Partial<Record<PlatformId, CopyData[]>>;
  selectedPlatforms: PlatformId[];
}

export const OutputSection: React.FC<OutputSectionProps> = ({ results, selectedPlatforms }) => {
  const [activeTab, setActiveTab] = useState<PlatformId>(selectedPlatforms[0] || PlatformId.XIAOHONGSHU);
  const [copied, setCopied] = useState<string | null>(null);

  // Ensure active tab is valid and present in results if possible
  React.useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activeTab]);

  if (selectedPlatforms.length === 0) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderCopyCard = (data: CopyData, index: number) => (
    <div key={data.id} className="flex flex-col bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-black text-white dark:bg-white dark:text-black">
             方案 {index + 1}
           </span>
           {data.analysis && (
             <div className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
               <Sparkles size={10} />
               <span>{data.analysis.predictedEngagement}</span>
             </div>
           )}
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => handleCopy(data.content, data.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {copied === data.id ? <Check size={14} /> : <Copy size={14} />}
            {copied === data.id ? '已复制' : '复制'}
          </button>
        </div>
      </div>
      <div className="p-6 text-[15px] leading-7 text-gray-800 dark:text-gray-200 flex-1">
        <ReactMarkdown components={{
          p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-4 space-y-1" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-black dark:text-white" {...props} />,
        }}>
          {data.content}
        </ReactMarkdown>
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
           {data.tags.map((tag, i) => (
             <span key={i} className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 transition-colors cursor-pointer">#{tag}</span>
           ))}
        </div>
      </div>
    </div>
  );

  const currentData = results[activeTab];

  // Determine grid columns based on number of variants
  const gridCols = currentData ? (currentData.length === 1 ? 'grid-cols-1' : currentData.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2') : 'grid-cols-1';

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Horizontal Tabs */}
       <div className="flex items-center border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
          {selectedPlatforms.map((pid) => {
            const config = PLATFORM_CONFIG[pid];
            const Icon = config.icon;
            const isActive = activeTab === pid;
            const hasResult = !!results[pid];
            
            return (
              <button
                key={pid}
                onClick={() => setActiveTab(pid)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all shrink-0
                  ${isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                <Icon size={16} className={isActive ? 'text-black dark:text-white' : 'text-gray-400'} />
                {config.label}
                {!hasResult && <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 ml-1" />}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
                )}
              </button>
            );
          })}
       </div>

       {/* Content Area */}
       {!currentData ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-dashed border-gray-200 dark:border-gray-800">
             <div className="animate-pulse flex flex-col items-center">
               <Sparkles size={24} className="mb-3 opacity-50" />
               <p className="text-sm">文案生成中，请稍候...</p>
             </div>
          </div>
       ) : (
         <div className={`grid gap-6 ${gridCols}`}>
            {currentData.map((data, index) => renderCopyCard(data, index))}
         </div>
       )}
    </section>
  );
};
