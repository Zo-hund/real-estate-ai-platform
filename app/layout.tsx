import { RootLayout } from '@/components/layout/RootLayout';
import './globals.css';

export const metadata = {
  title: 'Real Estate AI Platform',
  description: 'Intelligent real estate solutions powered by AI',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}