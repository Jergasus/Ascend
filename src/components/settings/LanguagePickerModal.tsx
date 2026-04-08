"use client";

import { X, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/lib/translations";

const languageCodes: Record<Language, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "PT",
  it: "IT",
  ja: "JA",
  ko: "KO",
  zh: "ZH",
};

interface LanguagePickerModalProps {
  onClose: () => void;
  isClosing: boolean;
}

const languages: Language[] = ["en", "es", "fr", "de", "pt", "it", "ja", "ko", "zh"];

export default function LanguagePickerModal({
  onClose,
  isClosing,
}: LanguagePickerModalProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-md sm:bg-black/70 sm:backdrop-blur-sm sm:pt-0 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`w-full h-full sm:h-auto sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-3xl p-6 sm:p-8 max-w-lg sm:shadow-2xl flex flex-col justify-center ${
          isClosing ? "animate-scaleOut" : "animate-scaleIn"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">{t.selectLanguage}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={28} />
          </button>
        </div>

        {/* Language Grid - 2 columns */}
        <div className="grid grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelectLanguage(lang)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${
                language === lang
                  ? "bg-white/20 ring-2 ring-white/40"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {language === lang && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <span className="text-2xl font-bold text-white">{languageCodes[lang]}</span>
              <span className="text-white/60 font-medium text-xs text-center">
                {languageNames[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
