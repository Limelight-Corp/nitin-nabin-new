'use client';

import React, { useState } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface WorkSectionProps {
  content: ContentData;
  language: SupportedLanguage;
  onOpenPositions: () => void;
}

export default function WorkSection({
  content,
  language,
  onOpenPositions,
}: WorkSectionProps) {
  const [expandedWork, setExpandedWork] = useState<number | null>(null);

  const toggleWork = (index: number) => {
    setExpandedWork((prev) => (prev === index ? null : index));
  };

  return (
    <section id="work" className="brown">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en'
            ? 'Different fields. One public journey.'
            : 'अलग क्षेत्र। एक सार्वजनिक यात्रा।'}
        </span>
        <span>02 / 06</span>
      </div>

      <h2 className="split-heading display">
        <span>{language === 'en' ? 'FOUR FIELDS' : 'चार क्षेत्र'}</span>
        <span className="burst-mark" aria-hidden="true">
          ✳
        </span>
        <span>{language === 'en' ? 'OF WORK.' : 'कार्य के।'}</span>
      </h2>

      <div id="work-cards" className="work-grid">
        {content.four.map((w, i) => (
          <article key={i} className="work-card">
            <button
              aria-expanded={expandedWork === i}
              data-work={i}
              onClick={() => toggleWork(i)}
            >
              <div className="work-art">
                <img
                  src={`/images/albums/album-${i + 1}.jpg`}
                  alt=""
                  loading="lazy"
                />
                <b>0{i + 1}</b>
              </div>
              <h3>{w[1]}</h3>
              <div className="card-bottom">
                <span>{w[0]}</span>
                <span>{expandedWork === i ? '−' : '＋'}</span>
              </div>
            </button>
            <p className="detail" hidden={expandedWork !== i}>
              {w[2]}
            </p>
          </article>
        ))}
      </div>

      <button
        id="positions"
        className="oval light"
        onClick={onOpenPositions}
      >
        {language === 'en' ? 'All positions held ↗' : 'सभी पद और दायित्व ↗'}
      </button>
    </section>
  );
}
