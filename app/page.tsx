'use client';

import { useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { useAuthStore } from '@/app/lib/auth-store';
import Link from 'next/link';
import { ChefHat, ArrowRight, Compass, Users, UtensilsCrossed } from 'lucide-react';

export default function Home() {
  const { initAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <main className="min-h-screen bg-light text-dark font-sans relative overflow-hidden">
      <Navbar />

      {/* Subtle Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-10 pointer-events-none blur-3xl z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full transform -skew-y-12"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-sm font-medium text-gray-600">The #1 Community for Culinary Enthusiasts</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Master Your Kitchen <br className="hidden md:block" />
          with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">RecipeFlow</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover thousands of mouth-watering recipes, share your own culinary masterpieces, and connect with food lovers around the globe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/recipes"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
          >
            Explore Recipes <ArrowRight size={20} />
          </Link>
          {!isAuthenticated && (
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-dark border border-gray-200 font-bold rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all text-lg"
            >
              Join for Free
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-200">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to cook better</h2>
          <p className="text-lg text-gray-600">Whether you are a beginner or a seasoned chef, RecipeFlow is built for you.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Compass size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark">Discover New Flavors</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore a vast collection of recipes curated by chefs and home cooks worldwide. Find your next favorite meal instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
              <UtensilsCrossed size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark">Cook Like a Pro</h3>
            <p className="text-gray-600 leading-relaxed">
              Follow step-by-step instructions, organize your ingredients, and master techniques with our interactive recipe guides.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-dark">Share & Connect</h3>
            <p className="text-gray-600 leading-relaxed">
              Publish your own secret recipes, gather likes, read reviews, and build your reputation in the cooking community.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
