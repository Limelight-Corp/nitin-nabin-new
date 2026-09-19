'use client';

import React from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface MediaSectionProps {
  content: ContentData;
  language: SupportedLanguage;
  onOpenPhoto: (photo: string[]) => void;
}

export default function MediaSection({
  content,
  language,
  onOpenPhoto,
}: MediaSectionProps) {
  return (
    <section id="media" className="cream">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en' ? 'Moments along the way' : 'राह के कुछ पल'}
        </span>
        <span>04 / 06</span>
      </div>

      <div className="media-heading">
        <h2
          className="display"
          dangerouslySetInnerHTML={{
            __html:
              language === 'en'
                ? 'THE JOURNEY.<br>IN PICTURES.'
                : 'यात्रा।<br>तस्वीरों में।',
          }}
        />
        <p>
          {language === 'en'
            ? 'A photo record of public engagements, organisational work and people met along the way.'
            : 'सार्वजनिक कार्यक्रमों, संगठनात्मक कार्य और लोगों से मुलाकातों का चित्र संग्रह।'}
        </p>
      </div>

      <div id="gallery">
        {content.gal.map((g, i) => (
          <button
            key={i}
            data-photo={i}
            aria-label={g[0]}
            onClick={() => onOpenPhoto(g)}
          >
            <img src={`/images/${g[2]}`} alt={g[0]} loading="lazy" />
            <span>{g[0]}</span>
            <small>{g[1]}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
