import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'
import { ApiError } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Email and password are required'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    const data = await signIn(email, password)
    
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    })
    
  } catch (error: any) {
    console.error('Signin error:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'SIGNIN_FAILED',
        message: error.message || 'Invalid credentials',
        details: { error: error.message }
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 401 })
  }
}