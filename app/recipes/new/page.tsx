'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { InputField, TextArea, TagInput } from '@/app/components/FormFields';
import { recipeAPI } from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/auth-store';
import { Navbar } from '@/app/components/Navbar';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { RecipeFormSkeleton } from '@/app/components/Skeletons';

const MAX_VARCHAR_LENGTH = 255;

export default function NewRecipePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    time: '',
    category: 'Breakfast',
    equipments: [] as string[],
    ingredients: [] as string[],
    instructions: [] as string[],
    tags: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAddTag = (field: string, tag: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field as keyof typeof formData], tag] as any,
    }));
  };

  const handleRemoveTag = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof formData] as any).filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const tooLong = (value: string) => value.length > MAX_VARCHAR_LENGTH;
    const hasTooLongItem = (values: string[]) =>
      values.some((value) => tooLong(value));

    if (!formData.name) newErrors.name = 'Recipe name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.imageUrl) newErrors.imageUrl = 'Image URL is required';
    if (!formData.time) newErrors.time = 'Cooking time is required';
    if (tooLong(formData.name))
      newErrors.name = `Recipe name must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (tooLong(formData.description))
      newErrors.description = `Description must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (tooLong(formData.imageUrl))
      newErrors.imageUrl = `Image URL must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (tooLong(formData.time))
      newErrors.time = `Cooking time must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (formData.equipments.length === 0)
      newErrors.equipments = 'Add at least one equipment';
    if (hasTooLongItem(formData.equipments))
      newErrors.equipments = `Each equipment must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (formData.ingredients.length === 0)
      newErrors.ingredients = 'Add at least one ingredient';
    if (hasTooLongItem(formData.ingredients))
      newErrors.ingredients = `Each ingredient must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (formData.instructions.length === 0)
      newErrors.instructions = 'Add at least one instruction';
    if (hasTooLongItem(formData.instructions))
      newErrors.instructions = `Each instruction must be ${MAX_VARCHAR_LENGTH} characters or less`;
    if (formData.tags.length === 0) newErrors.tags = 'Add at least one tag';
    if (hasTooLongItem(formData.tags))
      newErrors.tags = `Each tag must be ${MAX_VARCHAR_LENGTH} characters or less`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (!user?.id) {
        setErrors({ submit: 'You must be logged in to create a recipe' });
        return;
      }

      await recipeAPI.addRecipe(formData);
      router.push('/recipes');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create recipe',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute fallback={<RecipeFormSkeleton />}>
      <main>
        <Navbar />
        <div className="min-h-screen bg-light">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
              href="/recipes"
              className="text-primary font-bold hover:underline mb-6 inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Back to Recipes
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-dark mb-8">Create New Recipe</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Recipe Name"
                  placeholder="e.g., Chocolate Chip Cookies"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  error={errors.name}
                  maxLength={MAX_VARCHAR_LENGTH}
                  required
                />

                <TextArea
                  label="Description"
                  placeholder="Describe your recipe..."
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  error={errors.description}
                  maxLength={MAX_VARCHAR_LENGTH}
                  required
                />

                <InputField
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(value) => handleInputChange('imageUrl', value)}
                  error={errors.imageUrl}
                  maxLength={MAX_VARCHAR_LENGTH}
                  required
                />

                <InputField
                  label="Cooking Time"
                  placeholder="e.g., 30 minutes"
                  value={formData.time}
                  onChange={(value) => handleInputChange('time', value)}
                  error={errors.time}
                  maxLength={MAX_VARCHAR_LENGTH}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Dessert</option>
                    <option>Snack</option>
                    <option>Beverage</option>
                  </select>
                </div>

                <TagInput
                  label="Equipments"
                  tags={formData.equipments}
                  onAddTag={(tag) => handleAddTag('equipments', tag)}
                  onRemoveTag={(idx) => handleRemoveTag('equipments', idx)}
                  placeholder="e.g., Oven, Blender (press Enter to add)"
                  maxLength={MAX_VARCHAR_LENGTH}
                />
                {errors.equipments && (
                  <p className="text-red-500 text-xs">{errors.equipments}</p>
                )}

                <TagInput
                  label="Ingredients"
                  tags={formData.ingredients}
                  onAddTag={(tag) => handleAddTag('ingredients', tag)}
                  onRemoveTag={(idx) => handleRemoveTag('ingredients', idx)}
                  placeholder="e.g., 2 cups flour (press Enter to add)"
                  maxLength={MAX_VARCHAR_LENGTH}
                />
                {errors.ingredients && (
                  <p className="text-red-500 text-xs">{errors.ingredients}</p>
                )}

                <TagInput
                  label="Instructions"
                  tags={formData.instructions}
                  onAddTag={(tag) => handleAddTag('instructions', tag)}
                  onRemoveTag={(idx) => handleRemoveTag('instructions', idx)}
                  placeholder="e.g., Mix all ingredients (press Enter to add)"
                  maxLength={MAX_VARCHAR_LENGTH}
                />
                {errors.instructions && (
                  <p className="text-red-500 text-xs">{errors.instructions}</p>
                )}

                <TagInput
                  label="Tags"
                  tags={formData.tags}
                  onAddTag={(tag) => handleAddTag('tags', tag)}
                  onRemoveTag={(idx) => handleRemoveTag('tags', idx)}
                  placeholder="e.g., Vegan, Gluten-free (press Enter to add)"
                  maxLength={MAX_VARCHAR_LENGTH}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs">{errors.tags}</p>
                )}

                {errors.submit && (
                  <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700">
                    {errors.submit}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Recipe'}
                  </button>
                  <Link
                    href="/recipes"
                    className="flex-1 py-3 bg-gray-300 text-dark font-bold rounded-lg hover:bg-gray-400 transition text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
