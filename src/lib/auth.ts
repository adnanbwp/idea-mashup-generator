import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  email: string
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || ''
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}