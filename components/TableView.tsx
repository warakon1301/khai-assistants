'use client';

import { useState } from 'react';
import { Template } from '@/data/templates';

interface TableViewProps {
  templates: Template[];
  onCopy: (content: string) => void;
  categoryName: string;
}

type SortField = 'title' | 'content' | 'length';
type SortDirection = 'asc' | 'desc';

export default function TableView({ templates, onCopy, categoryName }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'content':
        aValue = a.content;
        bValue = b.content;
        break;
      case 'length':
        aValue = a.content.length;
        bValue = b.content.length;
        break;
      default:
        aValue = a.title;
        bValue = b.title;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue, 'th')
        : bValue.localeCompare(aValue, 'th');
    } else {
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
    if (selectedTemplates.size === sortedTemplates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(sortedTemplates.map(t => t.id)));
    }
  };

  const handleCopySelected = () => {
    const selectedTemplatesData = sortedTemplates.filter(t => selectedTemplates.has(t.id));
    const combinedContent = selectedTemplatesData
      .map(t => `${t.title}\n${t.content}`)
      .join('\n\n---\n\n');
    onCopy(combinedContent);
    setSelectedTemplates(new Set());
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {categoryName} - โหมดตาราง ({filteredTemplates.length} รายการ)
          </h3>
          
          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ค้นหาเทมเพลต..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTemplates.size === sortedTemplates.length && sortedTemplates.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">หัวข้อ</span>
                  <span className="text-gray-400">{getSortIcon('title')}</span>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('length')}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">ความยาว</span>
                  <span className="text-gray-400">{getSortIcon('length')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">เนื้อหา</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-gray-700">การดำเนินการ</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTemplates.map((template) => (
              <tr 
                key={template.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedTemplates.has(template.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTemplates.has(template.id)}
                    onChange={() => handleSelectTemplate(template.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 max-w-xs truncate">
                    {template.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {template.content.length} ตัวอักษร
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600 max-w-md whitespace-pre-wrap">
                    {template.content}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onCopy(template.content)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    คัดลอก
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchQuery ? 'ไม่พบเทมเพลตที่ค้นหา' : 'ไม่มีเทมเพลตในหมวดนี้'}
          </div>
        </div>
      )}
    </div>
  );
}
