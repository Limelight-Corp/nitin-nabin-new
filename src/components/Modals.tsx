'use client';

import React, { useEffect, useRef } from 'react';
import { ContentData, SupportedLanguage } from '@/data/content';

interface ModalsProps {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  detailModal: {
    isOpen: boolean;
    title?: string;
    content: React.ReactNode;
  };
  onCloseDetail: () => void;
  content: ContentData;
  language: SupportedLanguage;
}

export default function Modals({
  isMenuOpen,
  onCloseMenu,
  detailModal,
  onCloseDetail,
  content,
  language,
}: ModalsProps) {
  const menuRef = useRef<HTMLDialogElement>(null);
  const detailRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (isMenuOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isMenuOpen && dialog.open) {
      dialog.close();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const dialog = detailRef.current;
    if (!dialog) return;
    if (detailModal.isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!detailModal.isOpen && dialog.open) {
      dialog.close();
    }
  }, [detailModal.isOpen]);

  const navItems = [
    { id: 'home', label: content.n_home },
    { id: 'about', label: content.n_about },
    { id: 'work', label: content.n_work },
    { id: 'journey', label: content.n_journey },
    { id: 'media', label: content.n_media },
    { id: 'updates', label: content.n_updates },
    { id: 'contact', label: content.n_contact },
  ];

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDialogElement>,
    closeFn: () => void
  ) => {
    const dialog = e.currentTarget;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      closeFn();
    }
  };

  return (
    <>
      <dialog
        id="menu"
        ref={menuRef}
        onClick={(e) => handleBackdropClick(e, onCloseMenu)}
        onCancel={onCloseMenu}
      >
        <button
          className="close"
          aria-label="Close menu"
          onClick={onCloseMenu}
        >
          CLOSE ✕
        </button>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onCloseMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className="handwritten">Nitin Nabin · A life in bloom</p>
      </dialog>

      <dialog
        id="detail"
        ref={detailRef}
        onClick={(e) => handleBackdropClick(e, onCloseDetail)}
        onCancel={onCloseDetail}
      >
        <button
          className="close"
          aria-label="Close details"
          onClick={onCloseDetail}
        >
          ✕
        </button>
        <div id="detail-content">{detailModal.content}</div>
      </dialog>
    </>
  );
}
