"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from 'next-intl';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createClient } from "@/lib/supabase/client";
import Password from "@/components/password";
import { FormShell } from "@/features/forms/components/form-shell";
import { FormTextField } from "@/features/forms/components/form-text-field";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";
import { SignupInput, signupSchema } from "@/features/auth/schemas";

export function SignupForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth.signup');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupInput) {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message || t('errors.signupFailed'));
        return;
      }

      // Supabase 会自动发送验证邮件
      // 跳转到邮箱验证提示页面
      router.push(`/${locale}/check-email`);
    } catch (err) {
      setError(t('errors.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message || t('errors.googleSignupFailed'));
        setIsLoading(false);
      }
      // Note: Don't set isLoading to false here as the page will redirect
    } catch (err) {
      setError(t('errors.googleSignupFailed'));
      setIsLoading(false);
    }
  }

  return (
    <FormShell<SignupInput>
      form={form}
      title={t('title')}
      onSubmit={onSubmit}
      submitText={t('signUpButton')}
      submitLoadingText={t('signingUp')}
      isLoading={isLoading}
      error={error}
      footer={
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('hasAccount')}{" "}
          <Link href={`/${locale}/login`} className="text-foreground hover:underline">
            {t('signInLink')}
          </Link>
        </p>
      }
      socialSlot={<SocialAuthButtons onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />}
    >
      <FormTextField
        control={form.control}
        name="name"
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        autoComplete="name"
      />
      <FormTextField
        control={form.control}
        name="email"
        type="email"
        label={t('emailLabel')}
        placeholder={t('emailPlaceholder')}
        autoComplete="email"
      />
      <FormTextField
        control={form.control}
        name="password"
        label={t('passwordLabel')}
        placeholder={t('passwordPlaceholder')}
        component={Password}
        autoComplete="new-password"
      />
    </FormShell>
  );
}
