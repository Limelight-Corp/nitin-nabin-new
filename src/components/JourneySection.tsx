'use client';

import React, { useState } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface JourneySectionProps {
  content: ContentData;
  language: SupportedLanguage;
}

export default function JourneySection({ content, language }: JourneySectionProps) {
  // Default to year index 9 as in the original prototype
  const [year, setYear] = useState(9);

  const list = content.jr;
  const current = list[year] || list[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      let nextIndex = index;
      if (e.key === 'Home') nextIndex = 0;
      else if (e.key === 'End') nextIndex = list.length - 1;
      else if (e.key === 'ArrowRight') nextIndex = (year + 1) % list.length;
      else if (e.key === 'ArrowLeft') nextIndex = (year - 1 + list.length) % list.length;

      setYear(nextIndex);
      const nextTab = document.getElementById(`tab-${nextIndex}`);
      nextTab?.focus();
    }
  };

  return (
    <section id="journey" className="cream">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en'
            ? 'Every year, another chapter'
            : 'हर वर्ष, एक नया अध्याय'}
        </span>
        <span>03 / 06</span>
      </div>

      <h2
        className="display"
        dangerouslySetInnerHTML={{
          __html:
            language === 'en'
              ? 'TWENTY YEARS.<br>STILL UNFOLDING.'
              : 'बीस वर्ष।<br>यात्रा जारी है।',
        }}
      />

      <div id="years" role="tablist" aria-label="Journey year">
        {list.map((x, i) => (
          <button
            key={i}
            role="tab"
            id={`tab-${i}`}
            aria-controls="year-card"
            aria-selected={i === year}
            tabIndex={i === year ? 0 : -1}
            data-year={i}
            onClick={() => setYear(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {x[0]}
          </button>
        ))}
      </div>

      <article
        id="year-card"
        aria-live="polite"
        role="tabpanel"
        aria-labelledby={`tab-${year}`}
      >
        <div className="year-visual">
          <img src="/images/portrait-cutout.png" alt="Nitin Nabin" />
          <div className="year">{current[0]}</div>
        </div>
        <div>
          <small>
            {current[1]} · {current[3]}
          </small>
          <h3>{current[2]}</h3>
          <p>{current[4]}</p>
          <p>
            <small>{current[5]}</small>
          </p>
        </div>
      </article>

      <div className="slider-controls">
        <button
          id="prev-year"
          aria-label="Previous year"
          disabled={year === 0}
          onClick={() => setYear((y) => Math.max(0, y - 1))}
        >
          ←
        </button>
        <span id="year-count">
          {String(year + 1).padStart(2, '0')} / {list.length}
        </span>
        <button
          id="next-year"
          aria-label="Next year"
          disabled={year === list.length - 1}
          onClick={() => setYear((y) => Math.min(list.length - 1, y + 1))}
        >
          →
        </button>
      </div>
    </section>
  );
}
