"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterModalProps {
  categories: string[];
  selectedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
  onClose: () => void;
  isClosing: boolean;
}

export default function FilterModal({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  onClose,
  isClosing,
}: FilterModalProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-md sm:bg-black/70 sm:backdrop-blur-sm pt-10 sm:pt-0 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`w-full h-full sm:h-auto sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-3xl p-6 sm:p-8 max-w-md sm:shadow-2xl flex flex-col justify-center ${
          isClosing ? "animate-scaleOut" : "animate-scaleIn"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">
            {t.filterByCategories}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={28} />
          </button>
        </div>

        {/* Categorías */}
        <div className="space-y-3 mb-6 py-4">
          {categories.length === 0 ? (
            <p className="text-white/60 text-center py-4">
              {t.noCategoriesAvailable}
            </p>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-transform duration-300 ease-out font-semibold transform hover:scale-105 min-h-[52px] shadow-md ${
                  selectedCategories.has(category)
                    ? "bg-white text-black"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-xl w-6 text-center flex-shrink-0">
                    {selectedCategories.has(category) ? "✓" : ""}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onClearFilters}
            disabled={selectedCategories.size === 0}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40 text-white font-bold py-4 rounded-xl transition-all border border-white/20 disabled:cursor-not-allowed"
          >
            {t.clearFilters}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            {t.apply}
          </button>
        </div>
      </div>
    </div>
  );
}
