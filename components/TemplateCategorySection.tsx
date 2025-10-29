'use client';

import { useState } from 'react';
import { TemplateCategory } from '@/data/templates';
import TemplateCard from './TemplateCard';

interface TemplateCategorySectionProps {
  category: TemplateCategory;
  searchQuery: string;
}

export default function TemplateCategorySection({
  category,
  searchQuery,
}: TemplateCategorySectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');

  const filteredTemplates = category.templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage('คัดลอกแล้ว!');
    setTimeout(() => setCopyMessage(''), 2000);
  };

  if (filteredTemplates.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg mb-5"
      >
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <span className="text-lg font-semibold bg-white/20 px-4 py-1 rounded-full">
          {expanded ? '▼' : '▶'} {filteredTemplates.length} รายการ
        </span>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      {copyMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl z-50 text-lg font-semibold animate-pulse">
          ✓ {copyMessage}
        </div>
      )}
    </div>
  );
}

