import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Template Viewer - LINE MAN Templates',
  description: 'ดูและคัดลอกเทมเพลตข้อความสำหรับ LINE MAN',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

