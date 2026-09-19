'use client';

import React, { useState } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface AboutSectionProps {
  content: ContentData;
  language: SupportedLanguage;
}

export default function AboutSection({ content, language }: AboutSectionProps) {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <section id="about" className="about cream">
      <div className="section-top">
        <span className="handwritten">
          {language === 'en'
            ? 'The person behind the journey'
            : 'यात्रा के पीछे का व्यक्तित्व'}
        </span>
        <span>01 / 06</span>
      </div>

      <h2 className="statement display">
        {language === 'en'
          ? 'A LIFE IN PUBLIC SERVICE. SHAPED BY PEOPLE. ROOTED IN TRUST.'
          : 'जनसेवा का जीवन। लोगों से जुड़ा। विश्वास में निहित।'}
      </h2>

      <div className="about-grid">
        <figure>
          <img src="/images/portrait-cutout.png" alt="Nitin Nabin" />
          <figcaption className="handwritten">{content.role}</figcaption>
        </figure>

        <div>
          <p className="bio-lead">{content.bio[0]}</p>

          <div className="bio-extra" hidden={!showFullBio}>
            {content.bio.slice(1).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <button
            id="bio-toggle"
            className="oval"
            onClick={() => setShowFullBio((prev) => !prev)}
          >
            {!showFullBio
              ? language === 'en'
                ? 'Read the full story +'
                : 'पूरी कहानी पढ़ें +'
              : language === 'en'
              ? 'Show less −'
              : 'कम दिखाएँ −'}
          </button>

          <dl id="facts">
            {content.facts.map((fact, index) => (
              <div key={index}>
                <dt>{fact[0]}</dt>
                <dd>{fact[1]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
