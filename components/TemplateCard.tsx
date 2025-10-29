'use client';

import { useState } from 'react';

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    content: string;
  };
  onCopy: (content: string) => void;
}

export default function TemplateCard({ template, onCopy }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-pink-300 transition-all">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight mr-4">
          {template.title}
        </h3>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-base font-semibold transition-all shadow-sm ${
            copied
              ? 'bg-green-500 text-white shadow-green-200'
              : 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md active:scale-95'
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

