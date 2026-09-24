'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CONTENT, SupportedLanguage } from '@/data/content';
import LotusWorld from '@/components/LotusWorld';
import Header from '@/components/Header';
import HeroSequence from '@/components/HeroSequence';
import AboutSection from '@/components/AboutSection';
import WorkSection from '@/components/WorkSection';
import JourneySection from '@/components/JourneySection';
import MediaSection from '@/components/MediaSection';
import UpdatesSection from '@/components/UpdatesSection';
import ContactSection from '@/components/ContactSection';
import FooterPlayground from '@/components/FooterPlayground';
import UtilityBar from '@/components/UtilityBar';
import Modals from '@/components/Modals';

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [paused, setPaused] = useState(false);
  const [petalImage, setPetalImage] = useState<string>('');
  const [stagePercent, setStagePercent] = useState<number>(0);
  const [stageName, setStageName] = useState<string>('ROOTED');
  const [readProgress, setReadProgress] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    content: React.ReactNode;
  }>({
    isOpen: false,
    content: null,
  });

  const content = CONTENT[language];

  // Check user's preferred motion preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionMedia.matches) {
        setPaused(true);
      }
    }
  }, []);

  // Update body classes when paused/static changes
  useEffect(() => {
    if (paused) {
      document.body.classList.add('static');
    } else {
      document.body.classList.remove('static');
    }
  }, [paused]);

  // Heading word split and intersection reveal observer
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('seen');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const headings = document.querySelectorAll<HTMLElement>('main > section h2');
    headings.forEach((h) => {
      if (h.querySelector('.word')) return;
      const raw = h.innerText;
      h.setAttribute('aria-label', raw);

      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const nodes: Node[] = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach((n) => {
        const frag = document.createDocumentFragment();
        const textVal = n.textContent || '';
        textVal.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) {
            frag.append(document.createTextNode(w));
            return;
          }
          const span = document.createElement('span');
          span.className = 'word';
          span.setAttribute('aria-hidden', 'true');
          span.textContent = w;
          frag.append(span);
        });
        (n as ChildNode).replaceWith(frag);
      });

      io.observe(h);
    });

    return () => {
      headings.forEach((h) => io.unobserve(h));
    };
  }, [language]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleToggleMotion = () => {
    setPaused((prev) => !prev);
  };

  const handleProgressUpdate = useCallback(
    (read: number, stageP: number, stageN: string) => {
      setReadProgress(read);
      setStagePercent(stageP);
      setStageName(stageN);
    },
    []
  );

  const handleOpenPositions = () => {
    setDetailModal({
      isOpen: true,
      content: (
        <div>
          <h2>{content.pos_h}</h2>
          {content.pos.map((p, idx) => (
            <p key={idx}>
              <small>{p[0]}</small>
              <br />
              <strong>{p[1]}</strong>
              <br />
              {p[2]}
            </p>
          ))}
        </div>
      ),
    });
  };

  const handleOpenSources = () => {
    setDetailModal({
      isOpen: true,
      content: (
        <div>
          <h2>{language === 'en' ? 'Sources & public record' : 'स्रोत और अभिलेख'}</h2>
          <p>
            {language === 'en'
              ? 'The biographical content is retained from the supplied Nitin Nabin website. Its listed sources are linked below.'
              : 'जीवनी की सामग्री दी गई नितिन नवीन वेबसाइट से ली गई है। उसके स्रोत नीचे दिए गए हैं।'}
          </p>
          <ul>
            <li>
              <a
                href="https://nitin-nabin01.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Original website ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.bjp.org/shri-nitin-nabin"
                target="_blank"
                rel="noopener noreferrer"
              >
                BJP profile ↗
              </a>
            </li>
            <li>
              <a
                href="https://prsindia.org/mlatrack/nitin-nabin"
                target="_blank"
                rel="noopener noreferrer"
              >
                PRS Legislative Research ↗
              </a>
            </li>
            <li>
              <a
                href="https://ddnews.gov.in/en/nitin-nabin-takes-charge-as-bjp-national-president/"
                target="_blank"
                rel="noopener noreferrer"
              >
                DD News ↗
              </a>
            </li>
          </ul>
        </div>
      ),
    });
  };

  const handleOpenPhoto = (photo: string[]) => {
    setDetailModal({
      isOpen: true,
      content: (
        <div>
          <img src={`/images/${photo[2]}`} alt={photo[0]} />
          <h3>{photo[0]}</h3>
          <p>{photo[1]}</p>
        </div>
      ),
    });
  };

  const handleCloseDetail = () => {
    setDetailModal({ isOpen: false, content: null });
  };

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>

      {/* Three.js 3D WebGL Lotus Canvas */}
      <LotusWorld
        paused={paused}
        language={language}
        onPetalImageReady={setPetalImage}
        onProgressUpdate={handleProgressUpdate}
      />

      {/* Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Main Sections */}
      <main>
        <HeroSequence
          content={content}
          language={language}
          stagePercent={stagePercent}
          stageName={stageName}
        />

        <AboutSection content={content} language={language} />

        <WorkSection
          content={content}
          language={language}
          onOpenPositions={handleOpenPositions}
        />

        <JourneySection content={content} language={language} />

        <MediaSection
          content={content}
          language={language}
          onOpenPhoto={handleOpenPhoto}
        />

        <UpdatesSection content={content} language={language} />

        <ContactSection content={content} language={language} />

        <FooterPlayground
          content={content}
          language={language}
          petalImage={petalImage}
          onOpenSources={handleOpenSources}
        />
      </main>

      {/* Floating Bottom Utility Bar */}
      <UtilityBar
        paused={paused}
        language={language}
        readProgress={readProgress}
        onToggleMotion={handleToggleMotion}
      />

      {/* Modals & Dialogs */}
      <Modals
        isMenuOpen={isMenuOpen}
        onCloseMenu={() => setIsMenuOpen(false)}
        detailModal={detailModal}
        onCloseDetail={handleCloseDetail}
        content={content}
        language={language}
      />
    </>
  );
}
