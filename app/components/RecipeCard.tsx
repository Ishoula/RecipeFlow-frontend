"use client";

import { Clock } from 'lucide-react';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  time: string;
  category: string;
  equipments: string[];
  ingredients: string[];
  instructions: string[];
  tags: string[];
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  user: {
    id: number;
    username: string;
  } | null;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClickRecipe?: (id: number) => void;
}

export function RecipeCard({ recipe, onClickRecipe }: RecipeCardProps) {
  const username = recipe.user?.username ?? 'Unknown cook';

  return (
    <div
      onClick={() => onClickRecipe?.(recipe.id)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
    >
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-dark">{recipe.name}</h3>
          <span className="text-xs bg-primary text-white px-2 py-1 rounded">
            {recipe.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Clock size={14} /> {recipe.time}</span>
          <span>by {username}</span>
        </div>
        
      </div>
    </div>
  );
}
