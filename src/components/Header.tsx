'use client';

import React from 'react';
import { SupportedLanguage } from '@/data/content';

interface HeaderProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  onOpenMenu: () => void;
}

export default function Header({ language, onToggleLanguage, onOpenMenu }: HeaderProps) {
  return (
    <header>
      <a className="brand" href="#home" aria-label="Nitin Nabin home">
        N<span>N</span><i>✳</i>
      </a>
      <div className="nav-actions">
        <button
          id="lang"
          aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          onClick={onToggleLanguage}
        >
          {language === 'en' ? 'हिं' : 'EN'}
        </button>
        <button
          id="menu-open"
          aria-haspopup="dialog"
          aria-controls="menu"
          onClick={onOpenMenu}
        >
          MENU
        </button>
      </div>
    </header>
  );
}
