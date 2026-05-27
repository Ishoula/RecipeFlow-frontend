'use client';

import { useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { useAuthStore } from '@/app/lib/auth-store';
import Link from 'next/link';

export default function Home() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">🍳 RecipeFlow</h1>
            <p className="text-xl md:text-2xl mb-4">
              Share, Discover & Master Recipes
            </p>
            <p className="text-lg md:text-xl mb-12 opacity-90">
              Create your culinary masterpiece and inspire others
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/recipes"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Browse Recipes
              </Link>
              <Link
                href="/recipes/new"
                className="px-8 py-3 bg-dark text-white font-bold rounded-lg hover:bg-gray-800 transition"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
