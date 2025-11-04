"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { HiOutlineBell } from "react-icons/hi2";

export const DemoSection = () => {
  const t = useTranslations('demoSection');

  return (
    <div className="relative py-24 md:py-32 min-h-[90vh] flex items-center overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl mx-auto leading-tight mb-16"
        >
          {t('title')}
        </motion.h2>

        {/* 场景演示 */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 开场白 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-center text-muted-foreground whitespace-pre-line"
          >
            {t('story.intro')}
          </motion.p>

          {/* 推文通知卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group p-8 rounded-2xl bg-blue-500/10 border-2 border-blue-500/40 hover:border-blue-500/60 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <HiOutlineBell className="w-7 h-7 text-blue-500 animate-pulse" />
              </div>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {t('story.notification')}
              </p>
            </div>
          </motion.div>

          {/* PulseFeedX 洞察 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center space-y-4"
          >
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('story.insight')}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {t('story.action')}
            </p>
          </motion.div>
        </div>

        {/* 总结句 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-xl md:text-2xl text-center max-w-3xl mx-auto font-medium text-foreground whitespace-pre-line"
        >
          {t('conclusion')}
        </motion.p>
      </div>
    </div>
  );
};
