import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement.focus();
    }

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const overlayVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants: any = {
    hidden: { scale: 0.95, opacity: 0, y: 10 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: 'spring', duration: 0.4 },
    },
    exit: { scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            className="modal-overlay-bg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            style={{ position: 'absolute', inset: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            className="modal-container"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
