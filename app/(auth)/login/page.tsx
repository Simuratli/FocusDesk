'use client'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const { handleGoogleLogin } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Giriş Yap</h1>
        <button
          onClick={handleGoogleLogin}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
        >
          🔵 Google ile Giriş Yap
        </button>
      </div>
    </div>
  )
}
