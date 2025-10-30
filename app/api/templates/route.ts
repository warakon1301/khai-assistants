import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const FILE_PATH = join(DATA_DIR, 'custom-templates.json');

// GET - Read templates
export async function GET() {
  try {
    // Initialize default data if file doesn't exist
    if (!existsSync(FILE_PATH)) {
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }
      
      // Import default templates
      const { templateCategories } = await import('@/data/templates');
      writeFileSync(FILE_PATH, JSON.stringify(templateCategories, null, 2), 'utf-8');
      
      return NextResponse.json(templateCategories);
    }

    const data = readFileSync(FILE_PATH, 'utf-8');
    const templates = JSON.parse(data);
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json(
      { error: 'Failed to read templates' },
      { status: 500 }
    );
  }
}

// POST - Save templates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate data structure
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write to file
    writeFileSync(FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Templates saved successfully' });
  } catch (error) {
    console.error('Error saving templates:', error);
    return NextResponse.json(
      { error: 'Failed to save templates' },
      { status: 500 }
    );
  }
}

