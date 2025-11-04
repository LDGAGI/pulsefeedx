"use client";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export const Testimonials = () => {
  const t = useTranslations('manifesto');

  return (
    <div className="relative z-20 py-24 md:py-32 min-h-[70vh] flex items-center">
      {/* Background pulse animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Quote */}
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif font-light text-foreground/90 leading-relaxed whitespace-pre-line mb-8">
            "{t('quote')}"
          </blockquote>

          {/* Author */}
          <p className="text-lg md:text-xl text-muted-foreground">
            — {t('author')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};