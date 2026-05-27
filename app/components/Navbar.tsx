"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/lib/auth-store";
import { useRouter } from "next/navigation";
import { ChefHat, BookOpen, PlusCircle, LogOut, LogIn, UserPlus, User } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChefHat size={28} strokeWidth={2.5} /> 
              <span className="tracking-tight">RecipeFlow</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/recipes"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  <BookOpen size={18} /> Recipes
                </Link>
                <Link
                  href="/recipes/new"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  <PlusCircle size={18} /> New Recipe
                </Link>
                <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User size={16} className="text-primary" />
                    {user?.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  <LogIn size={18} /> Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow"
                >
                  <UserPlus size={18} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
