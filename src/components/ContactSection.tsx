'use client';

import React from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface ContactSectionProps {
  content: ContentData;
  language: SupportedLanguage;
}

export default function ContactSection({ content, language }: ContactSectionProps) {
  return (
    <section id="contact" className="cream">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en'
            ? 'The story continues with you'
            : 'आपके साथ यात्रा जारी है'}
        </span>
        <span>06 / 06</span>
      </div>

      <h2
        className="display"
        dangerouslySetInnerHTML={{
          __html:
            language === 'en'
              ? "LET'S STAY<br>CONNECTED."
              : 'आइए<br>जुड़े रहें।',
        }}
      />

      <img
        className="contact-portrait"
        src="/images/portrait-cutout.png"
        alt="Nitin Nabin"
        loading="lazy"
      />

      <div className="contact-bottom">
        <p>{content.ct_p}</p>
        <div className="social">
          <a href="https://x.com/NitinNabin" target="_blank" rel="noopener noreferrer">
            X / Twitter ↗
          </a>
          <a
            href="https://www.instagram.com/nitinnabinbjp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>
          <a
            href="https://www.facebook.com/NitinNabinBJP/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook ↗
          </a>
          <a
            href="https://www.youtube.com/@BJP4India"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube ↗
          </a>
        </div>
      </div>
    </section>
  );
}
