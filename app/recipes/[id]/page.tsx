'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, ThumbsUp, ThumbsDown, Wrench, Utensils, Tag, List, ArrowLeft } from 'lucide-react';
import { Recipe } from '@/app/components/RecipeCard';
import { recipeAPI } from '@/app/lib/api';
import { Navbar } from '@/app/components/Navbar';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getRecipeById(parseInt(recipeId));
      setRecipe(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!recipe) return;
    try {
      const updated = await recipeAPI.likeRecipe(recipe.id);
      setRecipe(updated.data);
      setIsLiked(!isLiked);
      setIsDisliked(false);
    } catch (err) {
      console.error('Failed to like recipe', err);
    }
  };

  const handleDislike = async () => {
    if (!recipe) return;
    try {
      const updated = await recipeAPI.dislikeRecipe(recipe.id);
      setRecipe(updated.data);
      setIsDisliked(!isDisliked);
      setIsLiked(false);
    } catch (err) {
      console.error('Failed to dislike recipe', err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl text-gray-600">Loading recipe...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error || !recipe) {
    return (
      <ProtectedRoute>
        <main>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-red-600 mb-4">{error || 'Recipe not found'}</p>
              <Link
                href="/recipes"
                className="text-primary font-bold hover:underline"
              >
                Back to Recipes
              </Link>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  const username = recipe.user?.username ?? 'Unknown cook';

  return (
    <ProtectedRoute>
      <main>
        <Navbar />
        <div className="min-h-screen bg-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
              href="/recipes"
              className="text-primary font-bold hover:underline mb-6 inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Back to Recipes
            </Link>

            <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-96 bg-gray-200">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-dark mb-2">
                      {recipe.name}
                    </h1>
                    <p className="text-gray-600">by {username}</p>
                  </div>
                  <span className="text-lg bg-primary text-white px-4 py-2 rounded">
                    {recipe.category}
                  </span>
                </div>

                <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-light p-4 rounded text-center flex flex-col items-center">
                    <Clock className="text-primary mb-2" size={28} />
                    <p className="text-gray-600">{recipe.time}</p>
                  </div>
                  <div className="bg-light p-4 rounded text-center flex flex-col items-center">
                    <Eye className="text-secondary mb-2" size={28} />
                    <p className="text-gray-600">{recipe.views} views</p>
                  </div>
                  <div className="bg-light p-4 rounded text-center flex flex-col items-center">
                    <ThumbsUp className="text-primary mb-2" size={28} />
                    <p className="text-gray-600">{recipe.likes} likes</p>
                  </div>
                  <div className="bg-light p-4 rounded text-center flex flex-col items-center">
                    <ThumbsDown className="text-secondary mb-2" size={28} />
                    <p className="text-gray-600">{recipe.dislikes} dislikes</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleLike}
                    className={`px-6 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                      isLiked
                        ? 'bg-primary text-white'
                        : 'bg-light text-gray-700 hover:brightness-90'
                    }`}
                  >
                    <ThumbsUp size={18} /> Like
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`px-6 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                      isDisliked
                        ? 'bg-secondary text-white'
                        : 'bg-light text-gray-700 hover:brightness-90'
                    }`}
                  >
                    <ThumbsDown size={18} /> Dislike
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                      <Wrench className="text-primary" size={24} /> Equipments
                    </h2>
                    <ul className="space-y-2">
                      {recipe.equipments.map((equipment, idx) => (
                        <li key={idx} className="text-gray-700">
                          • {equipment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                      <Utensils className="text-primary" size={24} /> Ingredients
                    </h2>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-gray-700">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                      <Tag className="text-primary" size={24} /> Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-secondary text-white px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                    <List className="text-primary" size={24} /> Instructions
                  </h2>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="font-bold text-primary text-lg">
                          {idx + 1}.
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
