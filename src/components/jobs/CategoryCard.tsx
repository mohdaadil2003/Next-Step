"use client";

interface CategoryCardProps {
  category: { name: string; icon: string; bg: string };
  count?: number;
  isActive?: boolean;
  onClick?: (name: string) => void;
}

export default function CategoryCard({ category, count = 0, isActive, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => onClick?.(category.name)}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,102,194,0.1)] ${
        isActive
          ? "border-[#0A66C2] bg-[#E8F0FE] shadow-[0_4px_16px_rgba(10,102,194,0.15)]"
          : "border-[#D4E0F0] bg-white hover:border-[#0A66C2]"
      }`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2"
        style={{ backgroundColor: category.bg || "#E8F0FE" }}
      >
        <span>{category.icon}</span>
      </div>
      <span
        className={`text-xs font-semibold text-center leading-tight ${isActive ? "text-[#0A66C2]" : "text-[#0F1B2D]"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {category.name}
      </span>
      <span className="text-[11px] text-[#4A5A70] mt-1">{count} jobs</span>
    </button>
  );
}
