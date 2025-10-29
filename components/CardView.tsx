'use client';

import { useState } from 'react';
import { Template } from '@/data/templates';

interface CardViewProps {
  templates: Template[];
  onCopy: (content: string) => void;
  categoryName: string;
  categoryColors?: {
    cardBorder: string;
    cardHoverBorder: string;
    cardButton: string;
    cardButtonHover: string;
  };
}

type CardSize = 'small' | 'medium' | 'large';
type ViewMode = 'grid' | 'list';

export default function CardView({ 
  templates, 
  onCopy, 
  categoryName, 
  categoryColors 
}: CardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cardSize, setCardSize] = useState<CardSize>('medium');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (templateId: string) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId);
    } else {
      newSelected.add(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTemplates.size === filteredTemplates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(filteredTemplates.map(t => t.id)));
    }
  };

  const handleCopySelected = () => {
    const selectedTemplatesData = filteredTemplates.filter(t => selectedTemplates.has(t.id));
    const combinedContent = selectedTemplatesData
      .map(t => `${t.title}\n${t.content}`)
      .join('\n\n---\n\n');
    onCopy(combinedContent);
    setSelectedTemplates(new Set());
  };

  const getCardSizeClasses = () => {
    switch (cardSize) {
      case 'small':
        return 'p-3 text-sm';
      case 'medium':
        return 'p-4 text-base';
      case 'large':
        return 'p-6 text-lg';
      default:
        return 'p-4 text-base';
    }
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-4';
    if (viewMode === 'list') {
      return `${baseClasses} grid-cols-1`;
    }
    
    switch (cardSize) {
      case 'small':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 'medium':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`;
      case 'large':
        return `${baseClasses} grid-cols-1 lg:grid-cols-2`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`;
    }
  };


  const defaultColors = {
    cardBorder: 'border-gray-300',
    cardHoverBorder: 'hover:border-gray-400',
    cardButton: 'bg-blue-500',
    cardButtonHover: 'hover:bg-blue-600'
  };

  const colors = categoryColors || defaultColors;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {categoryName} - โหมดการ์ด ({filteredTemplates.length} รายการ)
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="ค้นหาเทมเพลต..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                📊 Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                📋 List
              </button>
            </div>

            {/* Card Size */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setCardSize('small')}
                className={`px-3 py-2 text-sm ${
                  cardSize === 'small' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                S
              </button>
              <button
                onClick={() => setCardSize('medium')}
                className={`px-3 py-2 text-sm ${
                  cardSize === 'medium' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                M
              </button>
              <button
                onClick={() => setCardSize('large')}
                className={`px-3 py-2 text-sm ${
                  cardSize === 'large' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                L
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTemplates.size > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              เลือกแล้ว {selectedTemplates.size} รายการ
            </span>
            <button
              onClick={handleCopySelected}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              คัดลอกที่เลือก
            </button>
            <button
              onClick={() => setSelectedTemplates(new Set())}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              ยกเลิกการเลือก
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="p-6">
        <div className={getGridClasses()}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-sm border-2 ${colors.cardBorder} ${colors.cardHoverBorder} transition-all hover:shadow-md ${
                selectedTemplates.has(template.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className={getCardSizeClasses()}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.has(template.id)}
                      onChange={() => handleSelectTemplate(template.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="font-semibold text-gray-900 leading-tight flex-1">
                      {template.title}
                    </h4>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {template.content}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {template.content.length} ตัวอักษร
                  </div>
                  <button
                    onClick={() => onCopy(template.content)}
                    className={`px-3 py-1.5 ${colors.cardButton} text-white text-sm rounded-lg ${colors.cardButtonHover} transition-colors shadow-sm`}
                  >
                    📋 คัดลอก
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchQuery ? 'ไม่พบเทมเพลตที่ค้นหา' : 'ไม่มีเทมเพลตในหมวดนี้'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
