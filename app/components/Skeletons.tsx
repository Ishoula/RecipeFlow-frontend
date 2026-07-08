import { ChefHat } from 'lucide-react';

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <ChefHat size={28} strokeWidth={2.5} />
            <SkeletonBlock className="h-6 w-32" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="h-10 w-28 rounded-lg" />
          </div>
          <SkeletonBlock className="h-8 w-8 rounded md:hidden" />
        </div>
      </div>
    </nav>
  );
}

export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-64 max-w-full" />
        <SkeletonBlock className="h-5 w-80 max-w-full" />
      </div>
      {action && <SkeletonBlock className="h-12 w-40 rounded-lg" />}
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <SkeletonBlock className="h-48 w-full rounded-none" />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="h-6 w-20" />
        </div>
        <div className="space-y-2 mb-4">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function RecipeListPageSkeleton() {
  return (
    <main className="min-h-screen bg-light">
      <NavbarSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeaderSkeleton />
        <RecipeGridSkeleton />
      </div>
    </main>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <main>
      <NavbarSkeleton />
      <div className="min-h-screen bg-light">
        <div className="max-w-full sm:max-w-lg lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <SkeletonBlock className="mb-6 h-5 w-36" />
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <SkeletonBlock className="h-96 w-full rounded-none" />
            <div className="p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <SkeletonBlock className="h-10 w-72 max-w-full" />
                  <SkeletonBlock className="h-5 w-28" />
                </div>
                <SkeletonBlock className="h-10 w-28" />
              </div>
              <div className="mb-8 space-y-2">
                <SkeletonBlock className="h-5 w-full" />
                <SkeletonBlock className="h-5 w-5/6" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-24 w-full" />
                ))}
              </div>
              <div className="mb-8 flex gap-4">
                <SkeletonBlock className="h-10 w-24 rounded-lg" />
                <SkeletonBlock className="h-10 w-28 rounded-lg" />
              </div>
              <SkeletonBlock className="mb-8 h-32 w-full rounded-lg" />
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <SkeletonBlock className="h-7 w-36" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-4/5" />
                    <SkeletonBlock className="h-4 w-3/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function RecipeFormSkeleton({ titleWidth = 'w-64' }: { titleWidth?: string }) {
  return (
    <main>
      <NavbarSkeleton />
      <div className="min-h-screen bg-light">
        <div className="max-w-full sm:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <SkeletonBlock className="mb-6 h-5 w-36" />
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <SkeletonBlock className={`mb-8 h-9 ${titleWidth}`} />
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="h-11 w-full rounded-lg" />
                </div>
              ))}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`tags-${index}`} className="space-y-2">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-11 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-7 w-20 rounded-full" />
                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <SkeletonBlock className="h-12 flex-1 rounded-lg" />
                <SkeletonBlock className="h-12 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AuthFormSkeleton() {
  return (
    <main>
      <NavbarSkeleton />
      <div className="min-h-screen bg-light flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <SkeletonBlock className="mx-auto mb-6 h-9 w-32" />
          <div className="space-y-4">
            <SkeletonBlock className="h-16 w-full rounded-lg" />
            <SkeletonBlock className="h-16 w-full rounded-lg" />
            <SkeletonBlock className="h-10 w-full rounded-lg" />
            <SkeletonBlock className="mx-auto h-5 w-56" />
          </div>
        </div>
      </div>
    </main>
  );
}
