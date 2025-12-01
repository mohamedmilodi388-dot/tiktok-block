import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string;
  color?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, color = "cyan" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColors = (c: string) => {
    switch(c) {
      case 'rose': return { border: 'border-rose-500/30', badge: 'bg-rose-500' };
      case 'purple': return { border: 'border-purple-500/30', badge: 'bg-purple-500' };
      default: return { border: 'border-cyan-500/30', badge: 'bg-cyan-500' };
    }
  };

  const { border, badge } = getColors(color);

  return (
    <div className={`relative bg-slate-800/50 border ${border} rounded-xl p-5 mb-4 backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <span className={`w-2 h-6 ${badge} rounded-full`}></span>
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-white py-1.5 px-3 rounded-lg transition-all"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          {copied ? "تم النسخ" : "نسخ النص"}
        </button>
      </div>
      <div className="bg-slate-900/80 rounded-lg p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono border border-slate-700/50">
        {content}
      </div>
    </div>
  );
};