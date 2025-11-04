"use client";

import React from "react";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import {
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineLightBulb
} from "react-icons/hi2";

export const Features = () => {
  const t = useTranslations('features');

  const features = [
    {
      key: 'realtime',
      title: t('items.realtime.title'),
      description: t('items.realtime.description'),
      icon: <HiOutlineBolt className="w-8 h-8 text-blue-500" />,
    },
    {
      key: 'aiFilter',
      title: t('items.aiFilter.title'),
      description: t('items.aiFilter.description'),
      icon: <HiOutlineSparkles className="w-8 h-8 text-blue-500" />,
    },
    {
      key: 'push',
      title: t('items.push.title'),
      description: t('items.push.description'),
      icon: <HiOutlinePaperAirplane className="w-8 h-8 text-blue-500" />,
    },
    {
      key: 'insight',
      title: t('items.insight.title'),
      description: t('items.insight.description'),
      icon: <HiOutlineLightBulb className="w-8 h-8 text-blue-500" />,
    },
  ];

  return (
    <div className="relative z-20 py-24 md:py-32 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative z-10">
        <Heading as="h2">{t('title')}</Heading>
        <Subheading className="text-center">
          {t('subtitle')}
        </Subheading>

        <div className="relative mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-blue-500/50 hover:bg-secondary/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
              >
                <div className="mb-6 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
