"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";
import Image from 'next/image'
import qrCodeImage from '@/assets/imgs/qr-code.jpg'

export function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Donate"
        title="Donate"
        className="h-9 rounded-md flex items-center gap-1.5 px-2.5 text-[13px] font-medium text-[var(--text-meta)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-all"
      >
        <Coffee className="h-4 w-4" />
        <span>Donate</span>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm bg-surface border border-borders rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-borders bg-surface/95 backdrop-blur">
                  <h2 className="font-serif text-lg font-semibold text-text">
                    Apoie o Projeto
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Fechar"
                    className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-meta)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5 text-center">
                  <p className="text-sm text-muted font-body leading-relaxed">
                    Se você gosta do projeto e quer apoiar, considere fazer um
                    PIX. Sua contribuição ajuda a manter os servidores e
                    melhorar a ferramenta!
                  </p>

                  <div className="inline-flex items-center justify-center w-48 h-48 bg-white rounded-xl p-3 mx-auto border border-borders">
                    <Image src={qrCodeImage} alt="PIX" className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
