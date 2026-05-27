import type { Metadata } from 'next';
import { Navbar } from '@/app/components/Navbar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'RecipeFlow - Share, Discover & Master Recipes',
  description: 'Create your culinary masterpiece and inspire others',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
