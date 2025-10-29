import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Template Assistant - หมูน้อยช่วยงาน',
  description: 'ดูและคัดลอกเทมเพลตข้อความสำหรับ LINE MAN',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
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

