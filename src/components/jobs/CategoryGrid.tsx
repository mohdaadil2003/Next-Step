"use client";

import CategoryCard from "./CategoryCard";
import { CATEGORIES } from "@/lib/constants";

interface CategoryGridProps {
  jobCounts?: Record<string, number>;
  activeCategory?: string;
  onCategoryClick?: (name: string) => void;
}

export default function CategoryGrid({ jobCounts = {}, activeCategory, onCategoryClick }: CategoryGridProps) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(138px, 1fr))" }}>
      {CATEGORIES.map((cat) => (
        <CategoryCard
          key={cat.name}
          category={cat}
          count={jobCounts[cat.name] || 0}
          isActive={activeCategory === cat.name}
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
}
