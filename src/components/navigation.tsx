'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  
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
    <nav className={cn("flex space-x-4", className)}>
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
    </nav>
  )
}