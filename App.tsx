
import React, { useState, useEffect } from 'react';
import { PlatformSelector } from './components/PlatformSelector';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { Button } from './components/Button';
import { PlatformId, ToneStyle, AppState, DEFAULT_SETTINGS, DEFAULT_MODEL_CONFIG, CopyData, ModelConfig, ModelProvider } from './types';
import { generateCopy } from './services/geminiService';
import { Moon, Sun, Sparkles, ArrowDown, Command, Layers, Settings, X, Key, Link, Box, Type, Server } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    selectedPlatforms: [PlatformId.XIAOHONGSHU],
    keywords: '',
    selectedStyle: ToneStyle.PREMIUM,
    settings: DEFAULT_SETTINGS,
    generatedCopies: {},
    isGenerating: false,
    images: [],
    variantCount: 1,
    modelConfig: DEFAULT_MODEL_CONFIG,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempConfig, setTempConfig] = useState<ModelConfig>(DEFAULT_MODEL_CONFIG);

  const togglePlatform = (id: PlatformId) => {
    setState(prev => {
      const exists = prev.selectedPlatforms.includes(id);
      if (exists) return { ...prev, selectedPlatforms: prev.selectedPlatforms.filter(p => p !== id) };
      return { ...prev, selectedPlatforms: [...prev.selectedPlatforms, id] };
    });
  };

  const handleGenerate = async () => {
    if (!state.modelConfig.apiKey || state.modelConfig.apiKey.trim() === '') {
      alert("请先点击右上角配置模型 API Key 才能生成内容。");
      setShowConfigModal(true);
      return;
    }

    if (!state.keywords.trim() && state.images.length === 0) return;
    
    setState(prev => ({ ...prev, isGenerating: true, generatedCopies: {} }));
    
    try {
      const result = await generateCopy(
        state.selectedPlatforms,
        state.keywords,
        state.selectedStyle,
        state.settings,
        state.images,
        state.variantCount,
        state.modelConfig
      );

      if (result && result.results) {
        const newCopies: Partial<Record<PlatformId, CopyData[]>> = {};
        
        result.results.forEach((res: any) => {
          const pid = res.platformId as PlatformId;
          newCopies[pid] = res.versions.map((version: any, index: number) => ({
            id: `${pid}-${index}-${Date.now()}`,
            platformId: pid,
            content: version.content,
            tags: version.tags,
            analysis: { predictedEngagement: version.engagementScore }
          }));
        });
        
        setState(prev => ({ ...prev, generatedCopies: newCopies, isGenerating: false }));
      } else {
         setState(prev => ({ ...prev, isGenerating: false }));
         alert('生成格式异常，请重试。');
      }
    } catch (error: any) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
      alert(error.message || '生成失败，请检查配置或网络。');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setIsDarkMode(true);
       document.documentElement.classList.add('dark');
     }
  }, []);

  useEffect(() => {
    if (!state.modelConfig.apiKey) {
      setShowConfigModal(true);
    }
  }, [state.modelConfig.apiKey]);

  const openConfig = () => {
    setTempConfig(state.modelConfig);
    setShowConfigModal(true);
  };

  const saveConfig = () => {
    setState(prev => ({ ...prev, modelConfig: tempConfig }));
    setShowConfigModal(false);
  };

  const hasResults = Object.keys(state.generatedCopies).length > 0;
  const isConfigured = !!state.modelConfig.apiKey;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <header className="h-16 border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-[6px] flex items-center justify-center shadow-lg shadow-black/20">
              <Command size={18} className="text-white dark:text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">爆款文生成器</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 mr-2 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-full">
               <span className={`w-2 h-2 rounded-full ${state.isGenerating ? 'bg-yellow-400 animate-pulse' : isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
               {state.isGenerating ? 'AI 思考中...' : isConfigured ? '系统就绪' : '未配置模型'}
             </div>
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button 
              variant="secondary" 
              className={`h-9 text-xs relative ${!isConfigured ? 'border-red-400 text-red-500 animate-pulse' : ''}`}
              onClick={openConfig}
            >
              {!isConfigured && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>}
              <Settings size={14} />
              {state.modelConfig.modelName || '模型配置'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <PlatformSelector 
          selectedPlatforms={state.selectedPlatforms} 
          onTogglePlatform={togglePlatform} 
        />
        <InputSection 
          keywords={state.keywords}
          setKeywords={(val) => setState(prev => ({ ...prev, keywords: val }))}
          images={state.images}
          setImages={(val) => setState(prev => ({ ...prev, images: val }))}
          style={state.selectedStyle}
          setStyle={(val) => setState(prev => ({ ...prev, selectedStyle: val }))}
          settings={state.settings}
          setSettings={(val) => setState(prev => ({ ...prev, settings: val }))}
        />

        <div className="flex items-center justify-between mb-12 p-1">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-md border border-gray-200 dark:border-gray-800">
                <Layers size={14} className="text-gray-500 ml-2" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2">生成数量:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setState(prev => ({ ...prev, variantCount: num }))}
                      className={`
                        w-6 h-6 text-xs font-medium rounded-[4px] transition-all
                        ${state.variantCount === num 
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
           </div>

           <Button 
            onClick={handleGenerate} 
            disabled={state.isGenerating || (!state.keywords && state.images.length === 0)} 
            isLoading={state.isGenerating}
            className="w-48 h-12 text-base shadow-xl shadow-black/10 dark:shadow-white/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            <Sparkles size={18} />
            开始生成
          </Button>
        </div>

        {(hasResults || state.isGenerating) && (
           <OutputSection 
             results={state.generatedCopies} 
             selectedPlatforms={state.selectedPlatforms}
           />
        )}
        
        {!hasResults && !state.isGenerating && (
          <div className="text-center py-20 opacity-30">
             <ArrowDown size={32} className="mx-auto mb-4 animate-bounce" />
             <p className="text-sm font-medium">填写内容并选择平台后开始生成</p>
          </div>
        )}
      </main>

      {/* Model Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">模型配置</h3>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Server size={12} /> 模型服务商
                </label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => setTempConfig({...tempConfig, provider: 'gemini', modelId: 'gemini-2.5-flash', baseUrl: ''})}
                     className={`px-3 py-2 rounded-md text-sm font-medium border transition-all ${
                       tempConfig.provider === 'gemini' 
                       ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                       : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:border-gray-800'
                     }`}
                   >
                     Google Gemini
                   </button>
                   <button 
                     onClick={() => setTempConfig({...tempConfig, provider: 'volcano', modelId: '', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3'})}
                     className={`px-3 py-2 rounded-md text-sm font-medium border transition-all ${
                       tempConfig.provider === 'volcano' 
                       ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                       : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:border-gray-800'
                     }`}
                   >
                     火山引擎 (Doubao)
                   </button>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 mb-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <Key size={12} />
                  {tempConfig.provider === 'gemini' ? '需要 Gemini API Key (AI Studio)。' : '需要火山引擎 API Key 及接入点 ID。'}
                </p>
              </div>

              {/* Model Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Type size={12} /> 模型别名
                </label>
                <input 
                  type="text" 
                  value={tempConfig.modelName}
                  onChange={(e) => setTempConfig({...tempConfig, modelName: e.target.value})}
                  placeholder="例如: My Model"
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm"
                />
              </div>

              {/* Model ID / Endpoint ID */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Box size={12} /> {tempConfig.provider === 'volcano' ? 'Endpoint ID (接入点 ID)' : 'Model ID'}
                </label>
                <input 
                  type="text" 
                  value={tempConfig.modelId}
                  onChange={(e) => setTempConfig({...tempConfig, modelId: e.target.value})}
                  placeholder={tempConfig.provider === 'volcano' ? "ep-2024..." : "gemini-2.5-flash"}
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm font-mono"
                />
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Key size={12} /> API Key <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  value={tempConfig.apiKey}
                  onChange={(e) => setTempConfig({...tempConfig, apiKey: e.target.value})}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm font-mono"
                />
              </div>

              {/* Base URL */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Link size={12} /> Base URL
                </label>
                <input 
                  type="text" 
                  value={tempConfig.baseUrl}
                  onChange={(e) => setTempConfig({...tempConfig, baseUrl: e.target.value})}
                  placeholder={tempConfig.provider === 'volcano' ? "https://ark.cn-beijing.volces.com/api/v3" : "https://generativelanguage.googleapis.com"}
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button variant="secondary" fullWidth onClick={() => setShowConfigModal(false)}>
                取消
              </Button>
              <Button fullWidth onClick={saveConfig}>
                保存配置
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
