'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import './login.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { handleGoogleLogin, handleLoginWithEmail, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    await handleLoginWithEmail(data)
  })

  return (
    <div className="animated-gradient flex min-h-screen items-center justify-center">
      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* Left Side - Login Form */}
          <Card className="border-border dark:bg-card/50 dark:border-sidebar-border/30 border bg-white shadow-lg">
            <div className="p-8 md:p-10">
              {/* Logo & Branding */}
              <div className="mb-8 flex items-center gap-3">
                <div className="from-primary to-accent flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-foreground text-2xl font-bold dark:text-white">
                    FocusDesk
                  </h1>
                  <p className="text-muted-foreground dark:text-muted-foreground text-xs">
                    Stay Productive
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-foreground text-2xl font-bold dark:text-white">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground dark:text-muted-foreground mt-2 text-sm">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground text-sm font-medium dark:text-white"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="border-border placeholder:text-muted-foreground dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                {errors.email?.message && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    {errors.email?.message}
                  </div>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground text-sm font-medium dark:text-white"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="border-border placeholder:text-muted-foreground dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                {errors.password?.message && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    {errors.password?.message}
                  </div>
                )}
                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="from-primary to-primary/80 w-full bg-linear-to-r py-6 text-base font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-border w-full border-t dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="text-muted-foreground dark:bg-card dark:text-muted-foreground bg-white px-2">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="border-border w-full py-6 text-base font-semibold dark:border-slate-700 dark:text-white dark:hover:bg-slate-900"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              {/* Sign Up Link */}
              <p className="text-muted-foreground dark:text-muted-foreground mt-6 text-center text-sm">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary dark:text-primary font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>

          {/* Right Side - Feature Highlight */}
          <div className="hidden flex-col gap-6 md:flex">
            <div className="space-y-2">
              <div className="from-primary to-accent inline-block rounded-lg bg-linear-to-r p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                AI-Powered Insights
              </h3>
              <p className="text-white/80 drop-shadow">
                Get intelligent task suggestions and productivity analytics
              </p>
            </div>

            <div className="space-y-2">
              <div className="from-accent to-primary inline-block rounded-lg bg-linear-to-r p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                Lightning Fast
              </h3>
              <p className="text-white/80 drop-shadow">
                Seamless experience with instant task management and updates
              </p>
            </div>

            <div className="space-y-2">
              <div className="from-primary to-accent inline-block rounded-lg bg-linear-to-r p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                Secure & Private
              </h3>
              <p className="text-white/80 drop-shadow">
                Your data is encrypted and protected with enterprise security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
