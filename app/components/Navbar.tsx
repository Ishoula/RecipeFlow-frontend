"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/app/lib/auth-store";
import { useRouter } from "next/navigation";
import { ChefHat, BookOpen, PlusCircle, LogOut, LogIn, UserPlus, User ,Menu,X} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChefHat size={28} strokeWidth={2.5} />
            <span className="tracking-tight">RecipeFlow</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/recipes" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                  <BookOpen size={18} /> Recipes
                </Link>
                <Link href="/recipes/new" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                  <PlusCircle size={18} /> New Recipe
                </Link>
                <Link href="/recipes/my" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                  <ChefHat size={18} /> My Recipes
                </Link>
                <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User size={16} className="text-primary" />
                    {user?.username}
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/recipes" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                  <BookOpen size={18} /> Recipes
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                  <LogIn size={18} /> Login
                </Link>
                <Link href="/register" className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow">
                  <UserPlus size={18} /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600 hover:text-primary focus:outline-none">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {isAuthenticated ? (
              <>
                <Link href="/recipes" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                  <BookOpen size={18} /> Recipes
                </Link>
                <Link href="/recipes/new" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                  <PlusCircle size={18} /> New Recipe
                </Link>
                <Link href="/recipes/my" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                  <ChefHat size={18} /> My Recipes
                </Link>
                <div className="flex items-center gap-4 border-t pt-2 mt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User size={16} className="text-primary" />
                    {user?.username}
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/recipes" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                  <BookOpen size={18} /> Recipes
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                  <LogIn size={18} /> Login
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:brightness-90 transition-all shadow-sm hover:shadow">
                  <UserPlus size={18} /> Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
