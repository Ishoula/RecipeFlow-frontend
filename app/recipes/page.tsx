'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard, Recipe } from '@/app/components/RecipeCard';
import { recipeAPI } from '@/app/lib/api';
import { Navbar } from '@/app/components/Navbar';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getAllRecipes();
      setRecipes(response.data);
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
    <ProtectedRoute>
      <main>
        <Navbar />
        <div className="min-h-screen bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-dark">All Recipes</h1>
              <Link
                href="/recipes/new"
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition flex items-center gap-2"
              >
                + Add Recipe
              </Link>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700 mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading recipes...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  No recipes found. Be the first to share one!
                </p>
                <Link
                  href="/recipes/new"
                  className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition"
                >
                  Create Recipe
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClickRecipe={handleRecipeClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
