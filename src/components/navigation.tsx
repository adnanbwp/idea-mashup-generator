'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const email = prompt('Enter your email:')
    if (email) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        alert('Error: ' + error.message)
      } else {
        alert('Check your email for the login link!')
      }
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error signing out: ' + error.message)
    }
  }
  
  const navItems = [
    {
      href: '/',
      label: 'Generate',
      isActive: pathname === '/'
    },
    {
      href: '/saved',
      label: 'Saved Ideas',
      isActive: pathname === '/saved'
    }
  ]
  
  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={item.isActive ? "default" : "ghost"}
            size="sm"
          >
            {item.label}
          </Button>
        </Link>
      ))}
      
      <div className="flex items-center space-x-2 ml-4">
        {loading ? (
          <Button variant="ghost" size="sm" disabled>
            Loading...
          </Button>
        ) : user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </div>
    </nav>
  )
}