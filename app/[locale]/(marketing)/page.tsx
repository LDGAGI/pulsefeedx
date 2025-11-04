import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { Features } from "@/components/features";
import { ProblemSection } from "@/components/problem-section";
import { DemoSection } from "@/components/demo-section";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import type { Locale } from "@/i18n.config";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' });

  return generatePageMetadata({
    locale,
    path: '',
    title: t('title'),
    description: t('description'),
  });
}

export default function Home() {
  console.log('[locale]/(marketing)/page rendered');
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden ">
        <Background />
      </div>
      <Container className="flex min-h-screen flex-col items-center justify-between ">
        <Hero />
        <ProblemSection />
        <Features />
        <DemoSection />
        <Testimonials />
      </Container>
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}
