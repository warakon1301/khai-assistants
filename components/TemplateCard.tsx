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
  categoryColors?: {
    cardBorder: string;
    cardHoverBorder: string;
    cardButton: string;
    cardButtonHover: string;
  };
}

const cardColors = [
  { cardBorder: 'border-pink-300', cardHoverBorder: 'hover:border-pink-400', cardButton: 'bg-pink-500', cardButtonHover: 'hover:bg-pink-600' },
  { cardBorder: 'border-purple-300', cardHoverBorder: 'hover:border-purple-400', cardButton: 'bg-purple-500', cardButtonHover: 'hover:bg-purple-600' },
  { cardBorder: 'border-blue-300', cardHoverBorder: 'hover:border-blue-400', cardButton: 'bg-blue-500', cardButtonHover: 'hover:bg-blue-600' },
  { cardBorder: 'border-green-300', cardHoverBorder: 'hover:border-green-400', cardButton: 'bg-green-500', cardButtonHover: 'hover:bg-green-600' },
  { cardBorder: 'border-orange-300', cardHoverBorder: 'hover:border-orange-400', cardButton: 'bg-orange-500', cardButtonHover: 'hover:bg-orange-600' },
  { cardBorder: 'border-teal-300', cardHoverBorder: 'hover:border-teal-400', cardButton: 'bg-teal-500', cardButtonHover: 'hover:bg-teal-600' },
  { cardBorder: 'border-rose-300', cardHoverBorder: 'hover:border-rose-400', cardButton: 'bg-rose-500', cardButtonHover: 'hover:bg-rose-600' },
  { cardBorder: 'border-indigo-300', cardHoverBorder: 'hover:border-indigo-400', cardButton: 'bg-indigo-500', cardButtonHover: 'hover:bg-indigo-600' },
];

export default function TemplateCard({ template, onCopy, cardIndex = 0, categoryColors }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = categoryColors || cardColors[cardIndex % cardColors.length];

  return (
        <div className={`bg-white rounded-xl shadow-sm border-2 ${colors.cardBorder} ${colors.cardHoverBorder} p-6 hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight mr-4">
          {template.title}
        </h3>
        <button
          onClick={handleCopy}
              className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-base font-semibold transition-all shadow-sm ${
                copied
                  ? 'bg-green-500 text-white shadow-green-200'
                  : `${colors.cardButton} text-white ${colors.cardButtonHover} hover:shadow-md active:scale-95`
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

