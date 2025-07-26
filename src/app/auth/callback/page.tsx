'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          alert('Authentication failed: ' + error.message)
          router.push('/')
          return
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/saved')
        } else {
          // No session found
          router.push('/')
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
        <p className="text-sm text-gray-600 mt-2">Please wait while we verify your authentication.</p>
      </div>
    </div>
  )
}