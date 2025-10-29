'use client';

import { useState } from 'react';

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    content: string;
  };
  onCopy: (content: string) => void;
  cardIndex?: number;
}

const cardColors = [
  { border: 'border-pink-300', hoverBorder: 'hover:border-pink-400', button: 'bg-pink-500', buttonHover: 'hover:bg-pink-600' },
  { border: 'border-purple-300', hoverBorder: 'hover:border-purple-400', button: 'bg-purple-500', buttonHover: 'hover:bg-purple-600' },
  { border: 'border-blue-300', hoverBorder: 'hover:border-blue-400', button: 'bg-blue-500', buttonHover: 'hover:bg-blue-600' },
  { border: 'border-green-300', hoverBorder: 'hover:border-green-400', button: 'bg-green-500', buttonHover: 'hover:bg-green-600' },
  { border: 'border-orange-300', hoverBorder: 'hover:border-orange-400', button: 'bg-orange-500', buttonHover: 'hover:bg-orange-600' },
  { border: 'border-teal-300', hoverBorder: 'hover:border-teal-400', button: 'bg-teal-500', buttonHover: 'hover:bg-teal-600' },
  { border: 'border-rose-300', hoverBorder: 'hover:border-rose-400', button: 'bg-rose-500', buttonHover: 'hover:bg-rose-600' },
  { border: 'border-indigo-300', hoverBorder: 'hover:border-indigo-400', button: 'bg-indigo-500', buttonHover: 'hover:bg-indigo-600' },
];

export default function TemplateCard({ template, onCopy, cardIndex = 0 }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = cardColors[cardIndex % cardColors.length];

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${colors.border} ${colors.hoverBorder} p-6 hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight mr-4">
          {template.title}
        </h3>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-base font-semibold transition-all shadow-sm ${
            copied
              ? 'bg-green-500 text-white shadow-green-200'
              : `${colors.button} text-white ${colors.buttonHover} hover:shadow-md active:scale-95`
          }`}
        >
          {copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอก'}
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-5 max-h-80 overflow-y-auto border border-gray-100">
        <div className="whitespace-pre-wrap text-base text-gray-800 leading-relaxed font-sans">
          {template.content}
        </div>
      </div>
    </div>
  );
}

