'use client';

import { useState } from 'react';
import { TemplateCategory } from '@/data/templates';
import TemplateCard from './TemplateCard';
import TableView from './TableView';
import CardView from './CardView';
import { ViewMode } from './ViewModeSwitcher';

interface TemplateCategorySectionProps {
  category: TemplateCategory;
  searchQuery: string;
  categoryIndex: number;
  viewMode: ViewMode;
}

const categoryColors = [
  { 
    from: 'from-pink-500', to: 'to-rose-500', hoverFrom: 'hover:from-pink-600', hoverTo: 'hover:to-rose-600',
    cardBorder: 'border-pink-300', cardHoverBorder: 'hover:border-pink-400', cardButton: 'bg-pink-500', cardButtonHover: 'hover:bg-pink-600'
  }, // เทมเพลตบอท
  { 
    from: 'from-purple-500', to: 'to-indigo-500', hoverFrom: 'hover:from-purple-600', hoverTo: 'hover:to-indigo-600',
    cardBorder: 'border-purple-300', cardHoverBorder: 'hover:border-purple-400', cardButton: 'bg-purple-500', cardButtonHover: 'hover:bg-purple-600'
  }, // แชทบอท
  { 
    from: 'from-blue-500', to: 'to-cyan-500', hoverFrom: 'hover:from-blue-600', hoverTo: 'hover:to-cyan-600',
    cardBorder: 'border-blue-300', cardHoverBorder: 'hover:border-blue-400', cardButton: 'bg-blue-500', cardButtonHover: 'hover:bg-blue-600'
  }, // เทมเพลตใช้บ่อย
  { 
    from: 'from-green-500', to: 'to-emerald-500', hoverFrom: 'hover:from-green-600', hoverTo: 'hover:to-emerald-600',
    cardBorder: 'border-green-300', cardHoverBorder: 'hover:border-green-400', cardButton: 'bg-green-500', cardButtonHover: 'hover:bg-green-600'
  }, // คนขับกรอกเคลม
  { 
    from: 'from-orange-500', to: 'to-amber-500', hoverFrom: 'hover:from-orange-600', hoverTo: 'hover:to-amber-600',
    cardBorder: 'border-orange-300', cardHoverBorder: 'hover:border-orange-400', cardButton: 'bg-orange-500', cardButtonHover: 'hover:bg-orange-600'
  }, // ยกเลิกออร์เดอร์
  { 
    from: 'from-teal-500', to: 'to-sky-500', hoverFrom: 'hover:from-teal-600', hoverTo: 'hover:to-sky-600',
    cardBorder: 'border-teal-300', cardHoverBorder: 'hover:border-teal-400', cardButton: 'bg-teal-500', cardButtonHover: 'hover:bg-teal-600'
  }, // บันทึกเคสทั่วไป
];

export default function TemplateCategorySection({
  category,
  searchQuery,
  categoryIndex,
  viewMode,
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

  const renderContent = () => {
    if (!expanded) return null;

    switch (viewMode) {
      case 'table':
        return (
          <TableView
            templates={filteredTemplates}
            onCopy={handleCopy}
            categoryName={category.name}
          />
        );
      case 'cards':
        return (
          <CardView
            templates={filteredTemplates}
            onCopy={handleCopy}
            categoryName={category.name}
            categoryColors={colors}
          />
        );
      case 'list':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCopy={handleCopy}
                cardIndex={index}
                categoryColors={colors}
              />
            ))}
          </div>
        );
    }
  };

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

      {renderContent()}

      {copyMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl z-50 text-lg font-semibold animate-pulse">
          ✓ {copyMessage}
        </div>
      )}
    </div>
  );
}

