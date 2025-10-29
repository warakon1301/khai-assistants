'use client';

import { useState } from 'react';
import { TemplateCategory } from '@/data/templates';
import TemplateCard from './TemplateCard';

interface TemplateCategorySectionProps {
  category: TemplateCategory;
  searchQuery: string;
  categoryIndex: number;
}

const categoryColors = [
  { from: 'from-pink-500', to: 'to-rose-500', hoverFrom: 'hover:from-pink-600', hoverTo: 'hover:to-rose-600' }, // เทมเพลตบอท
  { from: 'from-purple-500', to: 'to-indigo-500', hoverFrom: 'hover:from-purple-600', hoverTo: 'hover:to-indigo-600' }, // แชทบอท
  { from: 'from-blue-500', to: 'to-cyan-500', hoverFrom: 'hover:from-blue-600', hoverTo: 'hover:to-cyan-600' }, // เทมเพลตใช้บ่อย
  { from: 'from-green-500', to: 'to-emerald-500', hoverFrom: 'hover:from-green-600', hoverTo: 'hover:to-emerald-600' }, // คนขับกรอกเคลม
  { from: 'from-orange-500', to: 'to-amber-500', hoverFrom: 'hover:from-orange-600', hoverTo: 'hover:to-amber-600' }, // ยกเลิกออร์เดอร์
  { from: 'from-teal-500', to: 'to-sky-500', hoverFrom: 'hover:from-teal-600', hoverTo: 'hover:to-sky-600' }, // บันทึกเคสทั่วไป
];

export default function TemplateCategorySection({
  category,
  searchQuery,
  categoryIndex,
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

  const colors = categoryColors[categoryIndex % categoryColors.length];

  return (
    <div className="mb-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex justify-between items-center bg-gradient-to-r ${colors.from} ${colors.to} text-white p-5 rounded-xl ${colors.hoverFrom} ${colors.hoverTo} transition-all shadow-md hover:shadow-lg mb-5`}
      >
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <span className="text-lg font-semibold bg-white/20 px-4 py-1 rounded-full">
          {expanded ? '▼' : '▶'} {filteredTemplates.length} รายการ
        </span>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              onCopy={handleCopy}
              cardIndex={index}
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

