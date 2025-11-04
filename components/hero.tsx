"use client";

import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LocaleLink } from "@/components/locale-link";
import { useTranslations, useLocale } from 'next-intl';

export const Hero = () => {
  const router = useRouter();
  const t = useTranslations('hero');
  const locale = useLocale();
  return (
    <div className="flex flex-col min-h-screen py-32 md:py-48 relative overflow-hidden">
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.4,
        }}
        className="text-5xl md:text-7xl lg:text-9xl font-semibold max-w-6xl mx-auto text-center relative z-10"
      >
        {t('title')}
      </motion.h1>
      <motion.h2
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.4,
          delay: 0.1,
        }}
        className="text-center mt-4 text-lg md:text-2xl text-foreground max-w-3xl mx-auto relative z-10 font-medium"
      >
        {t('subtitle')}
      </motion.h2>
      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.4,
          delay: 0.2,
        }}
        className="text-center mt-6 text-base md:text-xl text-muted-foreground max-w-3xl mx-auto relative z-10 font-normal"
      >
        {t('description')}
      </motion.p>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.4,
          delay: 0.3,
        }}
        className="flex items-center gap-4 justify-center mt-6 relative z-10"
      >
        <Button
          as={LocaleLink}
          href={`/${locale}/demo/chat`}
          className="relative shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all duration-200"
        >
          {t('cta.primary')}
        </Button>
        <Button
          variant="simple"
          className="flex space-x-2 items-center group"
        >
          <span>{t('cta.secondary')}</span>
        </Button>
      </motion.div>
    </div>
  );
};
