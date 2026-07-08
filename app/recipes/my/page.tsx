'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, Edit, Trash2, ArrowLeft, ChefHat } from 'lucide-react';
import { Recipe } from '@/app/components/RecipeCard';
import { recipeAPI } from '@/app/lib/api';
import { Navbar } from '@/app/components/Navbar';
import { useAuthStore } from '@/app/lib/auth-store';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { RecipeGridSkeleton, RecipeListPageSkeleton } from '@/app/components/Skeletons';

export default function MyRecipesPage() {
  const router = useRouter();
  const { initAuth, user } = useAuthStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (user?.id) {
      fetchUserRecipes();
    }
  }, [user?.id]);

  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getAllRecipes();
      // Filter recipes where recipe owner's ID matches the logged-in user's ID
      const filtered = response.data.filter(
        (recipe: Recipe) => recipe.user?.id === user?.id
      );
      setRecipes(filtered);
      setError('');
    } catch (err: any) {
      setError('Failed to load your recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await recipeAPI.deleteRecipe(deleteConfirmId);
      setRecipes((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete recipe', err);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  return (
    <ProtectedRoute fallback={<RecipeListPageSkeleton />}>
      <main className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <Link
            href="/recipes"
            className="text-primary font-bold hover:underline mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Recipes
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-dark flex items-center gap-2">
                <ChefHat className="text-primary" size={36} /> My Recipes
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and update recipes you have contributed.
              </p>
            </div>
            <Link
              href="/recipes/new"
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition flex items-center gap-2 shadow-sm text-center"
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
            <RecipeGridSkeleton />
          ) : recipes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-xl mx-auto border border-gray-100">
              <ChefHat size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dark mb-2">No recipes yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't added any recipes to RecipeFlow. Share your first culinary masterpiece!
              </p>
              <Link
                href="/recipes/new"
                className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition shadow-sm"
              >
                Create Recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between border border-gray-100/50"
                >
                  <div>
                    <div className="relative w-full h-48 bg-gray-200">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 text-xs bg-primary text-white px-2.5 py-1 rounded-full font-semibold shadow-sm">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-dark mb-2 line-clamp-1">
                        {recipe.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <Clock size={14} className="text-primary" />
                        <span>{recipe.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-100 mt-auto flex gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="flex-1 py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center text-sm font-semibold text-gray-700 flex items-center justify-center gap-1.5"
                    >
                      <Eye size={16} /> View
                    </Link>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="flex-1 py-2 px-3 bg-primary text-white rounded-lg hover:brightness-95 transition text-center text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Edit size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(recipe.id)}
                      className="py-2 px-3 bg-secondary text-white rounded-lg hover:brightness-95 transition text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 text-secondary mb-4">
                  <Trash2 size={28} />
                  <h3 className="text-xl font-bold text-dark">Delete Recipe?</h3>
                </div>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Are you sure you want to delete this recipe? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:brightness-95 transition-all shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </ProtectedRoute>
  );
}
