'use client';

import React from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface HeroSequenceProps {
  content: ContentData;
  language: SupportedLanguage;
  stagePercent: number;
  stageName: string;
}

export default function HeroSequence({
  content,
  language,
  stagePercent,
  stageName,
}: HeroSequenceProps) {
  return (
    <div id="sequence">
      <div className="scene-sticky">
        {/* Scene 1: Home */}
        <section id="home" className="scene scene-home">
          <div className="hero-role">{content.role}</div>
          <figure className="hero-portrait">
            <img
              src="/images/portrait-cutout.png"
              alt="Nitin Nabin"
              fetchPriority="high"
            />
          </figure>
          <h1
            className="display"
            dangerouslySetInnerHTML={{
              __html: language === 'en' ? 'NITIN<br>NABIN.' : 'नितिन<br>नबीन।',
            }}
          />
          <span
            className="hero-note handwritten"
            dangerouslySetInnerHTML={{
              __html:
                language === 'en'
                  ? 'Rooted in service.<br>Always growing.'
                  : 'सेवा से जुड़े।<br>निरंतर आगे बढ़ें।',
            }}
          />
          <div className="hero-facts handwritten">
            <span className="curve">⤵</span>
            <ul>
              <li>
                {language === 'en'
                  ? 'Twenty years in public life'
                  : 'सार्वजनिक जीवन के बीस वर्ष'}
              </li>
              <li>
                {language === 'en' ? 'Five Assembly terms' : 'पाँच विधानसभा कार्यकाल'}
              </li>
            </ul>
          </div>
          <div className="hero-description">
            <p>{content.hero_p}</p>
            <a className="oval" href="#about">
              {language === 'en' ? 'Discover the journey' : 'यात्रा को जानें'}
            </a>
          </div>
          <button
            id="drag-zone"
            aria-label="Drag to rotate the lotus. Click or press Enter to open its petals."
          />
          <div className="scroll-label handwritten">
            {language === 'en' ? 'Scroll to unfold ↓' : 'यात्रा देखने के लिए स्क्रॉल करें ↓'}
          </div>
        </section>

        {/* Scene 2: Roots */}
        <section className="scene scene-roots" aria-label="Public life">
          <h2 className="display">
            <span>{language === 'en' ? 'THE ROOTS' : 'जनसेवा'}</span>
            <span>{language === 'en' ? 'OF PUBLIC LIFE.' : 'की जड़ें।'}</span>
          </h2>
          <p>
            {language === 'en'
              ? 'From a Patna by-election to national responsibility. A public journey, one chapter at a time.'
              : 'पटना उपचुनाव से राष्ट्रीय दायित्व तक। जनसेवा की एक-एक कड़ी।'}
          </p>
          <div id="hero-stats">
            {content.stats.map((s, idx) => (
              <div key={idx}>
                <b>{s[0]}</b>
                <span>{s[1]}</span>
              </div>
            ))}
          </div>
          <div className="stage-meter handwritten">
            <span id="stage-percent">{String(stagePercent).padStart(3, '0')}</span>
            <span id="stage-name">{stageName}</span>
          </div>
        </section>

        {/* Scene 3: Bloom */}
        <section className="scene scene-bloom" aria-label="The lotus unfolds">
          <div className="bloom-copy">
            <h2
              className="display"
              dangerouslySetInnerHTML={{
                __html:
                  language === 'en'
                    ? 'A LIFE<br>IN BLOOM.'
                    : 'जनसेवा<br>का विस्तार।',
              }}
            />
            <p>
              {language === 'en'
                ? 'Constituency. Governance. Organisation. National responsibility.'
                : 'निर्वाचन क्षेत्र। शासन। संगठन। राष्ट्रीय दायित्व।'}
            </p>
            <a href="#work" className="oval">
              {language === 'en' ? 'Explore the work' : 'कार्य क्षेत्र देखें'}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
