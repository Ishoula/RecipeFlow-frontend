'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, ThumbsUp, ThumbsDown, Wrench, Utensils, Tag, List, ArrowLeft, MessageSquare } from 'lucide-react';
import { Recipe } from '@/app/components/RecipeCard';
import { recipeAPI } from '@/app/lib/api';
import { Navbar } from '@/app/components/Navbar';
import { useAuthStore } from '@/app/lib/auth-store';

interface CommentItem {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  const { initAuth, user } = useAuthStore();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  useEffect(() => {
    if (!recipeId) return;
    const storedComments = localStorage.getItem(`recipe_comments_${recipeId}`);
    if (storedComments) {
      setCommentsList(JSON.parse(storedComments));
    } else if (recipe && recipe.comments > 0) {
      const mocks: CommentItem[] = [];
      const mockTexts = [
        "This recipe is absolutely amazing! Made it for my family and they loved it.",
        "Super easy to follow. I replaced one ingredient with what I had in the pantry and it still tasted great!",
        "Can't wait to try this tonight. The instructions are very clear.",
        "Absolutely delicious! 10/10 would recommend.",
        "Does anyone know if I can make this ahead of time and reheat it?",
      ];
      const mockUsers = ["chef_maria", "foodie_john", "healthy_cook", "sweet_tooth", "kitchen_novice"];
      
      for (let i = 0; i < Math.min(recipe.comments, 5); i++) {
        mocks.push({
          id: `mock-${i}`,
          username: mockUsers[i % mockUsers.length],
          text: mockTexts[i % mockTexts.length],
          createdAt: new Date(Date.now() - (i + 1) * 3600000 * 2).toISOString(),
        });
      }
      setCommentsList(mocks);
      localStorage.setItem(`recipe_comments_${recipeId}`, JSON.stringify(mocks));
    }
  }, [recipeId, recipe]);

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
      setRecipe(updated.data ?? { ...recipe, likes: recipe.likes + 1 });
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
      setRecipe(updated.data ?? { ...recipe, dislikes: recipe.dislikes + 1 });
      setIsDisliked(!isDisliked);
      setIsLiked(false);
    } catch (err) {
      console.error('Failed to dislike recipe', err);
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recipe) return;

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setCommentError('Please write a comment before submitting.');
      setCommentSuccess('');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError('');
      setCommentSuccess('');
      const updated = await recipeAPI.commentRecipe(recipe.id, {
        comment: trimmedComment,
      });

      const newCommentItem: CommentItem = {
        id: `user-${Date.now()}`,
        username: user?.username ?? 'Guest Cook',
        text: trimmedComment,
        createdAt: new Date().toISOString(),
      };
      const updatedCommentsList = [newCommentItem, ...commentsList];
      setCommentsList(updatedCommentsList);
      localStorage.setItem(`recipe_comments_${recipe.id}`, JSON.stringify(updatedCommentsList));

      setRecipe(updated.data ?? { ...recipe, comments: recipe.comments + 1 });
      setComment('');
      setCommentSuccess('Comment added.');
    } catch (err) {
      setCommentError('Failed to add comment');
      console.error('Failed to comment on recipe', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading recipe...</p>
        </div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
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
    );
  }

  const username = recipe.user?.username ?? 'Unknown cook';

  return (
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

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
                  <div className="bg-light p-4 rounded text-center flex flex-col items-center">
                    <MessageSquare className="text-primary mb-2" size={28} />
                    <p className="text-gray-600">{recipe.comments} comments</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
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

                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Leave a comment
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Share what you think about this recipe..."
                  />
                  {commentError && (
                    <p className="text-sm text-red-600 mt-2">{commentError}</p>
                  )}
                  {commentSuccess && (
                    <p className="text-sm text-primary mt-2">{commentSuccess}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="mt-3 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="mb-10 border-t border-gray-100 pt-6">
                  <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <MessageSquare className="text-primary" size={22} />
                    Comments ({commentsList.length})
                  </h3>
                  
                  {commentsList.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No comments yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="space-y-4">
                      {commentsList.map((c) => {
                        const firstLetter = c.username ? c.username.charAt(0).toUpperCase() : '?';
                        return (
                          <div 
                            key={c.id} 
                            className="bg-light p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                  {firstLetter}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-dark text-sm">{c.username}</h4>
                                  <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm pl-12 whitespace-pre-wrap leading-relaxed">{c.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
  );
}
