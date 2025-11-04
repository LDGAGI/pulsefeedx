/**
 * 苹果风格间距系统
 * 基于8px网格系统
 */

export const SPACING = {
  // Section 垂直间距
  section: {
    sm: 'py-16 md:py-24',      // 小section (96-192px)
    md: 'py-24 md:py-32',      // 中等section (192-256px)
    lg: 'py-32 md:py-48',      // 大section (256-384px)
    xl: 'py-48 md:py-64',      // 超大section (384-512px)
  },

  // 容器最大宽度
  container: {
    narrow: 'max-w-3xl',       // 768px - 文字内容
    medium: 'max-w-5xl',       // 1024px - 功能卡片
    wide: 'max-w-7xl',         // 1280px - 全宽内容
    full: 'max-w-screen-2xl',  // 1536px - 超宽
  },

  // 元素间距 (gap)
  gap: {
    xs: 'gap-4',   // 16px
    sm: 'gap-6',   // 24px
    md: 'gap-8',   // 32px
    lg: 'gap-12',  // 48px
    xl: 'gap-16',  // 64px
  },

  // 文本间距
  text: {
    title: 'mb-6',         // 标题底部间距 24px
    subtitle: 'mb-4',      // 副标题底部间距 16px
    paragraph: 'mb-6',     // 段落底部间距 24px
  }
} as const;

export type SpacingSection = keyof typeof SPACING.section;
export type SpacingContainer = keyof typeof SPACING.container;
export type SpacingGap = keyof typeof SPACING.gap;
