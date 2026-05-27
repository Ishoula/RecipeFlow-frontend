"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/lib/auth-store";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              🍳 RecipeFlow
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/recipes"
                  className="text-gray-700 hover:text-primary"
                >
                  Recipes
                </Link>
                <Link
                  href="/recipes/new"
                  className="text-gray-700 hover:text-primary"
                >
                  + New Recipe
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
