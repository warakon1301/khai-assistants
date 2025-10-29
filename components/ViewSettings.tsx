'use client';

import { useState, useEffect } from 'react';

export interface ViewSettings {
  itemsPerPage: number;
  cardSize: 'small' | 'medium' | 'large';
  showPreview: boolean;
  autoSave: boolean;
  compactMode: boolean;
}

interface ViewSettingsProps {
  settings: ViewSettings;
  onSettingsChange: (settings: ViewSettings) => void;
  className?: string;
}

const defaultSettings: ViewSettings = {
  itemsPerPage: 12,
  cardSize: 'medium',
  showPreview: true,
  autoSave: true,
  compactMode: false
};

export default function ViewSettings({ 
  settings, 
  onSettingsChange, 
  className = '' 
}: ViewSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ViewSettings>(settings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('template-view-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setLocalSettings({ ...defaultSettings, ...parsed });
        onSettingsChange({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading view settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('template-view-settings', JSON.stringify(settings));
    }
  }, [settings]);

  const handleSettingChange = (key: keyof ViewSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    localStorage.removeItem('template-view-settings');
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const itemsPerPageOptions = [6, 12, 24, 48, 96];

  return (
    <div className={`relative ${className}`}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="การตั้งค่าการแสดงผล"
      >
        <span className="text-lg">⚙️</span>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          การตั้งค่า
        </span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  การตั้งค่าการแสดงผล
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Items Per Page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จำนวนรายการต่อหน้า
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {itemsPerPageOptions.map((count) => (
                      <button
                        key={count}
                        onClick={() => handleSettingChange('itemsPerPage', count)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localSettings.itemsPerPage === count
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ขนาดการ์ด
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'small', label: 'เล็ก', icon: 'S' },
                      { value: 'medium', label: 'กลาง', icon: 'M' },
                      { value: 'large', label: 'ใหญ่', icon: 'L' }
                    ].map(({ value, label, icon }) => (
                      <button
                        key={value}
                        onClick={() => handleSettingChange('cardSize', value)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localSettings.cardSize === value
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-bold">{icon}</div>
                        <div className="text-xs">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      แสดงตัวอย่างเนื้อหา
                    </span>
                    <input
                      type="checkbox"
                      checked={localSettings.showPreview}
                      onChange={(e) => handleSettingChange('showPreview', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      บันทึกการตั้งค่าอัตโนมัติ
                    </span>
                    <input
                      type="checkbox"
                      checked={localSettings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      โหมดกะทัดรัด
                    </span>
                    <input
                      type="checkbox"
                      checked={localSettings.compactMode}
                      onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  รีเซ็ต
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
