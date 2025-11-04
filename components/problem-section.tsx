"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { HiXCircle } from "react-icons/hi2";

export const ProblemSection = () => {
  const t = useTranslations('problem');

  // 获取痛点列表
  const pains = [
    t('pains.0'),
    t('pains.1'),
    t('pains.2')
  ];

  return (
    <div className="relative py-24 md:py-32 min-h-[80vh] flex items-center overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl mx-auto leading-tight"
        >
          {t('title')}
        </motion.h2>

        {/* 痛点列表 */}
        <div className="mt-16 max-w-3xl mx-auto space-y-6">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex items-start gap-6 p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-red-500/50 hover:bg-secondary/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <HiXCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {pain}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 总结句 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-xl md:text-2xl text-center max-w-3xl mx-auto font-medium text-foreground"
        >
          {t('conclusion')}
        </motion.p>
      </div>
    </div>
  );
};
