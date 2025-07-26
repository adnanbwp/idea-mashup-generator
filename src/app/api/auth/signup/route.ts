import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'
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
    
    if (password.length < 6) {
      const errorResponse: ApiError = {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Password must be at least 6 characters long'
        },
        timestamp: new Date().toISOString()
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    const data = await signUp(email, password)
    
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Signup error:', error)
    
    const errorResponse: ApiError = {
      error: {
        code: 'SIGNUP_FAILED',
        message: error.message || 'Failed to create user',
        details: { error: error.message }
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorResponse, { status: 400 })
  }
}