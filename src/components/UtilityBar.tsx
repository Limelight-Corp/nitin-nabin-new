'use client';

import React from 'react';
import { SupportedLanguage } from '@/data/content';

interface UtilityBarProps {
  paused: boolean;
  language: SupportedLanguage;
  readProgress: number;
  onToggleMotion: () => void;
}

export default function UtilityBar({
  paused,
  language,
  readProgress,
  onToggleMotion,
}: UtilityBarProps) {
  return (
    <div className="utility">
      <button
        id="motion"
        aria-pressed={paused}
        onClick={onToggleMotion}
      >
        {paused
          ? language === 'en'
            ? 'Resume motion ▷'
            : 'गति चालू करें ▷'
          : language === 'en'
          ? 'Pause motion Ⅱ'
          : 'गति रोकें Ⅱ'}
      </button>
      <span id="read-progress">
        {String(Math.min(100, Math.max(0, readProgress))).padStart(2, '0')}%
      </span>
    </div>
  );
}
