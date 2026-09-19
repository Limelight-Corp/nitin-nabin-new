'use client';

import React, { useState } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface UpdatesSectionProps {
  content: ContentData;
  language: SupportedLanguage;
}

export default function UpdatesSection({ content, language }: UpdatesSectionProps) {
  const [updateIndex, setUpdateIndex] = useState(0);

  const list = content.upd;
  const current = list[updateIndex] || list[0];

  return (
    <section id="updates" className="brown">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en' ? 'From the public record' : 'सार्वजनिक अभिलेख से'}
        </span>
        <span>05 / 06</span>
      </div>

      <h2 className="display">
        {language === 'en' ? 'ON THE GROUND.' : 'जनता के बीच।'}
      </h2>

      <article id="update-card">
        <img
          src={`/images/${current[5]}`}
          alt={current[2]}
          loading="lazy"
        />
        <div>
          <small>
            {current[0]} · {current[1]}
          </small>
          <h3>{current[2]}</h3>
          <p>{current[3]}</p>
          <p>
            <small>{current[4]}</small>
          </p>
        </div>
      </article>

      <div className="slider-controls">
        <button
          id="prev-update"
          aria-label="Previous update"
          disabled={updateIndex === 0}
          onClick={() => setUpdateIndex((idx) => Math.max(0, idx - 1))}
        >
          ←
        </button>
        <span id="update-count">
          {String(updateIndex + 1).padStart(2, '0')} / {list.length}
        </span>
        <button
          id="next-update"
          aria-label="Next update"
          disabled={updateIndex === list.length - 1}
          onClick={() => setUpdateIndex((idx) => Math.min(list.length - 1, idx + 1))}
        >
          →
        </button>
      </div>
    </section>
  );
}
