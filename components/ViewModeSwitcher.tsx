'use client';

import { useState, useEffect } from 'react';

export type ViewMode = 'cards' | 'table' | 'list';

interface ViewModeSwitcherProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export default function ViewModeSwitcher({ 
  currentMode, 
  onModeChange, 
  className = '' 
}: ViewModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const viewModes = [
    {
      id: 'cards' as ViewMode,
      name: 'การ์ด',
      icon: '🃏',
      description: 'ดูแบบการ์ดสวยๆ'
    },
    {
      id: 'table' as ViewMode,
      name: 'ตาราง',
      icon: '📊',
      description: 'ดูเทมเพลตแบบตาราง'
    },
    {
      id: 'list' as ViewMode,
      name: 'รายการ',
      icon: '📋',
      description: 'ดูแบบรายการดั้งเดิม'
    }
  ];

  const currentViewMode = viewModes.find(mode => mode.id === currentMode) || viewModes[0];

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('template-view-mode', currentMode);
  }, [currentMode]);

  // Load view mode preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('template-view-mode') as ViewMode;
    if (savedMode && viewModes.some(mode => mode.id === savedMode)) {
      onModeChange(savedMode);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
      >
        <span className="text-lg">{currentViewMode.icon}</span>
        <span className="font-medium text-gray-700">{currentViewMode.name}</span>
        <span className="text-gray-400">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="py-2">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onModeChange(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    currentMode === mode.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{mode.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-sm text-gray-500">{mode.description}</div>
                  </div>
                  {currentMode === mode.id && (
                    <span className="text-blue-500">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="text-xs text-gray-500">
                การตั้งค่าจะถูกบันทึกอัตโนมัติ
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
