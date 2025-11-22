
import React, { useRef } from 'react';
import { ToneStyle, GenerationSettings } from '../types';
import { STYLE_CONFIG } from '../constants';
import { Image as ImageIcon, X, Hash, Smile, Type, Plus } from 'lucide-react';

interface InputSectionProps {
  keywords: string;
  setKeywords: (val: string) => void;
  images: string[];
  setImages: (val: string[]) => void;
  style: ToneStyle;
  setStyle: (val: ToneStyle) => void;
  settings: GenerationSettings;
  setSettings: (val: GenerationSettings) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  keywords,
  setKeywords,
  images,
  setImages,
  style,
  setStyle,
  settings,
  setSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (images.length >= 3) {
        alert("最多上传 3 张图片");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages([...images, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
      // Reset input value so same file can be selected again if needed (though unlikely for this flow)
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const lengthLabels: Record<string, string> = {
    short: '短篇',
    medium: '适中',
    long: '长篇'
  };

  return (
    <section className="space-y-4 mb-8">
       <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span className="w-1 h-4 bg-black dark:bg-white rounded-full"></span>
        核心内容
      </h2>
      
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-all">
        {/* Toolbar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-900">
          <div className="flex gap-1">
             {(Object.keys(STYLE_CONFIG) as ToneStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`
                  px-3 py-1.5 rounded text-xs font-medium transition-colors
                  ${style === s 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'}
                `}
              >
                {STYLE_CONFIG[s]}
              </button>
            ))}
          </div>
          <button 
             onClick={() => {
               if (images.length < 3) {
                 fileInputRef.current?.click();
               }
             }}
             disabled={images.length >= 3}
             className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
               images.length > 0 
                 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                 : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
               } ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             <ImageIcon size={14} />
             {images.length > 0 ? `已添加 (${images.length}/3)` : '添加图片'}
           </button>
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
           />
        </div>

        {/* Text Area & Image Thumbnails */}
        <div className="relative flex flex-col">
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="在此输入产品卖点、主题关键词，或直接粘贴参考链接..."
            className="w-full min-h-[180px] p-5 bg-transparent border-none focus:ring-0 resize-y text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 leading-relaxed outline-none"
          />
          
          {/* Image Preview Strip */}
          {images.length > 0 && (
            <div className="px-5 pb-4 flex items-center gap-3 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Uploaded ${index + 1}`} 
                    className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-700 shadow-sm" 
                  />
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {/* Add More Button (visible if < 3) */}
              {images.length < 3 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 w-16 flex items-center justify-center rounded border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Settings Bar */}
        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 flex flex-wrap items-center gap-6 border-t border-gray-100 dark:border-gray-900 rounded-b-md">
          {/* Word Count */}
          <div className="flex items-center gap-2">
             <Type size={14} className="text-gray-400" />
             <div className="flex bg-gray-200 dark:bg-gray-800 rounded p-0.5">
               {['short', 'medium', 'long'].map((l) => (
                 <button
                   key={l}
                   onClick={() => setSettings({ ...settings, wordCount: l as any })}
                   className={`px-2 py-0.5 text-[10px] font-medium rounded-sm transition-all ${
                      settings.wordCount === l as any
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' 
                      : 'text-gray-500'
                   }`}
                 >
                   {lengthLabels[l]}
                 </button>
               ))}
             </div>
          </div>

          {/* Emoji Toggle */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSettings({...settings, useEmoji: !settings.useEmoji})}>
             <Smile size={14} className={settings.useEmoji ? 'text-orange-500' : 'text-gray-400'} />
             <span className={`text-xs font-medium ${settings.useEmoji ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500'}`}>
               Emoji
             </span>
          </div>

           {/* Tag Count */}
           <div className="flex items-center gap-2">
             <Hash size={14} className="text-gray-400" />
             <span className="text-xs text-gray-500">标签:</span>
             <input 
              type="range" 
              min="1" 
              max="8" 
              step="1"
              value={settings.tagCount}
              onChange={(e) => setSettings({...settings, tagCount: parseInt(e.target.value)})}
              className="w-16 accent-black dark:accent-white h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-medium w-3">{settings.tagCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
