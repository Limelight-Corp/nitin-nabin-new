'use client';

import React, { useState } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface FooterPlaygroundProps {
  content: ContentData;
  language: SupportedLanguage;
  petalImage: string;
  onOpenSources: () => void;
}

export default function FooterPlayground({
  content,
  language,
  petalImage,
  onOpenSources,
}: FooterPlaygroundProps) {
  const [collected, setCollected] = useState<Set<number>>(new Set());

  const handleCollectPetal = (index: number) => {
    setCollected((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleReplay = () => {
    setCollected(new Set());
  };

  return (
    <footer id="playground" className="brown">
      <div className="footer-top">
        <div>
          <span className="handwritten">NITIN NABIN.</span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                language === 'en'
                  ? 'A public journey.<br>Always unfolding.'
                  : 'जनसेवा की यात्रा।<br>निरंतर आगे।',
            }}
          />
        </div>
        <nav aria-label="Footer">
          <a href="#home">{content.n_home}</a>
          <a href="#about">{content.n_about}</a>
          <a href="#work">{content.n_work}</a>
          <a href="#media">{content.n_media}</a>
          <a href="#contact">{content.n_contact}</a>
        </nav>
      </div>

      <div className="footer-record">
        <img
          src="/images/portrait-cutout.png"
          alt="Nitin Nabin"
          loading="lazy"
        />
        <div>
          <h2>{content.name}</h2>
          <p>
            {language === 'en'
              ? 'Public record, responsibilities and updates from a life in public service.'
              : 'जनसेवा के जीवन से सार्वजनिक अभिलेख, दायित्व और समाचार।'}
          </p>
        </div>
      </div>

      <div className="game" hidden={!petalImage}>
        <p className="handwritten">
          {language === 'en'
            ? 'A little moment to play — tap the floating petals.'
            : 'थोड़ा खेलें — तैरती पंखुड़ियों पर टैप करें।'}
        </p>
        <h2 className="display">NITIN NABIN</h2>

        <div id="petal-game" aria-label="Collect floating petals">
          {Array.from({ length: 6 }).map((_, i) => (
            <button
              key={i}
              data-petal={i}
              className={collected.has(i) ? 'collected' : ''}
              disabled={collected.has(i)}
              aria-label={`${
                language === 'en' ? 'Collect petal' : 'पंखुड़ी चुनें'
              } ${i + 1}`}
              onClick={() => handleCollectPetal(i)}
            >
              {petalImage ? <img src={petalImage} alt="" /> : null}
            </button>
          ))}
        </div>

        <output id="score" aria-live="polite">
          {language === 'en' ? 'PETALS ' : 'पंखुड़ियाँ '}
          {collected.size} / 6
        </output>

        <button
          id="replay"
          className="oval light"
          hidden={collected.size !== 6}
          onClick={handleReplay}
        >
          {language === 'en' ? 'Bloom again ↻' : 'फिर खिलाएँ ↻'}
        </button>
      </div>

      <div className="footer-bottom">
        <p>{content.f_copy}</p>
        <button id="sources" onClick={onOpenSources}>
          {language === 'en' ? 'Sources & record' : 'स्रोत और अभिलेख'}
        </button>
      </div>
    </footer>
  );
}
