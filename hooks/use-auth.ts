'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const useAuth = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
      setIsLoggingOut(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = await createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleLoginWithEmail = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      setError(error.message)
    } else {
      toast.success('Succesfully login! Redirecting to dashboard...')
      router.push('/dashboard')
      setError(null)
    }
  }

  const handleRegisterWithEmail = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {

    const supabase = createClient();

    const register = supabase.auth.signUp({
      email,
      password  
    });

    const { error } = await register;

    if (error) {
      toast.error(error.message);
      setError(error.message);
    }else{
      toast.success('Registered successfully! Redirecting to login...');
      router.push('/login');
      setError(null);
    }
  }

  return {
    handleLogout,
    isLoggingOut,
    handleGoogleLogin,
    handleLoginWithEmail,
    handleRegisterWithEmail,
    error,
  }
}
