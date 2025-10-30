'use client';

import { useState, useEffect } from 'react';
import { templateCategories, TemplateCategory, Template } from '@/data/templates';
import Link from 'next/link';

export default function ManageTemplates() {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<string | false>(false);
  const [newCategory, setNewCategory] = useState('');

  // Load templates from API
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setCategories(templateCategories);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        setCategories(templateCategories);
      }
    };

    loadTemplates();
  }, []);

  // Save templates to API
  const saveTemplates = async (newCategories: TemplateCategory[]) => {
    setCategories(newCategories);
    
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategories),
      });
      
      if (response.ok) {
        // Dispatch custom event to notify other pages
        window.dispatchEvent(new Event('templates-updated'));
      } else {
        console.error('Failed to save templates');
        alert('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error saving templates:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // Edit template
  const handleEdit = (template: Template, categoryId: string) => {
    setEditingTemplate({ ...template });
    setEditingCategory(categoryId);
  };

  // Save edited template
  const handleSaveEdit = async () => {
    if (!editingTemplate) return;

    const newCategories = categories.map((category) => {
      if (category.id === editingCategory) {
        return {
          ...category,
          templates: category.templates.map((t) =>
            t.id === editingTemplate.id ? editingTemplate : t
          ),
        };
      }
      return category;
    });

    await saveTemplates(newCategories);
    setEditingTemplate(null);
    setEditingCategory('');
  };

  // Delete template
  const handleDelete = async (templateId: string, categoryId: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบเทมเพลตนี้?')) return;

    const newCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          templates: category.templates.filter((t) => t.id !== templateId),
        };
      }
      return category;
    });

    await saveTemplates(newCategories);
  };

  // Add new template
  const handleAddTemplate = async (categoryId: string, title: string, content: string) => {
    const newTemplate: Template = {
      id: `${categoryId}-${Date.now()}`,
      title,
      content,
    };

    const newCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          templates: [...category.templates, newTemplate],
        };
      }
      return category;
    });

    await saveTemplates(newCategories);
    setShowAddForm(false);
    // Clear form fields
    setNewCategory('');
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const newCategoryObj: TemplateCategory = {
      id: `category-${Date.now()}`,
      name: newCategory,
      templates: [],
    };

    await saveTemplates([...categories, newCategoryObj]);
    setNewCategory('');
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบหมวดหมู่นี้? เทมเพลตทั้งหมดในหมวดหมู่นี้จะถูกลบด้วย')) return;

    await saveTemplates(categories.filter((cat) => cat.id !== categoryId));
  };

  // Reset to defaults
  const handleReset = async () => {
    if (!confirm('คุณแน่ใจว่าต้องการรีเซ็ตเป็นค่าตั้งต้น? การเปลี่ยนแปลงทั้งหมดจะถูกลบ')) return;

    await saveTemplates(templateCategories);
    alert('รีเซ็ตเป็นค่าตั้งต้นเรียบร้อยแล้ว');
  };

  // Export templates to JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `templates-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('ส่งออกข้อมูลเรียบร้อยแล้ว');
  };

  // Import templates from JSON file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (Array.isArray(importedData) && importedData.length > 0) {
          if (!confirm(`คุณแน่ใจว่าต้องการนำเข้าข้อมูล? ข้อมูลปัจจุบันจะถูกแทนที่ด้วยข้อมูลใหม่ (${importedData.length} หมวดหมู่)`)) {
            return;
          }
          
          await saveTemplates(importedData);
          alert('นำเข้าข้อมูลเรียบร้อยแล้ว');
        } else {
          alert('รูปแบบไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ JSON ที่ถูกต้อง');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบว่าเป็นไฟล์ JSON ที่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2">
              ← กลับหน้าแรก
            </Link>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                📥 ส่งออกรายการ
              </button>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                📤 นำเข้ารายการ
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                🔄 รีเซ็ตเป็นค่าตั้งต้น
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">จัดการเทมเพลต</h1>
          <p className="text-gray-600 mt-2">แก้ไข เพิ่ม หรือลบเทมเพลตและหมวดหมู่</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">เคล็ดลับการใช้งาน</h3>
              <p className="text-blue-800 text-sm mb-2">
                ✅ ระบบจะบันทึกข้อมูลลงไฟล์ JSON อัตโนมัติทุกครั้งที่คุณแก้ไข
              </p>
              <p className="text-blue-800 text-sm mb-2">
                🌐 <strong>ข้อมูลจะซิงก์ข้ามเครื่องอัตโนมัติ!</strong> ทุกคนที่เปิดเว็บเดียวกันจะเห็นข้อมูลเดียวกัน
              </p>
              <p className="text-blue-800 text-sm">
                💾 <strong>สำรองข้อมูล:</strong> ใช้ปุ่ม "ส่งออกรายการ" เพื่อบันทึกเป็นไฟล์ JSON<br/>
                📤 <strong>นำเข้าข้อมูล:</strong> ใช้ปุ่ม "นำเข้ารายการ" เพื่อโหลดข้อมูลจากไฟล์ JSON
              </p>
            </div>
          </div>
        </div>

        {/* Add New Category */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">เพิ่มหมวดหมู่ใหม่</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ชื่อหมวดหมู่..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleAddCategory}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        {/* Template Categories */}
        {categories.map((category, index) => (
          <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(category.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + เพิ่มเทมเพลต
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  ลบหมวดหมู่
                </button>
              </div>
            </div>

            {/* Add Template Form */}
            {showAddForm === category.id && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-3">เพิ่มเทมเพลตใหม่</h3>
                <TemplateForm
                  onSave={(title, content) => handleAddTemplate(category.id, title, content)}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            {/* Templates List */}
            <div className="space-y-4">
              {category.templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  {editingTemplate?.id === template.id && editingCategory === category.id ? (
                    // Edit Mode
                    <EditTemplateForm
                      template={editingTemplate}
                      onChange={setEditingTemplate}
                      onSave={handleSaveEdit}
                      onCancel={() => {
                        setEditingTemplate(null);
                        setEditingCategory('');
                      }}
                    />
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{template.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(template, category.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(template.id, category.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {template.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Template Form Component for Adding
function TemplateForm({ onSave, onCancel }: { onSave: (title: string, content: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('กรุณากรอกหัวข้อและเนื้อหา');
      return;
    }
    onSave(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="หัวข้อเทมเพลต..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
      />
      <textarea
        placeholder="เนื้อหาเทมเพลต..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

// Edit Template Form Component
function EditTemplateForm({
  template,
  onChange,
  onSave,
  onCancel,
}: {
  template: Template;
  onChange: (template: Template) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const handleTitleChange = (title: string) => {
    onChange({ ...template, title });
  };

  const handleContentChange = (content: string) => {
    onChange({ ...template, content });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template.title.trim() || !template.content.trim()) {
      alert('กรุณากรอกหัวข้อและเนื้อหา');
      return;
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={template.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
      />
      <textarea
        value={template.content}
        onChange={(e) => handleContentChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

