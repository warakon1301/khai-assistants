'use client';

import { useState, useEffect } from 'react';
import { templateCategories, TemplateCategory } from '@/data/templates';
import TemplateCategorySection from '@/components/TemplateCategorySection';
import ViewModeSwitcher, { ViewMode } from '@/components/ViewModeSwitcher';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [categories, setCategories] = useState<TemplateCategory[]>(templateCategories);
  const [loading, setLoading] = useState(true);

  // Load view mode preference and custom templates from Firebase on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('template-view-mode') as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    // Load templates from Firebase with real-time updates
    const loadTemplatesFromFirebase = async () => {
      try {
        const templatesRef = doc(db, 'app', 'templates');
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(templatesRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && data.categories) {
              setCategories(data.categories);
            }
          } else {
            // If no data exists, use defaults
            setCategories(templateCategories);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading templates from Firebase:', error);
        setCategories(templateCategories);
        setLoading(false);
      }
    };

    loadTemplatesFromFirebase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐷</div>
          <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-end mb-4">
            <Link
              href="/manage"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium shadow-lg"
            >
              ⚙️ จัดการเทมเพลต
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            🐷 Template Viewer
          </h1>
          <p className="text-gray-700 text-xl font-medium">
            ค้นหาและคัดลอกเทมเพลตข้อความสำหรับ LINE MAN
          </p>
        </div>

        {/* Search Bar and Controls */}
        <div className="mb-10 sticky top-4 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">🔍</span>
                <input
                  type="text"
                  placeholder="พิมพ์เพื่อค้นหาเทมเพลต..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                <ViewModeSwitcher
                  currentMode={viewMode}
                  onModeChange={setViewMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Template Categories */}
        <div>
          {categories.map((category, index) => (
            <TemplateCategorySection
              key={category.id}
              category={category}
              searchQuery={searchQuery}
              categoryIndex={index}
              viewMode={viewMode}
            />
          ))}
          
          {searchQuery && categories.every(
            (cat) => cat.templates.filter(
              (t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     t.content.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0
          ) && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 font-medium">
                ไม่พบเทมเพลตที่ค้นหา
              </p>
              <p className="text-gray-500 mt-2">
                ลองใช้คำค้นหาอื่นหรือลบคำค้นหาเพื่อดูทั้งหมด
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="text-lg">© 2024 Template Viewer - สำหรับใช้งานภายใน</p>
        </div>
      </div>
    </div>
  );
}

