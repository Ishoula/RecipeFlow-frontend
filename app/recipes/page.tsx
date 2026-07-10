'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard, Recipe } from '@/app/components/RecipeCard';
import { recipeAPI } from '@/app/lib/api';
import { Navbar } from '@/app/components/Navbar';
import { useAuthStore } from '@/app/lib/auth-store';
import { RecipeGridSkeleton } from '@/app/components/Skeletons';

export default function RecipesPage() {
  const router = useRouter();
  const { initAuth, isAuthenticated } = useAuthStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getAllRecipes({ page: currentPage, size: 20 });
      // Page<Recipe> from Spring has .content, .totalPages, .totalElements
      setRecipes(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setError('');
    } catch (err: any) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (id: number) => {
    router.push(`/recipes/${id}`);
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-dark">All Recipes</h1>
              <p className="text-gray-600 mt-2">
                Browse recipes from the RecipeFlow community.
              </p>
            </div>
            {isAuthenticated ? (
              <Link
                href="/recipes/new"
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition flex items-center gap-2"
              >
                + Add Recipe
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 bg-white text-primary border border-primary font-bold rounded-lg hover:bg-gray-50 transition text-center"
              >
                Log in to add a recipe
              </Link>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <RecipeGridSkeleton />
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                No recipes found yet.
              </p>
              {isAuthenticated ? (
                <Link
                  href="/recipes/new"
                  className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition"
                >
                  Create Recipe
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition"
                >
                  Join to share one
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClickRecipe={handleRecipeClick}
                  />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {currentPage + 1} of {totalPages} ({totalElements} recipes)
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
